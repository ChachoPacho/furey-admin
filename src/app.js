const express = require('express');
const exhbs = require('express-handlebars');
const morgan = require('morgan');
const path = require('path')
const app = express();

const { createConnection } = require("./database");

createConnection();

const { getConnection } = require('./database');
const tables = 

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exhbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        tables: function () {
            const tablesJSON = getConnection().get('admin').get('tables').value();
            let tables = "";

            for (const key of Object.keys(tablesJSON)) {
                tables += "<a class='collapse-item text-capitalize' href='/tables/" + key + "'>" + key + "</a>"
            }

            return tables
        }
    }
}));
  
app.set('view engine', '.hbs');


//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());


//routes
app.use(require('./routes/tables.routes'));


//static
app.use('*/static', express.static(path.join(__dirname, 'public')));


module.exports = app;
