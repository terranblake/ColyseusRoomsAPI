// const getRoom = async (params, dbPromise) => {
//     let { scene, zone, type } = params;

//     try {
//         const db = await dbPromise;
//         const room = db.get(`SELECT id FROM Room WHERE scene = '${scene}' AND zone = '${zone}' AND type = '${type}'`);

//         return room ? room : null;
//     } catch (err) {
//         throw err;
//     }
// }

const getRooms = async (params, dbPromise) => {
    let { scene, zone, type } = params;

    try {
        const db = await dbPromise;
        const rooms = await db.all(`SELECT id FROM Room WHERE scene = '${scene}' AND zone = '${zone}' AND type = '${type}'`);

        return rooms ? rooms : null;
    } catch(err) {
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
            return 0;
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
    getRooms,
    getAllRooms,
    createRoom,
    deleteRoom
}