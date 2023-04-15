const dotenv = require("dotenv");
const configPath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: configPath });

module.exports = {
  PORT: process.env.PORT || 6379,
  ENV: process.env.NODE_ENV || "production",
};
