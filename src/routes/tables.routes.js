const {
    Router
} = require('express');
const router = Router();

const TABLES = require('../controllers/tables.controller');
const ADMIN = require('../controllers/admin.controller');


//GET REQUEST
router.get('/', (req, res) => res.render('index'))

router.get('/settings', (req, res) => res.render('settings'));

router.get('/test', (req, res) => res.render('test'));

router.get('/utilities', (req, res) => res.render('utilities'));

router.get('/tables/:table', (req, res) => res.render('tables', {
    title: req.params.table
}));


//POST REQUEST
router.post('/admin', (req, res) => new ADMIN(req, res).data);

router.post('/tables', (req, res) => new TABLES(req, res).data);
router.post('/tables/:table', (req, res) => new TABLES(req, res).data);
//router.post('/admin/:element/:table/:id', updateColumn);


//PUT REQUEST
router.put('/admin/object', (req, res) => new ADMIN(req, res).setObject());
router.put('/admin/object/:id', (req, res) => new ADMIN(req, res).reSetObject());

router.put('/tables/:table', (req, res) => new TABLES(req, res).setElement());

//DELETE REQUEST
router.delete('/admin/object/:table', (req, res) => new ADMIN(req, res).removeObject());

router.delete('/tables/:table', (req, res) => new TABLES(req, res).removeElements());


module.exports = router;