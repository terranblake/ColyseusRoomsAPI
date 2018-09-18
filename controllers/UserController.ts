const getUser = async (searchBy, value, dbPromise) => {
    try {
        const db = await dbPromise;
        const users = await db.all(`SELECT playfabId, displayName FROM User WHERE ${searchBy} = '${value}'`);

        return users ? users : null;
    } catch (err) {
        throw err;
    }
}

const getAllUsers = async (dbPromise) => {
    try {
        const db = await dbPromise;
        const users = await db.all(`SELECT * FROM User`);

        return users ? users : null;
    } catch (err) {
        throw err;
    }
}

const createUser = async (body, dbPromise) => {
    let { playfabId, displayName } = body;

    try {
        const db = await dbPromise;
        const user = await db.get(`SELECT playfabId FROM User WHERE playfabId = '${playfabId}'`);

        if (!user) {
            const queryString = `
                INSERT INTO User (
                    playfabid, 
                    displayName, 
                    createdAt, 
                    updatedAt
                ) 
                VALUES (
                    '${playfabId}', 
                    '${displayName}', 
                    '${Date.now()}', 
                    '${Date.now()}'
                )`;

            await db.run(queryString);
            return 0;
        }
        else
            return 1;
    } catch (err) {
        throw err;
    }
}

const updateUser = async (body, dbPromise) => {
    let { playfabId, isOnline, roomId, roomScene, roomZone } = body;

    try {
        const db = await dbPromise;
        const foundRoom = await db.get(`SELECT id FROM Room WHERE id = '${roomId}' AND scene = '${roomScene}' AND zone = '${roomZone}'`);
        const foundUser = await getUser("playfabId", body.playfabId, dbPromise);
        const dateNow = Date.now();

        if (foundRoom && foundUser) {
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

            await db.run(queryString);
            return 0;
        }
        else
            return 1;
    } catch (err) {
        throw err;
    }
}

export {
    getUser,
    getAllUsers,
    createUser,
    updateUser
}