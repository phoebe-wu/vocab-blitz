import pool from "../config/db"
import {WordList} from "./WordList";

export class Word {
    public word: string;
    public definition: string;

    constructor(word: string, definition: string) {
        this.word = word;
        this.definition = definition;
    }

    public async fetchWords(wordlist_id: number): Promise<Word[]> {
        const client = await pool.connect();
        try {
            const res = await client.query(
                `SELECT word, definition
               FROM words
               WHERE wordlist_id = $1`,
                [wordlist_id]
            )
            return res.rows;
        } finally {
            client.release();
        }
    }

}
