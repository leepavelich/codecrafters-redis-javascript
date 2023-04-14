const net = require("net");
const assert = require("chai").assert;
const server = require("../app/main");

function createRESPCommand(commandArray) {
  return commandArray.reduce((acc, curr, idx) => {
    if (idx === 0) {
      acc = `*${commandArray.length}\r\n`;
    }
    acc += `$${curr.length}\r\n${curr}\r\n`;
    return acc;
  }, "");
}

function sendCommand(command, callback) {
  const client = net.createConnection({ port: process.env.PORT }, () => {
    client.write(createRESPCommand(command));
  });

  client.on("data", (data) => {
    callback(data);
    client.end();
  });
}

describe("Redis Clone", () => {
  before((done) => {
    if (server.listening) {
      done();
    } else {
      server.once("listening", done);
    }
  });

  it("should respond with PONG to PING command", (done) => {
    sendCommand(["PING"], (data) => {
      assert.equal(data.toString(), "+PONG\r\n");
      done();
    });
  });

  it("should respond with an ECHO of the input", (done) => {
    sendCommand(["ECHO", "hello"], (data) => {
      assert.equal(data.toString(), "$5\r\nhello\r\n");
      done();
    });
  });

  it("should respond with -1 for COMMAND command", (done) => {
    sendCommand(["COMMAND", "DOCS"], (data) => {
      assert.equal(data.toString(), "$-1\r\n");
      done();
    });
  });

  xit("should store a key-value pair using the SET command", (done) => {
    sendCommand(["SET", "mykey", "myvalue"], (data) => {
      assert.equal(data.toString(), "+OK\r\n");
      done();
    });
  });

  xit("should retrieve a value for a key using the GET command", (done) => {
    // First, set a key-value pair to ensure the value exists in the store
    sendCommand(["SET", "mykey", "myvalue"], (setData) => {
      assert.equal(setData.toString(), "+OK\r\n");

      // Then, try to retrieve the value using the GET command
      sendCommand(["GET", "mykey"], (getData) => {
        assert.equal(getData.toString(), "$7\r\nmyvalue\r\n");
        done();
      });
    });
  });

  xit("should return a nil response for a non-existent key using the GET command", (done) => {
    sendCommand(["GET", "nonexistentkey"], (data) => {
      assert.equal(data.toString(), "$-1\r\n");
      done();
    });
  });
});
