const store = {};

const handleCommand = (
  connection,
  [, , respCommand, , key, , value, flag, expireTime]
) => {
  const command = respCommand.toUpperCase();
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
    EXPIRE: () => {
      if (key in store) {
        sendResponse(":1");
        return setTimeout(() => delete store[key], value * 1000);
      }
      sendResponse(":0");
    },
  };

  const defaultHandler = () => sendNullResponse();
  return (commandHandlers[command] || defaultHandler)();
};

module.exports = handleCommand;
