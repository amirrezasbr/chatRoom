import { io } from "socket.io-client";

let socket;

function connectSocket(token) {
  socket = io("https://amir-chat-app.liara.run", {
    extraHeaders: { token: token },
  });
}

export { socket, connectSocket };
