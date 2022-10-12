export function logger(msg) {
    console.log(`${new Date().toISOString()} - ${msg}`)
}

export function loggerErr(err){
    logger("Error: " + err);
}
