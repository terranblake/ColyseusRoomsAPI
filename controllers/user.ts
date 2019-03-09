import { deleteRoom } from './room';

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
        const users = await db.all(`SELECT * FROM User;`);

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
            const queryString = `INSERT INTO User (playfabId, displayName, isOnline, createdAt, updatedAt) VALUES ('${playfabId}', '${displayName}', '1', '${Date.now()}', '${Date.now()}');`;

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
    let { playfabId, isOnline, id, scene, zone } = body;

    try {
        const db = await dbPromise;
        const foundRoom = await db.get(`SELECT id FROM Room WHERE id = '${id}' AND scene = '${scene}' AND zone = '${zone}'`);
        const foundUser = await db.get(`SELECT playfabId, roomScene, roomZone, roomId FROM User WHERE playfabId = '${playfabId}'`);
        const dateNow = Date.now();

        if (foundRoom && foundUser) {
            const result = await db.get(`
                UPDATE User
                SET isOnline =  '${parseInt(isOnline) == 1}',
                    roomId =    '${id}',
                    roomScene = '${scene}',
                    roomZone =  '${zone}',
                    updatedAt = '${dateNow}'
                WHERE
                    playfabId = '${playfabId}'
            `);

            const usersInRoom = await db.all(`
                SELECT COUNT(*) 
                FROM User 
                WHERE 
                    roomId      = '${foundUser.roomId}' AND 
                    roomScene   = '${foundUser.roomScene}' AND
                    roomZone    = '${foundUser.roomZone}'
            `);

            if (usersInRoom[0]['COUNT(*)'] == 0) await deleteRoom({ id: foundUser.roomId, scene: foundUser.roomScene, zone: foundUser.roomZone }, dbPromise);

            return 0;
        }
        else {
            console.log('unable to find user or room');
            return 1;
        }
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