const Validator = require('../../../helpers/validateSchema');
const { AuthModel } = require('../../models');
const { UserRepository, CacheRepository } = require('../../repositories');
const { VerifySecurePassword } = require('gen-secure-password');
const { Encrypt, Decrypt } = require('../../../libraries/encrypting/AEAD');
const {
    SignAccessToken,
    SignRefreshToken,
    VerifyRefreshToken,
    DecodeJwtToken
} = require('../../../libraries/encrypting/jwt');

const { UnprocessableEntityError, ForbiddenError } = require('../../../helpers/exceptions');

const { v4: Uuidv4 } = require('uuid');
const Dayjs = require('dayjs');
const UnAuthorizedError = require('../../../helpers/exceptions/unAuthorizedError');

/**
 *
 * @param {object} data
 */
const setJwtPayload = (data) => {
    return {
        userName: data.userName,
        emailAddress: data.emailAddress
    };
};

/**
 *
 * @param {Number} userName
 * @param {UUID} deviceId
 * @returns
 */
const keyAuthSession = (userName, deviceId) => {
    return `${userName}_${deviceId}`;
};

/**
 *
 * @param {object} dataUser
 * @param {object} userPayload
 */
const generateToken = async (dataUser, userPayload) => {
    const { deviceId, userName } = userPayload;

    const payload = setJwtPayload(dataUser);

    const accessToken = await SignAccessToken(payload);
    const refreshToken = await SignRefreshToken(
        Encrypt({
            // emailAddress: dataUser.emailAddress,
            userName: dataUser.userName,
            deviceId: deviceId
        })
    );

    const authKey = keyAuthSession(dataUser.userName, deviceId);
    //JWT expired base on config APP_REFRESH_TOKEN_EXPIRED in .env
    await CacheRepository.saveSession(authKey, refreshToken);

    const now = Dayjs();
    const modified = now.format();

    // store info device login
    const dataDivece = {
        $set: { lastLogin: modified },
        $push: {
            divices: {
                ipAddress: userPayload.ipAddress,
                userAgent: userPayload.userAgent,
                deviceId: deviceId,
                updatedAt: modified
            }
        }
    };

    await UserRepository.updateCustom({ userName }, dataDivece);

    return { accessToken, refreshToken, deviceId };
};

module.exports = {
    signIn: async (payload) => {
        const payloadValid = await Validator.validateSchema(payload, AuthModel.SIGNIN);

        const user = await UserRepository.getUserByEmail(payloadValid.emailAddress);
        if (!user) {
            throw new UnAuthorizedError();
        }

        const isPasswordValid = VerifySecurePassword(user.infoLogin, payloadValid.password);
        if (!isPasswordValid) {
            // throw new BadRequestError("Incorect Password or Username!");
            throw new UnAuthorizedError();
        }

        const loginId = Uuidv4();

        const token = await generateToken(user, payloadValid, loginId);

        return token;
    },

    /**
     * Refresh token only used once!
     * @param {object} payload
     */
    refreshToken: async (payload) => {
        try {
            const payloadValid = await Validator.validateSchema(payload, AuthModel.REFRESH_TOKEN);

            const isTokenValid = await VerifyRefreshToken(payloadValid.refreshToken);

            const decryptedPayload = JSON.parse(Decrypt(isTokenValid.data));

            const user = await UserRepository.getUserByUsername(decryptedPayload.userName);
            if (!user) {
                throw new ForbiddenError();
            }

            const clause = { userName: decryptedPayload.userName };

            //check token stored
            const authKey = keyAuthSession(decryptedPayload.userName, payloadValid.deviceId);
            const getCurrentRefreshToken = await CacheRepository.getSession(authKey);
            if (!getCurrentRefreshToken) {
                throw new ForbiddenError('Nice try :-');
            }

            //remove currentToken
            await CacheRepository.removeSession(authKey);

            //genereta new accessToken and refreshToken
            const token = await generateToken(user, payloadValid);

            return token;
        } catch (err) {
            //detect reuse token, anomaly
            if (err.message === 'jwt expired') {
                const expiredToken = await DecodeJwtToken(payload.refreshToken);
                const decodeExpiredToken = JSON.parse(Decrypt(expiredToken.data));

                // remove token from cache
                const authKey = keyAuthSession(decryptedPayload.userName, payloadValid.deviceId);
                await CacheRepository.removeSession(authKey);
                //remove info device from db
                // await UserRepository.updateCustom(
                //     { emailAddress: decodeExpiredToken.emailAddress },
                //     { $unset: { devices: 1 } }
                // );

                throw new ForbiddenError();
            } else {
                throw err;
            }
        }
    },

    signOut: async (payload) => {
        const payloadValid = await Validator.validateSchema(payload, AuthModel.SIGNOUT);

        const isTokenValid = await VerifyRefreshToken(payloadValid.refreshToken);

        const decryptedPayload = JSON.parse(Decrypt(isTokenValid.data));

        const user = await UserRepository.getUserByEmail(decryptedPayload.userName);
        if (!user) {
            throw new UnAuthorizedError();
        }

        const authKey = keyAuthSession(decryptedPayload.userName, payloadValid.deviceId);
        await CacheRepository.removeSession(authKey);

        //Alldevices = true, remove all info devices and refresh token
        let removeDevice = {};
        if (payloadValid.allDevices) {
            removeDevice = { $unset: { devices: 1 } };
            await CacheRepository.removeAllActiveSession(decryptedPayload.userName);
        } else {
            // logout current device
            removeDevice = {
                $pull: {
                    devices: { devices: payloadValid.deviceId }
                }
            };
            await CacheRepository.removeSession(decryptedPayload.userName);
        }
        await UserRepository.updateCustom({ userName: decryptedPayload.userName }, removeDevice);

        return true;
    }
};
