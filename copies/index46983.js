const promisify = require("util").promisify;
const fs = require("fs");
const path = require("path");

const stat = promisify(fs.stat);

let numCopy = 0;

function replicate() {
    mitosis(__filename, path.join(__dirname, "copies", `index${++numCopy}.js`));
}

function mitosis(readPath, writePath) {
    console.log("starting mitosis with path: " + readPath);

    try {
        const readStream = fs.createReadStream(readPath);
        const writeStream = fs.createWriteStream(writePath, "utf8");
        readStream.on("data", data => {
            console.log(data);
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