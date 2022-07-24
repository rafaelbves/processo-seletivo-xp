const {Router} = require('express');

const investimentosRouter = require('./investimentosRouter');
const ativosRouter = require('./ativosRouter');
const contaRouter = require('./contaRouter');
// eslint-disable-next-line new-cap
const router = Router();


router.use('/investimentos', investimentosRouter);
router.use('/ativos', ativosRouter);
router.use('/conta', contaRouter);

module.exports = router;
