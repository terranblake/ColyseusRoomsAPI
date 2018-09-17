const getRooms = async (res, dbPromise) => {
    try {
        const db = await dbPromise;
        const rooms = await db.all(`SELECT * FROM Room`);

        if (rooms)
            res.status(200).send({ message: 'retrieved all rooms', error: null, rooms })
        else
            res.status(400).send({ message: 'no rooms found', error: 1, rooms })
    } catch (err) {
        throw err;
    }
}

const createRoom = async (body, res, dbPromise) => {
    let { id, scene, zone, maxSize, type } = body;

    if (id && scene && zone && type) {
        const db = await dbPromise;
        const foundRoom = await db.get(`SELECT id FROM Room WHERE id = '${id}' AND scene = '${scene}' AND zone = '${zone}'`);

        if (!foundRoom) {
            await db.get(`INSERT INTO Room (id, scene, zone, maxSize, type) VALUES ('${id}', '${scene}', '${zone}', '${maxSize}', '${type}');`)

            res.status(200).send({ message: 'created new room', error: 0 });
        } else {
            res.status(400).send({ message: 'room with the same id and scene already exists', error: 1 });
        }
    } else
        res.status(400).send({ message: 'id, scene, zone and type are required to create a new room', error: 1 });
}

const deleteRoom = async (body, res, dbPromise) => {
    let { id, scene, zone } = body;

    let db = await dbPromise;
    let foundRoom = await db.get(`SELECT id FROM Room WHERE id = '${id}' AND scene = '${scene}' AND zone = '${zone}`);

    if (foundRoom) {
        await db.get(`DELETE FROM Room WHERE id = '${id}' AND scene = '${scene}' AND zone = '${zone}`)

        res.status(200).send({ message: 'deleted room', error: null })
    } else {
        res.status(400).send({ message: 'could not find room', error: 1 })
    }
}

export {
    getRooms,
    createRoom,
    deleteRoom
}