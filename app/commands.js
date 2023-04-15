const store = {};

const handleCommand = (connection, request) => {
  const [, , respCommand, , key, , value] = request;
  const sendResponse = (response) => connection.write(`${response}\r\n`);
  const sendNullResponse = () => sendResponse("$-1");

  const commandHandlers = {
    COMMAND: sendNullResponse,
    PING: () => sendResponse("+PONG"),
    ECHO: () => sendResponse(`$${key.length}\r\n${key}`),
    SET: () => {
      store[key] = value;
      sendResponse("+OK");
    },
    GET: () => {
      const response = store[key];
      sendResponse(response ? `$${response.length}\r\n${response}` : "$-1");
    },
  };

  const command = respCommand.toUpperCase();

  return (commandHandlers[command] || sendNullResponse)();
};

module.exports = handleCommand;
