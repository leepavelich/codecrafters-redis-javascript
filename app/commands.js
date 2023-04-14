const handleCommand = (connection, request) => {
  const commandLookup = {
    COMMAND: () => connection.write("$-1\r\n"),
    PING: () => connection.write("+PONG\r\n"),
    ECHO: () => {
      const response = request[4];
      connection.write(`$${response.length}\r\n${response}\r\n`);
    },
    SET: () => {},
    GET: () => {},
  };

  const command = request[2].toUpperCase();
  const commandHandler = commandLookup[command];

  if (commandHandler) {
    commandHandler();
  } else {
    connection.write(`-ERR unknown command '${command}'\r\n`);
  }
};

module.exports = handleCommand;
