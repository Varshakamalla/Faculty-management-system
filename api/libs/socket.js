import { Server } from "socket.io";
import { createLeaveRequest } from "../controllers/leaveRequest.controller.js";

export async function socket(server) {
  const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

  const io = new Server(server, {
    cors: { origin: CLIENT_URL },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("send_message", async (data) => {
      const dbData = await createLeaveRequest(data);
      if (dbData) socket.broadcast.emit("receive_message", dbData);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  io.on("message", (data) => {
    console.log(data);
  });
}
