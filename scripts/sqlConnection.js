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

async function getUserCards(id_session) {
    const query = "SELECT * FROM cards WHERE id_user = (SELECT id_user FROM sessions WHERE id_session = ?)";
    const res = await pool.query(query, [id_session]);
    return res[0];
}

module.exports = {
    getUser,
    createUser,
    getPassword,
    createSession,
    closeSession,
    getSession,
    getUserCards,
}