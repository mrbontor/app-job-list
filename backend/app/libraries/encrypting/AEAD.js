/**
 * AEAD is Authentication Encrypting and Decrypting
 * author : mrbontor@gmail.com
 */

const Crypto = require('crypto');

const ALGORITM = 'sha512';
const CRYPTING_ALGORITM = 'aes-256-gcm';
const KEY = process.env.APP_KEY || 'OWM5YTc2NzM5ZjgyNGQ2Njg2OTJjZDFkMzE2ZTFlMWI=';


/**
 *
 * @param {String} text
 * @returns
 */
const encrypt = (text) => {
    let string = null;
    if (typeof text === 'object') {
        string = JSON.stringify(text);
    } else {
        string = text;
    }

    const iv = Crypto.randomBytes(12);

    const cipher = Crypto.createCipheriv(CRYPTING_ALGORITM, Buffer.from(KEY, 'base64'), iv);
    const encrypted = Buffer.concat([cipher.update(string), cipher.final()]);

    const auth = cipher.getAuthTag().toString('base64');

    const cipherText = JSON.stringify({
        iv: iv.toString('base64'),
        encryptedData: encrypted.toString('base64'),
        auth: auth
    });

    return Buffer.from(cipherText).toString('base64');
};

/**
 *
 * @param {String} text
 * @returns
 */
const decrypt = (text) => {
    const chiperText = JSON.parse(Buffer.from(text, 'base64'));

    const iv = Buffer.from(chiperText.iv, 'base64');

    const encryptedText = Buffer.from(chiperText.encryptedData, 'base64');
    const decipher = Crypto.createDecipheriv(CRYPTING_ALGORITM, Buffer.from(KEY, 'base64'), iv);

    const auth = Buffer.from(chiperText.auth, 'base64');
    decipher.setAuthTag(auth);

    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

    return decrypted.toString();
};

module.exports = {
    Encrypt: encrypt,
    Decrypt: decrypt
};
