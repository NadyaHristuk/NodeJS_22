const http = require("http");
let body = "";

const server = http.createServer((req, res) => {
  req.on("data", (bodyChunk) => {
    console.log("req.method", req.method);
    console.log("req.url", req.url);
    console.log("req.headers", req.headers);
    body += bodyChunk.toString();
  });
  req.on("end", () => {
    res.writeHead(201, {
      "Content-type": "text/plain",
    });
    res.end("ok");
  });
});

server.listen(3001, () => {
  console.log("Server started on", 3001);
});
