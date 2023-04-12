const net = require("net");

const server = net.createServer((connection) => {
  console.log("Client connected.");

  connection.on("data", (data) => {
    const [dataType, firstElement, command, ...rest] = data
      .toString()
      .trim()
      .split("\n");

    console.log(command);

    if (command === "ping") {
      connection.write("+PONG\r\n");
    }
  });
});

server.listen(6380, "127.0.0.1");
