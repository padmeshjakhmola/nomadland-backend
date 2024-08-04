const { createServer } = require("http");
const { Server } = require("socket.io");

function socketIo(app) {
  const server = createServer(app);

  console.warn("Sockets_Init");

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New_User_connected", socket.id);
  });

  app.set("io", io);

  return server;
}

module.exports = { socketIo };
