const { getConnection } = require('../database');
const { v4 } = require('uuid');

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
        if (this.body.map) response = this.table.map(this.body.map);
        else if (this.body.search) {
            response = this.table.find({
                [this.body.search[0]]: this.body.search[1]
            });
        } else if (this.body.filter) response = this.table.filter(this.body.filter);
    
        response = (this.body.sortby) ? response.sortBy(this.body) : (this.body.orderby) ? response.orderBy(this.body.orderby[0], this.body.orderby[1]) : response;
    
        this.res.json(response.value());
    }

    __parseBody() {
        for (const key in this.body) {
            let element = this.body[key].replace(',', '.');
            this.body[key] = !element ? "" : isNaN(element) ?  element : parseFloat(element);
        }
    }

    //CREATE/UPDATE ELEMENTS
    setElement() {    
        this.__parseBody()
        
        this.body['id'] = v4();
        (this.table.value()) ? this.table.push(this.body).write() : this.DB.set(this.params.table, [this.body]).write();
    
        this.res.json("Elemento Creado");
    }

    reSetElement() {
        this.__parseBody()

        this.table.find({id: this.params.id}).assign(this.body).write()
        this.res.json("Elemento Actualizado");
    }

    //DELETE ELEMENTS
    removeElements() {
        for (const id of this.body.ids) this.table.remove({id}).write();
        this.res.send('Elemento Eliminado');
    }
}


module.exports = TABLES