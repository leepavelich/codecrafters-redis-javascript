const net = require("net");
const handleCommand = require("./commands");

const ENV = process.env.NODE_ENV || "production";
const PORT = process.env.PORT || 6379;

const parseResp = (data) => data.toString().split(/[\r\n]+/);

const server = net.createServer((connection) => {
  if (ENV !== "test") console.log("Client connected.");

  connection.on("data", (data) => handleCommand(connection, parseResp(data)));
});

server.listen(PORT, "127.0.0.1");

module.exports = server;
