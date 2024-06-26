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

// const sequelize = new Sequelize("nomadland", "postgres", "postgres", {
//   host: "localhost",
//   dialect: "postgres",
//   port: 5432,
//   logging: true,
// });

const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Postgres DB has been connected");
    // await sequelize.sync({ force: true }).then(() => {
    //   console.log("Database & tables are recreated!");
    // });
  } catch (e) {
    console.error("Unable to connect to the database", e);
  }
};

module.exports = { connectToDB, sequelize };
