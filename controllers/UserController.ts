const getUsers = async (res, dbPromise) => {
    try {
        const db = await dbPromise;
        const users = await db.all(`SELECT * FROM User`);

        if (users)
            res.status(200).send({ message: 'retrieved all users', error: null, users })
        else
            res.status(400).send({ message: 'no users found', error: null, users })
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
            const queryString = `
                INSERT INTO User 
                (
                    playfabid, 
                    displayName, 
                    createdAt, 
                    updatedAt
                ) 
                VALUES 
                (
                    '${playfabId}', 
                    '${displayName}', 
                    '${Date.now()}', 
                    '${Date.now()}'
                )
            `;

            const user = await db.get(queryString);
            res.status(200).send({ message: 'added new user to database', error: null, user: { playfabId, displayName } });
        }
        else
            res.status(400).send({ message: null, error: 'that user already exists' })
    } catch (err) {
        throw err;
    }
}

const updateUser = async (body, res, dbPromise) => {
    let { playfabId, isOnline, roomId, roomScene, roomZone } = body;

    try {
        const db = await dbPromise;
        const foundRoom = await db.get(`SELECT id FROM Room WHERE id = '${roomId}' AND scene = '${roomScene}' AND zone = '${roomZone}'`);
        const foundUser = await db.get(`SELECT playfabId FROM User WHERE playfabId = '${playfabId}'`);
        const dateNow = Date.now();

        const queryString = `
            UPDATE User
            SET isOnline =  '${isOnline}',
                roomId =    '${roomId}',
                roomScene = '${roomScene}',
                roomZone =  '${roomZone}',
                updatedAt = '${dateNow}'
            WHERE
                playfabId = '${playfabId}'
        `;

        console.log(queryString);

        if (foundRoom && foundUser) {
            await db.get(queryString);

            res.status(200).send({ message: 'updated user data', error: null, user: { playfabId, isOnline, roomId, roomScene, roomZone } });
        }
        else
            res.status(400).send({ message: null, error: 'room and/or user does not exist', playfabId, roomId, roomScene });
    } catch (err) {
        throw err;
    }
}

export {
    getUsers,
    createUser,
    updateUser
}