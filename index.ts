import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser'
import { createServer } from 'http';
import { Server } from 'colyseus';
import { monitor } from '@colyseus/monitor';
import * as sqlite from 'sqlite';
const Promise = require('bluebird').Promise;

// Import demo room handlers
import { ChatRoom } from "./rooms/01-chat-room";
import { StateHandlerRoom } from "./rooms/02-state-handler";
import { AuthRoom } from "./rooms/03-auth";
import { DefaultRoom } from "./rooms/default-room";

const port = Number(process.env.PORT || 2567);
const app = express();
const dbPromise = Promise.resolve()
  .then(() => sqlite.open('./db.sqlite', { promise: Promise }))
  .then(db => db.migrate({ force: 'last' }));

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
  server: createServer(app)
});

app.set('gameServer', gameServer);

gameServer.register("chat", ChatRoom);
gameServer.register("chat_with_options", ChatRoom, {
  custom_options: "you can use me on Room#onInit"
});

gameServer.register("state_handler", StateHandlerRoom);
gameServer.register("auth", AuthRoom);
gameServer.register("default_room", DefaultRoom);

// app.use('/api/user', (req, res, next) => {
//   req.rawBody = '';

//   req.on('data', function (chunk) {
//     req.rawBody += chunk;
//   });

//   req.on('end', function () {
//     next();
//   });
// });

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', express.static(path.join(__dirname, "static")));
app.use('/colyseus', monitor(gameServer));

// API ROUTES
app.use('/api', require('./routes/room')(express, dbPromise));
app.use('/api', require('./routes/user')(express, dbPromise));

gameServer.onShutdown(function () {
  console.log(`game server is going down.`);
});

gameServer.listen(port);
console.log(`Listening on http://localhost:${port}`);