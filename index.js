const express = require('express');
const fs = require('fs/promises');

const app = express();

app.use(express.static('./res'));

app.get('/card', (req, res) => {
    res.sendFile('./res/index.html', {
        root: __dirname,
    });
})
app.listen(3000);
console.log("http://localhost:3000");