require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.POSTGRES_DATABASE, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: process.env.POSTGRES_SSH_CERTIFICATE,
    },
  },
});

const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Postgres DB has been connected");
  } catch (e) {
    console.error("Unable to connect to the database", e);
  }
};

module.exports = { connectToDB, sequelize };
