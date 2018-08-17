import express = require("express");
import * as bodyParser from "body-parser";
import * as path from "path";
import * as http from "http";
import { globals } from "./config/globals";

// Import Routes
import * as indexRoute from "./routes/index";

class Server {

    public app: express.Application;


    public static bootstrap(): Server {
        return new Server();
    }


    constructor() {

        this.app = express();   // Create Express application instance
        this.app.set("port", globals.port || 8080);

        this.config();          // App's configuration

        this.routes();          // Routes' configuration
    }

    // App's configuration
    private config() {
        //configure jade
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "ejs");

        //mount logger
        //this.app.use(logger("dev"));

        //mount json form parser
        this.app.use(bodyParser.json());

        //mount query string parser
        this.app.use(bodyParser.urlencoded({ extended: true }));

        //add static paths
        this.app.use(express.static(path.join(__dirname, "public")));
        this.app.use(express.static(path.join(__dirname, "bower_components")));

        // catch 404 and forward to error handler
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            let error = new Error("Not Found");
            err.status = 404;
            next(err);
        });


        this.app.listen(this.app.get("port"), () => {
            console.log(`Server listening on port ${this.app.get("port")} \nPress CTRL+C to quit`);
        });

        process.on("uncaughtException", (err: Error) => {
            console.error(`un Caught exception: ${err} stack: ${err.stack}`);
        });


        process.on("SIGINT", () => { console.log("Bye bye!"); process.exit(); });
    }


    // Routes' configuration
    private routes() {
        //get router
        let router: express.Router;
        router = express.Router();

        //create routes
        let index: indexRoute.Index = new indexRoute.Index();

        //home page
        router.get("/", index.index.bind(index.index));

        //use router middleware
        this.app.use(router);
    }
}

let server = Server.bootstrap();
export = server.app;