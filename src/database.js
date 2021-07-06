const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

let db;

async function createConnection() {
    const adapters = new FileAsync('db.json');
    db = await lowdb(adapters);
    db.defaults().write();
}

const getConnection = () => db;

module.exports = {
    createConnection,
    getConnection
}
