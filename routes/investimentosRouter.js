const { Router } = require('express');
const investimentosControllers = require('../controllers/investimentosController.js')

const router = Router();

router.post('/comprar', investimentosControllers.postBuyOrder);
router.post('/vender', investimentosControllers.postSellOrder);

module.exports = router;
