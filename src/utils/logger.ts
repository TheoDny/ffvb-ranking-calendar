const error = (err: any, msg: string = "", location = "") => {
    console.error(" ====  " + location + " " + new Date().toLocaleString() + " - ERROR " + msg + " ====\n", err, "\n ==== END ERROR ====")
}

const info = (info: any, location = "") => {
    console.log(" ==== " + new Date().toLocaleString() + " - INFO " + location + " ====\n", info, "\n ==== END INFO ====")
}

const log = (info: any, location = "") => {
    console.log(" ==== " + new Date().toLocaleString() + " - LOG " + location + " ====\n", info, "\n ==== END LOG ====")
}

export default {
    error,
    info,
    log
}
