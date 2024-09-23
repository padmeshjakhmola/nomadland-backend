require("dotenv").config();
const { Sequelize } = require("sequelize");
const { redisClient } = require("./utils/redis");

let sequelize;

if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(process.env.POSTGRES_DATABASE, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: process.env.POSTGRES_SSH_CERTIFICATE,
      },
    },
    logging: (msg) => {
      console.log(`connected_PROD_DB: ${msg}`);
    },
  });
  redisClient.flushall();
} else {
  sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
      host: process.env.POSTGRES_HOST, // Use the environment variable for host.
      dialect: "postgres",
      port: process.env.POSTGRES_PORT, // Use the environment variable for port.
      logging: (msg) => {
        console.log(`connected_DEV_DB: ${msg}`);
      },
    }
  );
  redisClient.flushall();
}

const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Postgres DB has been connected");
  } catch (e) {
    console.error("Unable to connect to the database", e);
  }
};

module.exports = { connectToDB, sequelize };
