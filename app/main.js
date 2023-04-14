const net = require("net");
const dotenv = require("dotenv");
const configPath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: configPath });

const PORT = process.env.PORT || 6379;

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

module.exports = server;
