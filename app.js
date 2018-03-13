const express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
methodOverride = require("method-override"),
session = require("express-session"),
Proroutes = require("./routes/ProRoute"),
Newsroutes = require("./routes/NewsRoute"),
path = require("path");

mongoose.connect("mongodb://vanhoa66:hunghuong66@ds163918.mlab.com:63918/webnoithat");

app.set("view engine", "ejs");
app.set("views", "./views")
app.use(methodOverride("_method"));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true}));

//router
app.use(Proroutes);
app.use(Newsroutes);

app.listen(process.env.PORT || 3000, process.env.IP, function () {
    console.log("Server is running...");
  });