import express, {Application, Request, Response} from "express";
import * as http from "node:http";
import cors from "cors";
import router from "./Router";

export default class Server {
    private readonly port: number;
    private express: Application;
    private server: http.Server | undefined

    constructor(port: number) {
        console.info(`Server::<init>( ${port} )`);
        this.port = port;
        this.express = express();

        this.registerMiddleware();
        this.registerRoutes();

    }

    /**
     * Starts the server. Returns a promise that resolves if success.
     *
     * @returns {Promise<void>}
     */
    public start(): Promise<void> {
        return new Promise((resolve, reject) => {
            console.info("Server::start() - start");
            if (this.server !== undefined) {
                console.error(`Server::start() - server already listening on port: ${this.port}`);
                reject();
            } else {
                this.server = this.express.listen(this.port, () => {
                    console.info(`Server::start() - server listening on port: ${this.port}`);
                    resolve();
                }).on("error", (err: Error) => {
                    // catches errors in server start
                    console.error(`Server::start() - server ERROR: ${err.message}`);
                    reject(err);
                });
            }
        });
    }

    /**
     * Stops the server. Returns a promise so we know when the connections have
     * actually been fully closed and the port has been released.
     *
     * @returns {Promise<void>}
     */
    public stop(): Promise<void> {
        console.info("Server::stop()");
        return new Promise((resolve, reject) => {
            if (this.server === undefined) {
                console.error("Server::stop() - ERROR: server not started");
                reject();
            } else {
                this.server.close(() => {
                    console.info("Server::stop() - server closed");
                    resolve();
                });
            }
        });
    }

    // Registers middleware to parse request before passing them to request handlers
    private registerMiddleware() {
        this.express.use(express.json());
        this.express.use(express.raw({type: "application/*", limit: "10mb"}));

        // enable cors in request headers to allow cross-origin HTTP requests
        this.express.use(cors());
    }

    // Registers all request handlers to routes
    private registerRoutes() {
        this.express.use("/api", router);
    }

}
