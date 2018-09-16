import { Room } from "colyseus";

export class DefaultRoom extends Room<any> {
    id: String = '';
    scene: String = '';
    maxClients: number = -1;

    onInit(options) {
        this.id = options.id;
        this.scene = options.scene;
        this.maxClients = options.maxClients;

        console.log(
            { 
                message: "Init room",
                options
            }
        );
    }

    onJoin(client, options, auth) {
        console.log(this.scene, this.id, ':', client.sessionId, "joined!");
    }

    requestJoin(options, isNewRoom: boolean) {
        console.log("Request Join!");
        return (options.create)
            ? (options.create && isNewRoom)
            : this.clients.length > 0;
    }

    onMessage(client, message: any) {

    }

    onLeave(client) {
        console.log(this.scene, this.id, ':', client.sessionId, "left!");
    }

}