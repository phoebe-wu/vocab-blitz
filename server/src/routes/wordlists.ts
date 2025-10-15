import {Router, Request, Response} from "express";
import pool from "../config/db"

const router = Router();

router.get("/echo/:msg", (req: Request, res: Response) => {
    try {
        const msg = req.params.msg;

        console.log(`Server::echo(..) - params: ${JSON.stringify(req.params)}`);

        const response = msg ? `${msg}...${msg}` : "Message not provided";

        res.status(200).json({ result: response });
    } catch (err: any) {
        res.status(400).json({ error: err.message || err });
    }
});

export default router;
