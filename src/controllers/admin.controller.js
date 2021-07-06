const {
    getConnection
} = require('../database');
const typesCont = {
    "string": '',
    "num": 0,
    "bool": true,
}

//CONFIG INFORMATION
const _getData = async (req) => {
    const config = await getConnection().get('admin');

    let configData = {};

    if (req.table) {
        if (req.tableid) {
            configData['table'] = config.get('tables').get(req.tableid).value();
        } else {
            configData['table'] = config.get('tables').value();
        }
    }

    return configData;
};

const getData = async (req, res) => {
    res.send(_getData(req.body));
}


//CUD OBJECTS
const createObject = (req, res) => {
    const params = req.body;
    const tableID = params.table.toLowerCase();
    const config = getConnection().get('admin').get('tables');
    let newTableParams = {
        __SHOW: []
    };

    switch (params.objtype) {
        case "col":
            const name = params.name.toLowerCase();

            //RECORRE TODOS LOS OBJETOS Y LES AÑADE LA COLUMNA
            const table = getConnection().get(params.table);
            const IDs = table.map("id").value();

            for (const id of IDs) {
                table.find({
                    id: id
                }).set(name, typesCont[params.type]).write();
            }
            //

            //AÑADE LA COLUMNA EN LA POSICIÓN DADA, EN ADMIN.TABLES:id
            newTableParams[name] = params.type;
            const tableParams = config.get(tableID).value();
            for (const key of tableParams.__SHOW) {
                if (key === params.beforeof) newTableParams.__SHOW.push(name);
                newTableParams.__SHOW.push(key);
            }
            if (params.beforeof === "admin") newTableParams.__SHOW.push(name);
            
            config.get(tableID).assign(newTableParams).write();
            //
            break;

        case "table":
            getConnection().set(tableID, []).write();
            config.set(tableID, newTableParams).write();
            break;

        default:
            break;
    }

    res.send("Objeto Creado");
}

const updateObject = (req, res) => {
    const data = req.body
}

const deleteObject = (req, res) => {
    const data = req.body

    if (data.full) {
        getConnection().unset(req.params.table).write();

        const config = getConnection().get('admin').get('tables');
        config.unset(req.params.table).write();

        res.status(500).send(req.protocol + '://' + req.hostname + ':' + (process.env.PORT || 3000));
    } else {
        const table = getConnection().get(req.params.table);
        const config = getConnection().get('admin').get('tables')
        const IDs = table.map("id").value();
        if (data.col) {
            for (const col of data.col) {
                for (const id of IDs) {
                    table.find({
                        id: id
                    }).unset(col).write();
                }
                const tableConfig = config.get(req.params.table);
                tableConfig.unset(col).write();
                tableConfig.get('__SHOW').pull(col).write();
            }
        }
        if (data.rel) {

        }
        res.send("Objeto Eliminado");
    }
}

module.exports = {
    getData,
    createObject,
    updateObject,
    deleteObject,
    _getData
}