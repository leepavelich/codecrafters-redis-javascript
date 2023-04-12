const net = require("net");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
  // Handle connection
});

server.listen(6379, "127.0.0.1");
