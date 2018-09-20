import { updateUser } from './UserController';

const getRoom = async (params, dbPromise) => {
    const db = await dbPromise;
    let { playfabId, scene, zone, type } = params;

    try {
        const rooms = await db.get(`SELECT id, maxSize FROM Room WHERE scene = '${scene}' AND zone = '${zone}' AND type = '${type}'`);
        rooms.forEach(room => {
            const userCount = db.get(`SELECT COUNT(playfabId) FROM User WHERE roomScene = '${scene}' AND roomZone = '${zone}'`);

            if (parseInt(userCount) < parseInt(room.maxSize)) {
                updateUser({ playfabId, isOnline: false, roomId: room.id, roomScene: scene, roomZone: zone }, dbPromise);

                return room.scene + "_" + room.zone + "#" + room.id;
            }
        });

        let newId = (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000).toString()

        createRoom({ newId, scene, zone, maxSize: "15", type }, dbPromise);
        updateUser({ playfabId, isOnline: false, roomId: newId, roomScene: scene, roomZone: zone }, dbPromise);
        
        return scene + "_" + zone + "#" + newId;
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