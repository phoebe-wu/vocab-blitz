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

router.get("/test-db", async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ success: true, now: result.rows[0] });
    } catch (err: any) {
        console.error("DB connection failed:", err);
        res.status(500).json({ success: false, error: err.message || err });
    }
});

export default router;
