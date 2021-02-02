import express from "express";
const bodyParser = require("body-parser");
// const socketIO = require("socket.io");
// import * as socketio from "socket.io";
// const types = require("@types/socket.io");
const orderRoutes = require("./routes/order");

const port = process.env.NODE_PORT || 4848;

export function run() {
  const app = express();
  let http = require("http").Server(app);
  let io = require("socket.io")(http);
  require("./channels")(io);
  (global as any).io = io;
  app.use(bodyParser.json());
  app.use("/api/orders", orderRoutes);
  app.get("/", function (_, res) {
    res.type('text/plain').send("Food can be served");
  });
  return http.listen(port, function () {
    console.log(`listening on :${port}`);
  });
}

if (process.env.NODE_ENV !== 'testing') {
  run();
}
