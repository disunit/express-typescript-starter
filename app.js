"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const globals_1 = require("./config/globals");
const indexRoute = require("./routes/index");
class Server {
    static bootstrap() {
        return new Server();
    }
    constructor() {
        this.app = express();
        this.app.set("port", globals_1.globals.port || 8080);
        this.config();
        this.routes();
    }
    config() {
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "ejs");
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname, "public")));
        this.app.use(express.static(path.join(__dirname, "bower_components")));
        this.app.use(function (err, req, res, next) {
            let error = new Error("Not Found");
            err.status = 404;
            next(err);
        });
        this.app.listen(this.app.get("port"), () => {
            console.log(`Server listening on port ${this.app.get("port")} \nPress CTRL+C to quit`);
        });
        process.on("uncaughtException", (err) => {
            console.error(`un Caught exception: ${err} stack: ${err.stack}`);
        });
        process.on("SIGINT", () => { console.log("Bye bye!"); process.exit(); });
    }
    routes() {
        let router;
        router = express.Router();
        let index = new indexRoute.Index();
        router.get("/", index.index.bind(index.index));
        this.app.use(router);
    }
}
let server = Server.bootstrap();
module.exports = server.app;
