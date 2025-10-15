import {Word} from "../models/Word";

export function parsePlainText(text: string): Word[] {
    if (!text) {
        throw new Error("Cannot parse words from empty word list!")
    }
    const lines = text.split('\n');
    const words: Word[] = [];

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        const [word, ...definition] = line.split("=");
        if (!word || definition.length === 0) continue;
        words.push(new Word(word.trim(), definition.join("=")))
    }

    return words

}
