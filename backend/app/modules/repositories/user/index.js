const Mongo = require('../../../libraries/db/mongoDb');
const client = Mongo.getDb().db();
const Logging = require('../../../helpers/logging');
const CacheRepository = require('../cache');
const MongoPaginator = require('mongodb-pagination');
const { buildQueryMongoPagination, buildResponsePagination } = require('../../../helpers/mongoDbPagination');
const {
    UnprocessableEntityError,
    GeneralError,
    BadRequestError,
    NotFoundError
} = require('../../../helpers/exceptions');

const COLLECTION_NAME = 'user';

module.exports = {
    save: async (data = {}, options = {}) => {
        const user = await client.collection(COLLECTION_NAME).insertOne(data, options);
        if (!user.insertedId) {
            throw new GeneralError('Something went wrong, please try again!');
        }
        await CacheRepository.save(data.userName, data);

        await client.collection(COLLECTION_NAME).createIndexes([
            { name: 'userName', key: { userName: 1 }, unique: true },
            { name: 'emailAddress', key: { emailAddress: -1 }, unique: true }
        ]);
        return user.insertedId;
    },

    update: async (userName, payload = {}) => {
        const data = { $set: payload };
        const options = { upsert: false, returnDocument: 'after' };
        const updateUser = await client.collection(COLLECTION_NAME).findOneAndUpdate({userName}, data, options);
        if (!updateUser.value) throw new NotFoundError('User not found!');
        await CacheRepository.save(userName, updateUser.value);
        return updateUser.value;
    },

    updateCustom: async (filter, payload = {}) => {
        let update = await client.collection(COLLECTION_NAME).updateOne(filter, payload);
        return update;
    },

    getUserByUsername: async (userName, projection = {}) => {
        const cache = await CacheRepository.get(userName);
        if (cache) {
            return cache;
        }

        const user = await client.collection(COLLECTION_NAME).findOne({ userName }, projection);
        if (!user) throw new NotFoundError('User not found!');
        await CacheRepository.get(user.userName, user);
        return user;
    },

    getUserByEmail: async (emailAddress, projection = {}) => {
        const cache = await CacheRepository.getAll();
        if (cache && cache.length > 0) {
            const result = cache.filter((el) => el.emailAddress === emailAddress)[0];
            if (result.infoLogin) return result;
        }

        const user = await client.collection(COLLECTION_NAME).findOne({ emailAddress }, projection);

        if (!user) throw new NotFoundError('User not found!');

        await CacheRepository.save(user.userName, user);
        return user;
    },

    getUserCredential: async (userName, projection = {}) => {
        const user = await client.collection(COLLECTION_NAME).findOne({ userName }, projection);
        if (!user) throw new NotFoundError('User not found!');
        return user;
    },

    getAllUsers: async (payload = null, projection = null) => {
        const { search, emailAddress, userName } = payload;
        if (userName) {
            const cache = await CacheRepository.get(userName);
            return [cache];
        }
        if (payload !== {}) {
            const cache = await CacheRepository.getAll();
            return cache;
        }

        let query = {};
        let options = [{ $sort: { userName: 1 } }];

        if (search) {
            query.$or = [
                { userName: { $regex: search, $options: 'i' } },
                { emailAddress: { $regex: search, $options: 'i' } }
            ];

            options.push({ $limit: 10 });
        }

        let emailAddresss = [];
        if (emailAddress) {
            emailAddresss = emailAddress.replace(/\s/g, '').split(',');

            const ans = emailAddresss.map((el) => parseInt(el));
            query.emailAddress = { $in: ans };
        }
        let userNames = [];
        if (userName) {
            userNames = userName.replace(/\s/g, '').split(',');

            const ins = userNames.map((el) => parseInt(el));
            query.userName = { $in: ins };
        }

        if (projection) {
            options.push({ $project: projection });
        }
        const queryUser = [{ $match: query }, ...options];

        const users = (await client.collection(COLLECTION_NAME).aggregate(queryUser).toArray()) || [];
        return users;
    },

    getTableUsers: async (payload = {}, fieldSearch = [], projection = null) => {
        // /prepare configuration
        const mongoConfig = {
            client: client,
            collection: COLLECTION_NAME
        };

        const pagination = await MongoPaginator.buildPagination(mongoConfig, payload, fieldSearch, projection);
        return pagination;
    },

    delete: async (userName) => {
        await CacheRepository.remove(userName);
        return await client.collection(COLLECTION_NAME).findOneAndDelete({ userName }, { projection: { _id: 1 } });
    }
};
