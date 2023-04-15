const net = require("net");
const { PORT, ENV } = require("./config");
const handleCommand = require("./commands");

const parseResp = (data) => data.toString().split(/[\r\n]+/);

const server = net.createServer((connection) => {
  if (ENV !== "test") console.log("Client connected.");

  connection.on("data", (data) => handleCommand(connection, parseResp(data)));
});

server.listen(PORT, "127.0.0.1");

module.exports = server;
