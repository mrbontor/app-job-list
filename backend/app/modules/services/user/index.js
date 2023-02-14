const Validator = require('../../../helpers/validateSchema');
const { UserModel } = require('../../models');
const { UserRepository, CacheRepository } = require('../../repositories');
const { GenerateSecurePassword, VerifySecurePassword } = require('gen-secure-password');
const { UnprocessableEntityError, BadRequestError, NotFoundError } = require('../../../helpers/exceptions');

const userData = (payload, other = {}, isUpdate = false) => {
    const now = new Date();
    let defaultData = {
        ...other,
        createdAt: now,
        updatedAt: now
    };
    if (isUpdate) {
        delete defaultData.createdAt;
    }
    delete payload.password;
    return { ...payload, ...defaultData };
};

const Services = {
    createUser: async (payload) => {
        const user = await Validator.validateSchema(payload, UserModel.POST);

        const infoLogin = GenerateSecurePassword(payload.password);
        let dataUser = userData(user, { infoLogin });

        return await UserRepository.save(dataUser, infoLogin);
    },

    updateUser: async (IdentityNumber, payload) => {
        const user = await Validator.validateSchema(payload, UserModel.PUT);

        const dataUser = userData(user, false);

        return await UserRepository.update(IdentityNumber, dataUser);
    },

    getUserByUsername: async (IdentityNumber, options) => {
        const user = await UserRepository.getUserByUsername(IdentityNumber, options);
        return user;
    },

    getUserByEmail: async (emailAddress, options) => {
        const user = await UserRepository.getUserByEmail(emailAddress, options);
        return user;
    },

    getAllUsers: async (query) => {
        const projection = {
            firstName: 1,
            userName: 1,
            emailAddress: 1,
            gender: 1,
            infoLogin: 1
        };
        return await UserRepository.getAllUsers(query, projection);
    },

    getTableUsers: async (query) => {
        const searchAbleFields = ['userName', 'firstName', 'emailAddress', 'gender'];

        const projection = {
            userName: 1,
            firstName: 1,
            emailAddress: 1,
            gender: 1,
            createdAt: 1,
            updatedAt: 1
        };

        return await UserRepository.getTableUsers(query, searchAbleFields, projection);
    },

    updateCredentialUser: async (userName, payload) => {
        const userCredential = await Validator.validateSchema(payload, UserModel.PATCH);

        const filter = { projection: { infoLogin: 1 } };
        const getUser = await UserRepository.getUserCredential(userName, filter);
        const isPasswordValid = VerifySecurePassword(getUser.infoLogin, userCredential.password);

        if (!isPasswordValid) throw new BadRequestError('Incorect Password');

        const newPassword = await GenerateSecurePassword(userCredential.newPassword);

        const { value } = await UserRepository.update(userName, { infoLogin: newPassword, devices: [] });
        return value;
    },

    deleteUser: async (userName) => {
        const { value } = await UserRepository.delete(userName);
        if (!value) {
            throw new BadRequestError('User not found');
        }
        return value;
    }
};

module.exports = Services;
