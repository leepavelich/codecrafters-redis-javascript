const net = require("net");
const dotenv = require("dotenv");
const configPath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: configPath });

const handleCommand = require("./commands");

const PORT = process.env.PORT || 6379;

const server = net.createServer((connection) => {
  console.log("Client connected.");

  connection.on("data", (data) => {
    const request = data.toString().trim().split("\r\n");
    handleCommand(connection, request);
  });
});

server.listen(PORT, "127.0.0.1");

module.exports = server;
