import {Response} from "express";

export const sendError = (res: Response, msg: string = "Internal server error", code: number = 500) => {
    res.status(code)
       .json({
           message: msg,
       })
}

export const missingParam = (res: Response, msg = "") => {
    res.status(400)
       .json({
           message: `Missing parameters${msg ? " :" + msg : ""}`,
       })
}

export const sendResponse = (res: Response, data: any, msg = "") => {
    res.status(200).json({
        message: msg,
        data: data
    });
}

export const sendFile = (res: Response, text: any, nameFile: string) => {
    res.set({"Content-Disposition": "attachment; filename=\"" + nameFile + "\""});
    res.send(text);
}