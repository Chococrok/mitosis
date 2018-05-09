const promisify = require("util").promisify;
const fs = require("fs");
const path = require("path");

const stat = promisify(fs.stat);

async function replicate() {
    let numCopy = 0;

    while (true) {
        try {
            while (true) {
                const status = await stat(path.join(__dirname, `index${numCopy}.js`));
                numCopy++;
            }
        
        } catch (notFoundError) {
            numCopy--
            mitosis(path.join(__dirname, `index${numCopy}.js`));
        }
    }

}

async function mitosis(path) {
    console.log("starting mitosis with path: " + path);

    try {
        const readStream = fs.createReadStream(path);
        const writeStream = fs.createWriteStream(path, "utf8");
        readStream.on("data", data => {
            console.log(data);
            writeStream.write(data, "utf8");
        });
        readStream.on("end", () => {
            console.log("deleting copy");
            //fs.unlink(path);

        });
    } catch (error) {
        console.log(error);
    }
}

replicate();