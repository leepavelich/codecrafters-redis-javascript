const net = require("net");

let DEV_MODE = false;

// comment out this line before submitting
// DEV_MODE = true;

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
