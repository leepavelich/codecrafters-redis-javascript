const store = {};

const handleCommand = (connection, request) => {
  const commandLookup = {
    COMMAND: () => connection.write("$-1\r\n"),
    PING: () => connection.write("+PONG\r\n"),
    ECHO: () => {
      const response = request[4];
      connection.write(`$${response.length}\r\n${response}\r\n`);
    },
    SET: () => {
      const key = request[4];
      const value = request[6];
      store[key] = value;
      connection.write("+OK\r\n");
    },
    GET: () => {
      const requestKey = request[4];
      if (requestKey in store) {
        const response = store[requestKey];
        connection.write(`$${response.length}\r\n${response}\r\n`);
      } else {
        connection.write("$-1\r\n");
      }
    },
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
