const express = require('express');
const fs = require('fs/promises');

const app = express();

app.get('/allCards', (req, res) => {
    fs.readFile('./data.json', 'utf8')
        .then(txt => {
            // txt = JSON.parse(txt);
            res.json(txt);
        })
})

app.listen(3000);
console.log("http://localhost:3000");