const {Router} = require('express');
// eslint-disable-next-line new-cap
const router = Router();

const ativosController = require('../controllers/ativosController');

router.get('/cliente/:codCliente', ativosController.getAssetsByClient);
// router.get('/:codAtivos' );

module.exports = router;
