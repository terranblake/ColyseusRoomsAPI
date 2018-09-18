import { Room } from "colyseus";
import { RoomActions, UserActions } from '../controllers'
import * as sqlite from 'sqlite';

export class DefaultRoom extends Room<any> {
    id: String = '';
    scene: String = '';
    zone: String = '';
    maxSize: number = -1;
    db;

    async onInit(options) {
        this.id = options.id;
        this.scene = options.scene;
        this.zone = options.zone;
        this.maxSize = options.maxSize;

        const Promise = require('bluebird').Promise;
        const dbPromise = Promise.resolve()
            .then(() => sqlite.open('./db.sqlite', { promise: Promise }))
            .then(db => db.migrate({ force: 'last' }));

        this.db = dbPromise;

        RoomActions.createRoom({
            id: this.id,
            scene: this.scene,
            zone: this.zone,
            maxSize: this.maxSize,
            type: "default_room"
        }, this.db);

        console.log(
            {
                message: "Init room",
                options
            }
        );
    }

    onJoin(client, options, auth) {
        console.log(this.scene, this.id, ':', client.sessionId, options.playfabId, "joined!");

        UserActions.updateUser({
            playfabId: options.playfabId,
            isOnline: "1",
            roomId: this.id,
            roomScene: this.scene,
            roomZone: this.zone,
        }, this.db);
    }

    requestJoin(options) {
        console.log("Request Join!");
        return true;
    }

    onMessage(client, message: any) {

    }

    onLeave(client) {
        console.log(this.scene, this.id, ':', client.sessionId, "left!");
    }

}