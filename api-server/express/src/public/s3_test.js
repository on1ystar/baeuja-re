const fs = require('fs');

const file = './test.txt';
const fileStream = fs.createReadStream(file);

console.log(fileStream);
