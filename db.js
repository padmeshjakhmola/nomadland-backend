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
  sequelize = new Sequelize("nomadland", "postgres", "postgres", {
    host: "localhost",
    dialect: "postgres",
    port: 5432,
    logging: (msg) => {
      console.log(`connected_DEV_DB: ${msg}`);
    },
  });
  redisClient.flushall();
}

const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    // console.log("Postgres DB has been connected");
    // await sequelize.sync({ force: true }).then(() => {
    //   console.log("Database & tables are recreated!");
    // });
  } catch (e) {
    console.error("Unable to connect to the database", e);
  }
};

module.exports = { connectToDB, sequelize };
