import { UserActions } from '../controllers';

module.exports = (express, dbPromise) => {
    const router = express.Router();

    router.route('/user')
        .get(async (req, res) => {
            console.log('GET        /api/user   -   get all users')
            const users = await UserActions.getAllUsers(dbPromise);

            if (users)
                res.status(200).send({ message: 'retrieved all users', error: null, users: null })
            else
                res.status(400).send({ message: 'no users found', error: null, users: null })
        })
        .post(async (req, res) => {
            console.log('POST       /api/user   -   create user')
            const result = await UserActions.createUser(req.body, dbPromise);

            if (result == 1)
                res.status(400).send({ message: null, error: 'that user already exists', users: null })
            else
                res.status(200).send({ message: 'added new user to database', error: null, users: null });
        })
        .put(async (req, res) => {
            console.log('PUT        /api/user   -   update user')
            const result = await UserActions.updateUser(req.body, dbPromise);

            if (result == 1)
                res.status(400).send({ message: null, error: 'room and/or user does not exist', users: null });
            else
                res.status(200).send({ message: 'updated user data', error: null, users: null });
        });

    router.route('/user/:searchBy/:value')
        .get(async (req, res) => {
            console.log('GET        /api/user   -   get user by property');
            const user = await UserActions.getUser(
                req.params.searchBy,
                req.params.value,
                dbPromise
            );

            if (user)
                res.status(200).send({ message: 'user found', error: null, users: user })
            else
                res.status(400).send({ message: 'no users found', error: null, users: user })
        });

    return router;
}