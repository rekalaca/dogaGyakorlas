const http = require('http');
const fs = require('fs');
const port = 4455;

const server = http.createServer((req, res) => {
    console.log("Új kérés érkezett:");
    console.log(req.url);
    console.log(req.method);

    switch (true) {
        case req.url === "/" && req.method === "GET":
            fs.readFile("./view/index.html", "utf-8", (err, data) => {
                res.setHeader('Content-Type', 'text/html');
                res.writeHead(200);
                res.end(data);
            });
            break;

        case req.url === "/style.css" && req.method === "GET":
            fs.readFile("./view/style.css", "utf-8", (err, data) => {
                res.setHeader('Content-Type', 'text/css');
                res.writeHead(200);
                res.end(data);
            });
            break;

        case req.url === "/phones" && req.method === "GET":
            fs.readFile('./data/phones.json', (err, data) => {
                res.setHeader('Content-Type', 'application/json');
                res.writeHeader(200);
                res.end(data);
            })
            break;

        case req.url === "/mobile.js" && req.method === "GET":
            fs.readFile("./public/mobile.js", (err, data) => {
                res.setHeader('Content-Type', 'application/javascript');
                res.writeHead(200);
                res.end(data);
            });
            break;

        case req.url === "/phone.jpg" && req.method === "GET":
            fs.readFile("./view/phone.jpg", (err, data) => {
                res.setHeader('Content-Type', 'image/jpg');
                res.writeHead(200);
                res.end(data);
            });
            break;

        case req.url === "/phones" && req.method === "POST":
            let tartalom = '';
            req.on('data', (chunk) => {
                tartalom += chunk.toString();
            });

            req.on('end', () => {
                const newPhone = JSON.parse(tartalom);

                if (!validateMarka(newPhone.marka)) {
                    console.log("A Gyártót nem adtad meg!")
                    return;
                }
                if (!validateTipus(newPhone.tipus)) {
                    console.log("A Típust nem adtad meg!")
                    return;
                }
                if (!validateAr(newPhone.ar)) {
                    console.log("Ezer forint alatt csak játéktelefont kapni!")
                    return;
                }

                fs.readFile("./data/phones.json", (err, data) => {
                    let telok = JSON.parse(data);
                    telok.push({
                        marka: newPhone.marka,
                        tipus: newPhone.tipus,
                        ar: newPhone.ar
                    });
                    fs.writeFile('./data/phones.json', JSON.stringify(telok), () => {
                        res.end(JSON.stringify(newPhone));
                    })
                })
            });
            break;

        default:
            fs.readFile("./view/error.html", "utf-8", (err, file) => {
                res.setHeader('Content-Type', 'text/html');
                res.writeHead(404);
                res.end(file);
            })
    }

});

server.listen(port);

function validateMarka(marka) {
    return marka.length>= 2;
}
function validateTipus(tipus) {
    return tipus.length > 0;
}
function validateAr(ar) {
    return ar > 999;
}