const moongoes = require("mongoose");
moongoes
  .connect(process.env.DB_Connection, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log(
      `Connected to Mongo! Database name: "${con.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

module.exports = moongoes;
