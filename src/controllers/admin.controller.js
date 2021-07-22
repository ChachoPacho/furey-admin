const {
    getConnection
} = require('../database');
const {
    v4
} = require('uuid');

class ADMIN {
    #objects = {
        create: {
            table: 'this.#createTable()',
            col: 'this.#createCol()'
        },
        update: {
            util: 'this.#updateUtil()',
            col: 'this.#updateCol()'
        }
    }

    constructor(req, res) {
        this.params = req.params;
        this.body = req.body;
        this.res = res;
        this.req = req;

        this.DB = getConnection().get('tables');
        //FULL ADMIN PETITIONS
        this.tables = getConnection().get('admin.tables');

        this.tableName = (this.body.tableid || this.params.id || '').toLowerCase();
        this.table = (this.tableName) ? this.tables.get(this.tableName) : '';

        //FULL TABLE OBJECTS PETITIONS
        this.object = this.DB.get(this.body.object);
        this.name = (this.body.name || this.body.field || '').toLowerCase();
    }

    //CONFIG INFORMATION
    get data() {
        let configData = {};

        if (this.tables) {
            if (this.table) {
                configData['table'] = this.table.value();
            } else {
                configData['table'] = this.tables.value();
            }
        }

        this.res.send(configData);
    }

    //CUD OBJECTS
    #createCol() {
        //AÑADE LA COLUMNA EN LA POSICIÓN DADA, EN ADMIN.TABLES
        const newStructure = this.table.value();
        const id = v4();
        (this.body.afterof === "check") ? newStructure.__SHOW.unshift(id) : newStructure.__SHOW.splice(newStructure.__SHOW.indexOf(this.body.afterof) + 1, 0, id);
        newStructure.__ALL[id] = this.name;
        newStructure.__COL.push(id);

        this.table.assign(newStructure).write();
        //
    }

    #createTable() {
        this.DB.set(this.tableName, []).write();
        this.tables.set(this.tableName, {
            __SHOW: [],
            __ALL: {},
            __COL: [],
            __CAT: [],
            __REL: {}
        }).write();
    }

    setObject() {
        eval(this.#objects.create[this.body.objtype]);

        this.res.send("Estructura Creado");
    }

    #updateUtil() {
        const __ALL = Object.keys(this.table.value().__ALL);
        const newShow = [];
        for (let index in __ALL) {
            let pos = parseInt(this.body.pos[index]) - 1;
            if (pos == -1) continue;

            let element = __ALL[index];
            (newShow[pos]) ? newShow.splice(pos + 1, 0, element): newShow[pos] = element;
        }
        this.table.set('__SHOW', newShow.filter(Boolean)).write();
    }

    async #updateCol() {
        console.log(this.body.origin, this.name)
        this.table.get('__ALL').assign({[this.body.origin]: this.name}).write();
    }

    reSetObject() {
        eval(this.#objects.update[this.body.objtype]);

        this.res.send("Estructura Actualizado");
    }

    removeObject() {
        if (this.body.full) {
            this.DB.unset(this.params.table).write();

            this.tables.unset(this.params.table).write();

            this.res.send("REDIRECT");
        } else {
            if (this.body.col) {
                for (const col of this.body.col) {
                    for (const id of this.object.map("id").value()) {
                        this.object.find({
                            id
                        }).unset(col).write();
                    }
                    this.table.get('__SHOW').pull(col).write();
                    this.table.get('__COL').pull(col).write();
                    this.table.unset('__ALL.' + col).write();
                }
            }
            if (this.body.rel) {

            }
            this.res.send("Objeto Eliminado");
        }
    }

};


module.exports = ADMIN