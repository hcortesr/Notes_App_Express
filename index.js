const express = require('express');
const fs = require('fs/promises');
const { getUser, createUser, getPassword, createSession, closeSession, getSession, getUserCards, postUserCards } = require('./scripts/sqlConnection');
const cookieParse = require('cookie-parser');

const app = express();

app.use(express.static('./res'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParse());

app.get('/cards', (req, res) => { // ----------------------------------- Este método se va a eliminar, solo es para hacer pruebas
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
        await createUser(id_user, password);
        await createSession(id_user);
        const id_session = await getSession(id_user);
        res.cookie('id_session', id_session.id_session, {
            httpOnly: true,
            maxAge: 500,
        });
        res.status(200).send("Usuario creado")
    }

})
app.post('/signIn', async (req, res) => { // Function create user
    const { id_user, password } = req.body;
    const truePassword = await getPassword(id_user);
    const session = await getSession(id_user);

    let isSession;
    let isSameUser;

    if (session == undefined) { isSession = false }
    else { isSession = true }

    if (truePassword == undefined) { isSameUser = false }
    else if (truePassword.password == password) { isSameUser = true }
    else { isSameUser = false }

    if (!isSession) {
        if (isSameUser) {
            await createSession(id_user);
            const id_session = await getSession(id_user);
            res.cookie("id_session", id_session.id_session, {
                httpOnly: true,
                maxAge: 500,
            })
            res.status(200).send("Se inició sesión correctamente");
        } else {
            res.status(404).send("Hay un error con el usuario o la contraseña");
        }
    } else {
        res.status(404).send("Ya se ha iniciado sesión");
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

app.get('/home', async (req, res) => {

    const { id_session } = req.cookies;
    const cards = await getUserCards(id_session);
    console.log(cards);
    res.status(200).json(cards);

})

app.post('/home/createCard', async (req, res) => {

    const { id_session } = req.cookies;
    const { title, content, color } = req.body
    console.log(req.body);
    await postUserCards(title, content, color, id_session);
    res.status(200).send("Se creó la carta correctamente");

})

app.listen(3000);
console.log("http://localhost:3000");