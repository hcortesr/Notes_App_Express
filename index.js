const express = require('express');
const fs = require('fs/promises');
const { getUser, createUser, getPassword, createSession, closeSession } = require('./scripts/sqlConnection');


const app = express();

app.use(express.static('./res'));
app.use(express.urlencoded({ extended: false }));

app.get('/cards', (req, res) => {
    res.cookie('usuario', 'Juan', { maxAge: 900000, httpOnly: true });
    res.sendFile('./res/index.html', {
        root: __dirname,
    });
})

app.post('/signUp', async (req, res) => { // Function create user
    const { id_user, password } = req.body;
    const isUser = await getUser(id_user);


    if (isUser != undefined) {
        res.status(500).send("El usuario ya existe.")
    } else {
        createUser(id_user, password);
        createSession(id_session);
        res.status(200).send("Usuario creado")
    }

})
app.post('/signIn', async (req, res) => { // Function create user
    const { id_user, password } = req.body;
    const truePassword = await getPassword(id_user);

    console.log(truePassword);
    if (truePassword == undefined || truePassword != password) {
        res.status(404).send("Hay un error con el usuario o la contraseña");
    } else {
        createSession(id_user);
        res.status(200).send("Se inició sesión correctamente");
    }

})
app.delete('/signOut', async (req, res) => { // Function to close the session
    // const { id_session } = req.body;
    const id_session = 0;
    const isClosed = await closeSession(id_session);
    res.cookie("id_session", "", {
        httpOnly: true,
        maxAge: 500,
    })

    if (isClosed) {
        res.status(200).send("La sesión se cerro correctamente");
    } else {
        res.status(500).send("Hubo un error al cerra sesión");
    }
});

app.listen(3000);
console.log("http://localhost:3000");