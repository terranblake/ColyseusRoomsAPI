import { RoomActions } from '../controllers';

module.exports = (express, dbPromise) => {
    const router = express.Router();

    router.route('/room')
        .get(async (req, res) => {
            console.log('GET        /api/room   -   get all rooms')
            const rooms = await RoomActions.getAllRooms(dbPromise);

            if (rooms)
                res.status(200).send({ message: 'retrieved all rooms', error: null, rooms: null })
            else
                res.status(400).send({ message: 'no rooms found', error: 1, rooms: null })
        })
        .post(async (req, res) => {
            console.log('POST       /api/room   -   create room')
            const result = await RoomActions.createRoom(req.body, dbPromise);

            if (result == 2)
                res.status(400).send({ message: null, error: 'scene, zone, id and type are required', rooms: null });
            else if (result == 1)
                res.status(400).send({ message: null, error: 'that room already exists', rooms: null })
            else
                res.status(200).send({ message: 'room created', error: null, rooms: null });
        })
        .delete(async (req, res) => {
            console.log('DELETE     /api/room   -   delete room')
            const result = await RoomActions.deleteRoom(req.body, dbPromise);

            if (result == 1)
                res.status(400).send({ message: 'could not find room', error: 1, rooms: null })
            else
                res.status(200).send({ message: 'deleted room', error: null, rooms: null })
        })

    router.route('/room/:scene/:zone/:type')
        .get(async (req, res) => {
            console.log('GET        /api/room   -   get valid room');
            const room = await RoomActions.getRoom(req.params, dbPromise);

            console.log(req.params);

            if (room)
                res.status(200).send({ message: 'room(s) found', error: null, room })
            else
                res.status(400).send({ message: 'no room found', error: 1, room })
        })

    return router;
}