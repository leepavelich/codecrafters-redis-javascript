const net = require("net");
const { expect } = require("chai");
const { promisify } = require("util");
const redisServer = require("../app/main");

const sleep = promisify(setTimeout);

const PORT = process.env.PORT;

describe("Redis Clone", () => {
  let client;

  before((done) => {
    if (redisServer.listening) {
      done();
    } else {
      redisServer.once("listening", done);
    }
  });

  after((done) => {
    redisServer.close(done);
  });

  beforeEach(() => {
    client = net.createConnection({ port: PORT, host: "127.0.0.1" });
  });

  afterEach(() => {
    client.end();
  });

  it("should respond with PONG to PING command", (done) => {
    client.once("data", (data) => {
      expect(data.toString()).to.equal("+PONG\r\n");
      done();
    });
    client.write("PING\r\n");
  });

  it("should respond with an ECHO of the input", (done) => {
    const input = "Hello, world!";
    client.once("data", (data) => {
      expect(data.toString()).to.equal(`$${input.length}\r\n${input}\r\n`);
      done();
    });
    client.write(`ECHO ${input}\r\n`);
  });

  it("should respond with -1 for COMMAND command", (done) => {
    client.once("data", (data) => {
      expect(data.toString()).to.equal("$-1\r\n");
      done();
    });
    client.write("COMMAND\r\n");
  });
});
