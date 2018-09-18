import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
const config = require('../config');

const hashes = async (playfabId, displayName, dbPromise) => {
    const db = await dbPromise;

    bcrypt.hash(playfabId + displayName, config.salt, (err, hash) => {
        let queryString = `
            UPDATE User
            SET 
                hashedPass  =   '${hash}'
            WHERE 
                playfabId   =   '${playfabId}',
                displayName =   '${displayName}'
        `;

        db.run(queryString);
    });
}

const compares = async (playfabId, displayName, hashed) => {
    return await bcrypt.compare(playfabId + displayName, hashed);
}

// put token => var token = req.headers['x-access-token'];
const createsToken = (hashed) => {
    return jwt.sign({ id: hashed }, config.secret, {
        expiresIn: 86400 // 24 hours
    });
}

const validatesToken = async (token) => {
    if (!token)
        return null;

    return await jwt.verify(token, config.secret);
}

export {
    hashes,
    compares,
    createsToken,
    validatesToken
}