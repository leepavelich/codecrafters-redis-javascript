const store = {};

const handleCommand = (connection, request) => {
  const [, , commandRaw, , arg1, , arg2] = request;
  const command = commandRaw.toUpperCase();

  const commandHandlers = {
    COMMAND: () => handleCommandCommand(connection),
    PING: () => handlePingCommand(connection),
    ECHO: () => handleEchoCommand(connection, arg1),
    SET: () => handleSetCommand(connection, arg1, arg2),
    GET: () => handleGetCommand(connection, arg1),
  };

  const commandHandler = commandHandlers[command];

  if (commandHandlers[command]) {
    commandHandler();
  } else {
    connection.write(`-ERR unknown command '${command}'\r\n`);
  }
};

const handleCommandCommand = (connection) => {
  connection.write("$-1\r\n");
};

const handlePingCommand = (connection) => {
  connection.write("+PONG\r\n");
};

const handleEchoCommand = (connection, message) => {
  connection.write(`$${message.length}\r\n${message}\r\n`);
};

const handleSetCommand = (connection, key, value) => {
  store[key] = value;
  connection.write("+OK\r\n");
};

const handleGetCommand = (connection, key) => {
  const response = store[key];
  connection.write(
    response ? `$${response.length}\r\n${response}\r\n` : "$-1\r\n"
  );
};

module.exports = handleCommand;
