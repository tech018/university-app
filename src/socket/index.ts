import { NextFunction } from "express";
import { Server } from "http";
import { Socket } from "socket.io";
import verifyTokenSocket from "./middleware";
const SocketServer = (server: Server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket: Socket, next: NextFunction) => {
    verifyTokenSocket(socket, next);
  });

  io.on("connection", (socket: Socket) => {
    console.log("new connection", socket.id);

    socket.on("disconnect", () => {
      console.log("disconnected", socket.id);
    });
  });
};
export default SocketServer;
