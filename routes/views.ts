import { UserActions, RoomActions } from '../controllers';

module.exports = (express, dbPromise) => {
    const router = express.Router();

    router.route('/')
        .get(async (req, res) => {
            console.log('GET        /           -   view home');

            res.status(200).render('home');
        })

    router.route('/users')
        .get(async (req, res) => {
            console.log('GET        /users      -   view all users');

            const users = await UserActions.getAllUsers(dbPromise);
            res.status(200).render('users', users);
        })

    router.route('/rooms')
        .get(async (req, res) => {
            console.log('GET        /rooms      -   view all rooms');

            const rooms = await RoomActions.getAllRooms(dbPromise);
            res.status(200).render('rooms', rooms);
        })

    return router;
}