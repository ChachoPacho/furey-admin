const { getConnection } = require('../database');
const { _getData } = require('./admin.controller');
const { v4 } = require('uuid');

//READ METHODS
const getElements = (req, res) => {
    const table = getConnection().get(req.params.table);
    const data = req.body;
    let filteredTable = table

    if (data.map) filteredTable = table.map(data.map);
    else if (data.find) {
        let filter = {};
        filter[data.find[0]] = data.find[1];
        filteredTable = table.find(filter);
    } else if (data.size) filteredTable = table.size();
    else if (data.specialSearch) filteredTable = getConnection().get(data.specialSearch);
    else if (data.filter) filteredTable = table.filter(data.filter);

    if (data.sortby) filteredTable = filteredTable.sortBy(data);
    else if (data.orderby) filteredTable = filteredTable.orderBy(data.orderby[0], data.orderby[1]);

    
    res.json(filteredTable.value())
}

const getElement = (req, res) => {
    const element = getConnection().get(req.params.table).find({id: req.params.id}).value();
    res.json(element);
}


//CREATE/UPDATE ELEMENTS
const createElement = (req, res) => {
    req.body['id'] = v4();

    const table = getConnection().get(req.params.table);
    let data = req.body;

    for (let col in req.body) {
        _getData({table: req.params.table, tableid: col})
    }

    if (table.value()) table.push(req.body).write();
    else getConnection().set(req.params.table, [req.body]).write();

    res.json("Elemento Creado");
}

const updateElement = async (req, res) => {
    const update = await getConnection().get(req.params.table).find({id: req.params.id}).assign(req.body).write()
    res.json("Elemento Actualizado");
}


//DELETE ELEMENTS
const deleteElement = (req, res) => {
    getConnection().get(req.params.table).remove({id: req.params.id}).write();
    res.send('Elemento Eliminado')
}


module.exports = {
    getElements,
    getElement,
    createElement,
    updateElement,
    deleteElement,
}