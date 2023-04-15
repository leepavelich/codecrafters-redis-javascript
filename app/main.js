const net = require("net");
const { PORT } = require("./config");
const handleCommand = require("./commands");

const server = net.createServer((connection) => {
  console.log("Client connected.");

  connection.on("data", (data) =>
    handleCommand(connection, data.toString().split(/[\r\n]+/))
  );
});

server.listen(PORT, "127.0.0.1");

module.exports = server;
