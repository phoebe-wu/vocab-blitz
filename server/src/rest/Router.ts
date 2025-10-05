import {Request, Response} from "express";

export default class Router {

    public static echo(req: Request, res: Response) {
        try {
            console.log(`Server::echo(..) - params: ${JSON.stringify(req.params)}`);
            const response = Router.performEcho(req.params.msg!);
            res.status(200).json({result: response});
        } catch (err) {
            res.status(400).json({error: err});
        }
    }

    private static performEcho(msg: string): string {
        if (typeof msg !== "undefined" && msg !== null) {
            return `${msg}...${msg}`;
        } else {
            return "Message not provided";
        }
    }
}
