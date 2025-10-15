import {Word} from "./Word";
import pool from "../config/db"

export class WordList implements Iterable<Word> {
    public id: string;
    public entries: Word[];

    constructor(id: string, entries: Word[]) {
        this.id = id;
        this.entries = entries;
    }

    public size() {
        return this.entries.length;
    }

    public async createWordList(name: string, words: Word[]): Promise<string> {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // create a new word list
            const res = await client.query(
                `INSERT INTO wordlists (name, created_at) VALUES ($1, NOW()) RETURNING id`,
                [name]
            )

            // extract new word list's id to insert words
            const id = res.rows[0].id;

            // bulk import of words
            // INSERT INTO words (wordlist_id, word, definition)
            // VALUES
            // ($1, $2, $3),
            // ($1, $4, $5),
            // ($1, $6, $7)

            const values = words.map((_, i) => `( $1, $${i * 2 + 2}, $${i * 2 + 3})`)
                .join(', ')

            // form params [1234, apple, fruit, coffee, beverage]
            const params = [id];
            words.forEach((word) => {
                params.push(word.word, word.definition)
            });

            await client.query(
                `INSERT INTO words (wordlist_id, word, definition) VALUES ${values}`,
                params
            )

            await client.query('COMMIT');

            return id.toString()
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    public [Symbol.iterator](): Iterator<Word> {
        return this.entries[Symbol.iterator]();
    }
}
