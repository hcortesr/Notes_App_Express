const { query } = require('express');
const mysql2 = require('mysql2/promise');

const pool = mysql2.createPool({
    host: 'srv961.hstgr.io',
    user: 'u123882835_admin_user',
    password: '6^Aww0ow[yG',
    database: 'u123882835_notes_appv2'
})

async function getUser(id_user) {
    const query = "SELECT * FROM users WHERE id_user=?";
    const res = await pool.query(query, [id_user]);
    return res[0][0];
}
async function getPassword(id_user) {
    const query = "SELECT password FROM users WHERE id_user=?";
    const res = await pool.query(query, [id_user]);
    return res[0][0];
}
async function createUser(id_user, password) {
    const query = "INSERT INTO users (id_user, password) VALUES (?,?)";
    const res = await pool.query(query, [id_user, password]);
    console.log(res[0][0]);
}
async function createSession(id_user) {
    const query = "INSERT INTO sessions (id_user) VALUES (?)";
    const res = await pool.query(query, [id_user])
}
async function getSession(id_user) {
    const query = "SELECT id_session FROM sessions WHERE id_user=?";
    const res = await pool.query(query, [id_user])
    return res[0][0];
}

async function closeSession(id_session) {
    const query = "DELETE FROM sessions WHERE id_session=?";
    const res = await pool.query(query, [id_session]);
    return res[0].affectedRows;
}

async function getUserCards(id_session) { // TODO: Ajustar el tipo de formato correcto
    const query = "SELECT * FROM cards WHERE id_user = (SELECT id_user FROM sessions WHERE id_session = ?)";
    const res = await pool.query(query, [id_session]);
    return res[0];
}

async function postUserCards(title, content, color, id_session) { // TODO: Ajustar el tipo de formato correcto
    const query = `INSERT INTO cards (title, content, color, id_user)
                    SELECT ?, ?, ?, id_user FROM sessions WHERE id_session=?;`;

    const res = await pool.query(query, [title, content, color, id_session]);
}

async function deleteAllCards(id_session) { // TODO: Ajustar el tipo de formato correcto
    const query = `DELETE FROM cards WHERE
                    id_user = (SELECT id_user FROM sessions WHERE id_session=?)
    `;
    await pool.query(query, [id_session]);
}

async function editCard(title, content, color, id_session, id_card) { // TODO: Ajustar el tipo de formato correcto
    const query = `UPDATE cards SET title=?, content=?, color=?
                    WHERE id_user = (SELECT id_user FROM sessions WHERE id_session=?) AND id_card=?`;
    await pool.query(query, [title, content, color, id_session, id_card]);
}

async function deleteCard(id_session, id_card) { // TODO: Ajustar el tipo de formato correcto
    const query = `DELETE FROM cards WHERE
        id_user = (SELECT id_user FROM sessions WHERE id_session=?) AND id_card=?
    `;
    await pool.query(query, [id_session, id_card]);
}



module.exports = {
    getUser,
    createUser,
    getPassword,
    createSession,
    closeSession,
    getSession,
    getUserCards,
    postUserCards,
    deleteAllCards,
    editCard,
    deleteCard
}