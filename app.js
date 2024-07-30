var express = require('express')
var path = require('path')
var routeApi = require("./routes/api.route")
var routeWebsite = require("./routes/website.route")

var app = express()

app.set("port", process.env.PORT || 3000)

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(express.static(__dirname + '/public'));
app.use("/", routeWebsite);
app.use("/api", routeApi);

app.listen(app.get("port"), () => {
    console.log("Server started on port " + app.get("port"))
})