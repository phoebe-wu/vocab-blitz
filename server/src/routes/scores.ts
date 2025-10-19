import {Router, Request, Response} from "express";
import {Score} from "../models/Score";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    console.log(`Server:: /scores - body: ${JSON.stringify(req.body)}`);
    const { nickname, wordlist_id, score, attempts, time_ms, mode, retry } = req.body;

    if (!nickname || !wordlist_id || score == null) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const newScore = await Score.submitScore({
            nickname,
            wordlist_id,
            score,
            attempts,
            time_ms,
            mode,
            retry
        });
        res.status(201).json({ result: newScore });
    } catch (err: any) {
        console.error("Error inserting score:", err);
        res.status(500).json({ error: err.message || "Server error" });
    }
});

export default router;
