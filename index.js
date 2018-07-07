const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

let numCopy = 0;

function replicate() {
    mitosis(__filename, path.join(__dirname, "children", `index${++numCopy}.js`));
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
            childProcess.exec(`node ${writePath}`, (error, stdout, stderr) => {
                if (error || stderr) {
                    console.error(`error, replicating again`);
                    replicate();
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            });
        });
        writeStream.on("error", error => {
            fs.mkdir(path.join(__dirname, "children"));
            mitosis(__filename, path.join(__dirname, `index${++numCopy}.js`));
        })
    } catch (error) {
        console.log(error);
    }
}

replicate();