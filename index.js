const app = require("./app");
const { connectToDB } = require("./db");

const port = process.env.PORT || 3001;

connectToDB();

app.listen(port, () => console.log(`Nomadland listening on port ${port}!`));
