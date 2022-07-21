const {Router} = require('express');
const investiControllers = require('../controllers/investimentosController.js');

// eslint-disable-next-line new-cap
const router = Router();

router.post('/comprar', investiControllers.postBuyOrder);
router.post('/vender', investiControllers.postSellOrder);

module.exports = router;
