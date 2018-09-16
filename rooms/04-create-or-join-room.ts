import { Room } from "colyseus";

export class DefaultRoom extends Room<any> {
    name = "";
    maxClients = 15;

    onInit(options) {
        console.log(
            { 
                message: "Init room",
                options
            }
        );
    }

    onJoin(client, options, auth) {
        console.log("DefaultRoom:", client.sessionId, "joined!");
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
        console.log("DefaultRoom:", client.sessionId, "left!");
    }

}