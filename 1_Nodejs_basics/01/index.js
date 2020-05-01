const fs = require("fs");
const path = require("path");

let data = require("./main");

console.log(process.execPath);

let pathFile = path.join(__dirname, "./db/text.txt");

fs.readFile(pathFile, "utf-8", (err, data) => {
  console.log(data);
});

// let new_text = {
//   name: "mike",
// };
// fs.writeFile("text.txt", new_text, (err) => {
//   if (err) {
//     console.log(err);
//   }
// });
// console.log(text);

// let second_text = "append text!";
// fs.appendFile("text.txt", second_text, (err) => {
//   if (err) {
//     console.log(err);
//   }
// });
