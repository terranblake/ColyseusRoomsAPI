import { AuthActions } from '../controllers';

module.exports = (express, dbPromise) => {
    const router = express.Router();

    router.route('/login')
        .post(async (req, res) => {
            let { id, name } = req.body;

            const db = await dbPromise;
            let hashed = db.get(`SELECT hashedPass FROM User WHERE playfabId = '${id}, displayName = '${name}'`);
            let valid = AuthActions.compares(id, name, hashed);

            if (!valid)
                res.status(400).send({ message: null, error: "Invalid id and name provided"});

            const token = AuthActions.createsToken(hashed);

            res.status(200).send({ message: "Signed token", error: null, token})
        })
}