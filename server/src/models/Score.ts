import {AttemptMode, GameMode} from "./GameMode";
import pool from "../config/db"

export class Score {
    public id?: number;
    public wordlist_id: string;
    public nickname: string;
    public score: number;
    public attempts: number;
    public time_ms: number;
    public mode: GameMode;
    public retry: AttemptMode;
    public readonly created_at? : Date

    constructor(wordlist_id: string, nickname: string, score: number, attempts: number, time_ms: number, mode: GameMode, retry: AttemptMode, id?: number, created_at? : Date) {
        this.id = id;
        this.wordlist_id = wordlist_id;
        this.nickname = nickname;
        this.score = score;
        this.attempts = attempts;
        this.time_ms = time_ms;
        this.mode = mode;
        this.retry = retry;
        this.created_at = created_at;
    }

    public static async submitScore(score: Score): Promise<Score> {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const res = await client.query(
                `INSERT INTO scores (wordlist_id, nickname, score, attempt, time_ms, mode, retry) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, created_at`,
                [score.wordlist_id, score.nickname, score.score, score.attempts, score.time_ms, score.mode, score.retry]
            )

            await client.query("COMMIT");

            const {id, created_at} = res.rows[0];
            return new Score(score.wordlist_id, score.nickname, score.score, score.attempts, score.time_ms, score.mode, score.retry, id, created_at)
        } catch(err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }


}
