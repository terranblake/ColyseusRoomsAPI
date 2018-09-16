import { getRooms, createRoom, deleteRoom } from '../controllers/RoomController';

module.exports = (express, dbPromise) => {
    const router = express.Router();

    router.route('/room')
        .get(async (req, res) => {
            console.log('GET    /api/room - get all rooms')
            
            getRooms(res, dbPromise);
        })
        .post((req, res) => {
            console.log('POST   /api/room - create room')

            createRoom(req.body, res, dbPromise);
        })
        .delete((req, res) => {
            console.log('DELETE /api/room - delete room')

            deleteRoom(req.body, res, dbPromise);
        })

    return router;
}