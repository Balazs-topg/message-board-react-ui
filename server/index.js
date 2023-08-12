const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://balazshevesi13:securePasswordYesYes@clusterzero.elrmtta.mongodb.net/?retryWrites=true&w=majority");

port = 3000;
app.listen(port, () => {
  console.log(`SERVER IS RUNNIG ON http://localhost:${port}/`);
});
