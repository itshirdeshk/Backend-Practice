const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`Welcome to NodeJS and Express JS in Docker`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});
