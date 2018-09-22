import { updateUser } from './UserController';

const getRoom = async (req, dbPromise) => {
    const db = await dbPromise;
    let { scene, zone, type } = req.body;
    let { playfabId } = req.params;

    try {
        const rooms = await db.all(`SELECT * FROM Room WHERE scene = '${scene}' AND zone = '${zone}'`);
        let roomToJoin;

        if (rooms) {
            roomToJoin = await rooms.find(async room => {
                const userCount = await db.all(`SELECT COUNT(*) FROM User WHERE roomScene = '${scene}' AND roomZone = '${zone}'`);
                return (userCount[0]['COUNT(*)'] < parseInt(room.maxSize))
            });
        }

        if (typeof roomToJoin == 'undefined') {
            let newId = (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000).toString()

            await createRoom({ id: newId, scene, zone, maxSize: "15", type }, dbPromise);
            roomToJoin = { playfabId, isOnline: true, id: newId, scene: scene, zone: zone };
        }

        await updateUser({ playfabId, isOnline: true, id: roomToJoin.id, scene: roomToJoin.scene, zone: roomToJoin.zone }, dbPromise);

        return scene + "_" + zone + "#" + roomToJoin.id;
    } catch (err) {
        throw err;
    }
}

const getRooms = async (params, dbPromise) => {
    let { scene, zone, type } = params;

    try {
        const db = await dbPromise;
        const rooms = await db.all(`SELECT id FROM Room WHERE scene = '${scene}' AND zone = '${zone}' AND type = '${type}'`);

        return rooms ? rooms : null;
    } catch (err) {
        throw err;
    }
}

const getAllRooms = async (dbPromise) => {
    try {
        const db = await dbPromise;
        const rooms = await db.all(`SELECT * FROM Room`);

        return rooms ? rooms : null;
    } catch (err) {
        throw err;
    }
}

const createRoom = async (body, dbPromise) => {
    let { id, scene, zone, maxSize, type } = body;

    if (id && scene && zone && type) {
        const db = await dbPromise;
        const foundRoom = await db.get(`SELECT id FROM Room WHERE id = '${id}' AND scene = '${scene}' AND zone = '${zone}'`);

        if (!foundRoom) {
            await db.run(`INSERT INTO Room (id, scene, zone, maxSize, type) VALUES ('${id}', '${scene}', '${zone}', '${maxSize}', '${type}');`)
            return { room: { id, scene, zone, type, maxSize } };
        } else {
            return 1;
        }
    } else
        return 2;
}

const deleteRoom = async (body, dbPromise) => {
    let { id, scene, zone } = body;

    let db = await dbPromise;
    let foundRoom = await db.get(`SELECT id FROM Room WHERE id = '${id}' AND scene = '${scene}' AND zone = '${zone}'`);

    if (foundRoom) {
        await db.get(`DELETE FROM Room WHERE id = '${id}' AND scene = '${scene}' AND zone = '${zone}'`)
        return 0;
    } else {
        return 1;
    }
}

export {
    getRoom,
    getRooms,
    getAllRooms,
    createRoom,
    deleteRoom
}