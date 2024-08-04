const server = require("./app");
const { connectToDB } = require("./db");

const port = process.env.PORT || 3001;

connectToDB();

server.listen(port, () => console.log(`Nomadland listening on port ${port}!`));
