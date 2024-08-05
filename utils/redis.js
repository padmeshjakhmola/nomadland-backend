require("dotenv").config();
const { Redis } = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URL);
const pubClient = new Redis(process.env.REDIS_URL);
const subClient = new Redis(process.env.REDIS_URL);

module.exports = { redisClient, pubClient, subClient };
