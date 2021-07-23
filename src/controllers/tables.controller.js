const {
    getConnection
} = require('../database');
const {
    v4
} = require('uuid');

class TABLES {
    constructor(req, res) {
        this.params = req.params;
        this.body = req.body;
        this.res = res;
        this.req = req;

        this.DB = getConnection().get('tables');

        //FULL TABLE OBJECTS PETITIONS
        this.table = this.DB.get((this.params.table || '').toLowerCase());
    }

    //READ METHODS
    get data() {
        let response = this.table;
        if (this.body.search) {
            response = this.table.find({
                [this.body.search[0]]: this.body.search[1]
            });
        } else if (this.body.filter) response = this.table.filter(this.body.filter);

        response = (this.body.orderby) ? response.orderBy(this.body.orderby[0], this.body.orderby[1]) : response;

        this.res.json(response.value());
    }

    #parseBody() {
        for (const key in this.body) {
            if (!this.body[key]) {
                delete this.body[key];
                continue
            };
            if ((Array.isArray(this.body[key]) || typeof this.body[key] === 'string') && key === 'id') continue;
            if (this.body[key] instanceof Object) {
                for (const index in this.body[key]) {
                    let element = this.body[key][index].replace(',', '.');
                    this.body[key][index] = !element ? element : isNaN(element) ? element : parseFloat(element);
                }
            } else {
                let element = this.body[key].replace(',', '.');
                this.body[key] = !element ? this.body[key] : isNaN(element) ? element : parseFloat(element);
            }
        }
    }

    #relPerm(res) {
        switch (this.body.operation) {
            case 'sum':
                res += this.body.cantidad;
                break;
            case 'min':
                res -= this.body.cantidad;
                break;
            case 'up':
                res *= 1 + this.body.cantidad / 100;
                break;
            case 'down':
                res *= 1 - this.body.cantidad / 100;
                break;
            case 'percent':
                res *= this.body.cantidad / 100;
                break;
            default:
                break;
        }
        return res
    }

    //CREATE/UPDATE ELEMENTS
    setElement() {
        this.#parseBody()
        if (this.body.id) {
            if (this.body.target !== "col" || this.body.id.length > 1) {
                for (let id in this.body.id) {
                    id = (Array.isArray(this.body.id)) ? this.body.id[id] : id;
                    let elem = this.table.find({id});

                    if (this.body.target === "fun") {
                        // MODIFICA SOLO UNA COLUMNA DE UN ELEMENTO DE LA DB APLICANDO UNA FUNCIÓN
                        for (let col of this.body.col) {                        
                            elem.assign({[col]: this.#relPerm(elem.get(col).value())}).write();
                        }
                    } else {
                        // MODIFICA SOLO UNA COLUMNA DE UN ELEMENTO DE LA DB
                        for (let col in this.body) {
                            if (['id', 'target'].includes(col)) continue;
                            elem.assign({[col]: this.body[col]}).write();
                        }
                    }
                }
            } else {
                // MODIFICA COMPLETAMENTE UN ELEMENTO DE LA DB
                this.body.id = this.body.id[0];
                delete this.body.target;
                this.table.find({id: this.body.id}).assign(this.body).write()
            };
        } else {
            // CREA UN NUEVO ELEMENTO EN DB
            this.body['id'] = v4();
            (this.table.value()) ? this.table.push(this.body).write(): this.DB.set(this.params.table, [this.body]).write();
        }

        this.res.json("Elemento Seteado");
    }

    //DELETE ELEMENTS
    removeElements() {
        for (const id of this.body.id) this.table.remove({id}).write();
        this.res.send('Elemento Eliminado');
    }
}


module.exports = TABLES