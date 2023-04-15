const fs = require("fs");

const config = JSON.parse(
  fs.readFileSync(
    `./config.${process.env.NODE_ENV || "production"}.json`,
    "utf-8"
  )
);

console.log(config);

module.exports = {
  PORT: config.PORT || 6379,
  ENV: process.env.NODE_ENV || "production",
};
