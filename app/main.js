const net = require("net");
require("dotenv").config();

const DEV_MODE = process.env.NODE_ENV === "development";
const PORT = DEV_MODE ? 6380 : 6379;

const server = net.createServer((connection) => {
  console.log("Client connected.");

  connection.on("data", (data) => {
    const request = data.toString().trim().split("\r\n");
    const command = request[2].toUpperCase();
    switch (command) {
      case "COMMAND":
        connection.write("$-1\r\n");
        break;
      case "PING":
        connection.write("+PONG\r\n");
        break;
      case "ECHO":
        const response = request[4];
        connection.write(`$${response.length}\r\n${response}\r\n`);
        break;
    }
  });
});

server.listen(PORT, "127.0.0.1");
