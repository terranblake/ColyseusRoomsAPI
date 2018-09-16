const getUsers = async (res, dbPromise) => {
    try {
        const db = await dbPromise;
        const users = await db.all(`SELECT * FROM User`);

        if (users)
            res.status(200).send({ message: 'retrieved all users', users })
        else
            res.status(400).send({ message: 'no users found', users })
    } catch (err) {
        throw err;
    }
}

const createUser = async (body, res, dbPromise) => {
    let { playfabId, displayName } = body;

    try {
        const db = await dbPromise;
        const user = await db.get(`SELECT playfabid FROM User WHERE playfabid = '${playfabId}'`);

        // `INSERT INTO users (playfabid, name, room) VALUES ('123456', 'test', 'temp');`
        if (!user) {
            const user = await db.get(`INSERT INTO User (playfabid, displayName, createdAt, updatedAt) values ('${playfabId}', '${displayName}', '${Date.now()}', '${Date.now()}')`);
            res.status(200).send({ message: 'added new user to database', user: { playfabId, displayName } });
        }
        else
            res.status(400).send({ message: 'that user already exists' })
    } catch (err) {
        throw err;
    }
}

const updateUser = async (body, res, dbPromise) => {
    let { playfabId, isOnline, roomId, roomScene } = body;

    try {
        const db = await dbPromise;
        const foundRoom = await db.get(`SELECT ? FROM Room WHERE id = ? AND scene = ?`, 'id', roomId, roomScene);
        const foundUser = await db.get(`SELECT ? FROM User WHERE playfabId = ?`, 'playfabId', playfabId);

        if (foundRoom && foundUser) {
            await db.get(`       \
                UPDATE User                     \
                SET isOnline = '${isOnline}',   \
                    roomId = '${roomId}',       \
                    roomScene = '${roomScene}'  \
                WHERE                           \
                    playfabId = '${playfabId}'  \
            `);

            res.status(200).send({ result: 'updated user data', error: null, user: { playfabId, isOnline, roomId, roomScene } });
        }
        else
            res.status(400).send({ result: null, error: 'room and/or user does not exist', playfabId, roomId, roomScene });
    } catch (err) {
        throw err;
    }
}

export {
    getUsers,
    createUser,
    updateUser
}