const { Router } = require('express');
const router = Router();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const { getElements, getElement, createElement, updateElement, deleteElement } = require('../controllers/tables.controller');
const { getData, createObject, updateObject, deleteObject } = require('../controllers/admin.controller');


//GET REQUEST
router.get('/', (req, res) => res.render('index'))

router.get('/settings', (req, res) => res.render('settings'));

router.get('/test', (req, res) => res.render('test'));

router.get('/utilities', (req, res) => res.render('utilities'));

router.get('/tables/:table', (req, res) => res.render('tables', {title: req.params.table}));

router.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })


//POST REQUEST
router.post('/admin', getData);

router.post('/tables/:table', getElements);
router.post('/tables/:table/:id', getElement);
//router.post('/admin/:element/:table/:id', updateColumn);


//PUT REQUEST
router.put('/admin/object', createObject);
router.put('/admin/object/:id', updateObject);

router.put('/tables/:table', createElement);
router.put('/tables/:table/:id', updateElement);


//DELETE REQUEST
router.delete('/admin/object/:table', deleteObject);

router.delete('/tables/:table/:id', deleteElement);


module.exports = router;
