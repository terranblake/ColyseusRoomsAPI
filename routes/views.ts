module.exports = (express, dbPromise) => {
    const router = express.Router();

    router.route('/')
        .get(async (req, res) => {
            console.log('GET    /views/ - view home');

            res.status(200).render('home');
        })

    router.route('/users')
        .get(async (req, res) => {
            console.log('GET    /views/users - view all users');

            const db = await dbPromise;
            const users: Object = await db.all('SELECT * FROM User');

            res.status(200).render('users', users);
        })

    router.route('/rooms')
        .get(async (req, res) => {
            console.log('GET    /views/rooms - view all rooms');

            const db = await dbPromise;
            const rooms: Object = await db.all('SELECT * FROM Room');

            res.status(200).render('rooms', rooms);
        })

    return router;
}