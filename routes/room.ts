import { RoomActions } from '../controllers';

module.exports = (express, dbPromise) => {
    const router = express.Router();

    router.route('/room')
        .get(async (req, res) => {
            console.log('GET        /api/room   -   get all rooms')
            const rooms = await RoomActions.getAllRooms(dbPromise);

            if (rooms)
                res.status(200).send({ message: 'retrieved all rooms', error: null })
            else
                res.status(400).send({ message: 'no rooms found', error: 1 })
        })
        .post(async (req, res) => {
            console.log('POST       /api/room   -   create room')
            const result = await RoomActions.createRoom(req.body, dbPromise);

            if (result == 2)
                res.status(400).send({ message: null, error: 'scene, zone, id and type are required' });
            else if (result == 1)
                res.status(400).send({ message: null, error: 'that room already exists' })
            else
                res.status(200).send({ message: 'room created', error: null });
        })
        .delete(async (req, res) => {
            console.log('DELETE     /api/room   -   delete room')
            const result = await RoomActions.deleteRoom(req.body, dbPromise);

            if (result == 1)
                res.status(400).send({ message: 'could not find room', error: 1 })
            else
                res.status(200).send({ message: 'deleted room', error: null })
        })

    router.route('/room/:scene/:zone/:type')
        .get(async (req, res) => {
            console.log('GET        /api/room   -   get room by scene/zone/type');
            const rooms = await RoomActions.getRooms(req.params, dbPromise);

            if (rooms)
                res.status(200).send({ message: 'room(s) found', error: null, data: rooms })
            else
                res.status(400).send({ message: 'no room found', error: 1 })
        })

    return router;
}