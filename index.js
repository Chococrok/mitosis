const fs = require("fs");
const path = require("path");

let numCopy = 0;

function replicate() {
    mitosis(__filename, path.join(__dirname, "copies", `index${++numCopy}.js`));
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function insertMutation(buffer) {
    buffer[random(0, buffer.length)] = random(32, 120);
    return buffer;
}

function mitosis(readPath, writePath) {
    console.log("starting mitosis with path: " + readPath);

    try {
        const readStream = fs.createReadStream(readPath);
        const writeStream = fs.createWriteStream(writePath, "utf8");
        readStream.on("data", data => {
            data = insertMutation(data);
            writeStream.write(data, "utf8");
        });
        readStream.on("end", () => {
            writeStream.end();
        })
        writeStream.on("finish", () => {
            if (readPath !== __filename) {
                console.log("deleting copy: " + readPath);
                fs.unlink(readPath, () => {
                    mitosis(path.join(__dirname, "copies", `index${numCopy}.js`), path.join(__dirname, "copies", `index${++numCopy}.js`));
                });
            } else {
                mitosis(path.join(__dirname, "copies", `index${numCopy}.js`), path.join(__dirname, "copies", `index${++numCopy}.js`));
            }
        });
    } catch (error) {
        console.log(error);
    }
}

replicate();