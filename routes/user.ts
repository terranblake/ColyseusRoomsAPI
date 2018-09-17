import { getUsers, createUser, updateUser } from '../controllers/UserController';

module.exports = (express, dbPromise) => {
    const router = express.Router();

    router.route('/user')
        .get(async (req, res) => {
            console.log('GET    /api/user - get all users')

            getUsers(res, dbPromise);
        })
        .post(async (req, res) => {
            console.log('POST   /api/user - create user')

            createUser(req.body, res, dbPromise);
        })
        .put(async (req, res) => {
            console.log('PUT    /api/user - update user')

            console.log('RAW BODY ', req.rawBody);

            updateUser(req.body, res, dbPromise);
        });

    return router;
}