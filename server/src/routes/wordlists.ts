import {Router, Request, Response} from "express";
import {WordList} from "../models/WordList";
import pool from "../config/db"
import {parsePlainText} from "../utils/parser";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        console.log(`Server:: /wordlists - body: ${JSON.stringify(req.body)}`);

        const {name, text, words} = req.body;

        if (!text && !words) {
            return res.status(400).json({error: "Missing input: provide either 'text' or 'words'."});
        }

        // Parse words if given as text
        let parsedWords;
        if (text) {
            try {
                parsedWords = parsePlainText(text);
            } catch (err: any) {
                return res.status(400).json({error: `Invalid text format: ${err.message}`});
            }
        } else {
            parsedWords = words;
        }

        const result = await WordList.createWordList(name || "My Vocab Blitz", parsedWords);

        return res.status(201).json({result});
    } catch (err: any) {
        console.error("Error creating wordlist:", err);
        return res.status(500).json({error: err.message || "Internal server error"});
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    const id : string = req.params.id;

    if(!id) {
        return res.status(400).json({error: "Missing parameter: id"});
    }

    try {
        console.log(`Server:: /wordlists - params: ${JSON.stringify(req.params.id)}`);

        const words = await WordList.fetchWords(id);
        if (!words || words.length == 0) {
            return res.status(404).json({error: "words cannot be empty"});
        }
        return res.status(200).json({words});
    } catch (err: any) {
        console.error(`Error fetching words - wordlist id - ${id}`)
        return res.status(500).json({error: err.message || err });
    }
})

export default router;
