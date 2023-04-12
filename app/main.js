const net = require("net");

let DEV_MODE = false;

// comment out this line before submitting
// DEV_MODE = true;

const PORT = DEV_MODE ? 6380 : 6379;

const server = net.createServer((connection) => {
  console.log("Client connected.");

  connection.on("data", (data) => {
    connection.write("+PONG\r\n");
  });
});

server.listen(PORT, "127.0.0.1");
