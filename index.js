const express = require('express');
const fs = require('fs/promises');
const { getUser, createUser, getPassword, createSession, closeSession, getSession, getUserCards, postUserCards, deleteAllCards, editCard, deleteCard } = require('./scripts/sqlConnection');
const cookieParse = require('cookie-parser');
const morgan = require('morgan');

const app = express();

app.use(express.static('./res'));
app.use(express.static('./res/res_bueno'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParse());
app.use(morgan('dev'));

app.get('/logInPage', (req, res) => {
    res.sendFile('./res/res_bueno/signIn.html', {
        root: __dirname,
    })
})


app.post('/logInPage/signUp', async (req, res) => { // Function create user
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
            maxAge: 1000 * 60 * 60,
            secure: false,
        });
        // res.status(200).send("Usuario creado");
        res.json({ redirectTo: '/home' });
    }

})
app.post('/logInPage/signIn', async (req, res) => { // Function create user
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
                maxAge: 1000 * 60 * 60,
            })
            res.status(200).send("Se inició sesión correctamente");
        } else {
            res.status(404).send("Hay un error con el usuario o la contraseña");
        }
    } else {
        res.status(404).send("Ya se ha iniciado sesión");
    }

})
app.delete('/logInPage/signOut', async (req, res) => { // Function to close the session.
    // const { id_session } = req.body;
    const id_session = 0;
    const isClosed = await closeSession(id_session);
    res.cookie("id_session", "", {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
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
    res.sendFile('./res/res_bueno/index.html', {
        root: __dirname,
    })

})

app.post('/home/createCard', async (req, res) => { // TOOD: Cuando se crea una carta, se debe actualizar la pantalla del usuario.

    const { id_session } = req.cookies;
    const { title, content, color } = req.body
    console.log("id_session", id_session);
    console.log(req.cookies);
    await postUserCards(title, content, color, id_session);
    res.status(200).send("Se creó la carta correctamente");

})

app.delete('/home/deleteAll', async (req, res) => {

    const { id_session } = req.cookies;
    await deleteAllCards(id_session);
    res.status(200).send("Se borró todo correctamente");

})

app.delete('/home/deleteCard', async (req, res) => {

    const { id_session } = req.cookies;
    const { id_card } = req.body;
    await deleteCard(id_session, id_card);
    res.status(200).send("Se borró la carta exitosamente");

})

app.put('/home/editCard', async (req, res) => {

    const { id_session } = req.cookies;

    console.log(id_session);
    console.log(req.body);
    const { title, content, color, id_card } = req.body;
    await editCard(title, content, color, id_session, id_card);
    res.status(200).send("Se editó la carta correctamente");

})

app.listen(3000);
console.log("http://localhost:3000");