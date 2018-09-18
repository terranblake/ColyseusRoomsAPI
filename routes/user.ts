import { User } from '../controllers';

module.exports = (express, dbPromise) => {
    const router = express.Router();

    router.route('/user')
        .get(async (req, res) => {
            console.log('GET        /api/user   -   get all users')
            const users = await User.getAllUsers(dbPromise);

            if (users)
                res.status(200).send({ message: 'retrieved all users', error: null })
            else
                res.status(400).send({ message: 'no users found', error: null })
        })
        .post(async (req, res) => {
            console.log('POST       /api/user   -   create user')
            const result = await User.createUser(req.body, dbPromise);

            if (result == 1)
                res.status(400).send({ message: null, error: 'that user already exists' })
            else
                res.status(200).send({ message: 'added new user to database', error: null });
        })
        .put(async (req, res) => {
            console.log('PUT        /api/user   -   update user')
            const result = await User.updateUser(req.body, dbPromise);

            if (result == 1)
                res.status(400).send({ message: null, error: 'room and/or user does not exist' });
            else
                res.status(200).send({ message: 'updated user data', error: null });
        });

    router.route('/user/:searchBy/:value')
        .get(async (req, res) => {
            console.log('GET        /api/user   -   get user by playfab id');
            const user = await User.getUser(
                req.params.searchBy,
                req.params.value,
                dbPromise
            );

            if (user)
                res.status(200).send({ message: 'user found', error: null, data: user })
            else
                res.status(400).send({ message: 'no users found', error: null })
        });

    return router;
}