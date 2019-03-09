import { UserActions, RoomActions, PlayfabActions } from '../controllers';

module.exports = (express, dbPromise) => {
    const router = express.Router();

    router.route('/')
        .get(async (req, res) => {
            res.status(200).render('home');
        })

    router.route('/users')
        .get(async (req, res) => {
            const users = await UserActions.getAllUsers(dbPromise);
            res.status(200).render('users', users);
        })

    router.route('/info')
        .post(async (req, res) => {
            await PlayfabActions.retrieveAccountInfo(req.body.PlayFabId, res);
        })

    router.route('/rooms')
        .get(async (req, res) => {
            const rooms = await RoomActions.getAllRooms(dbPromise);
            res.status(200).render('rooms', rooms);
        })

    return router;
}