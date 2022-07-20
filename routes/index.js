const { Router } = require('express');
const model = require('../models/models')

const investimentosRouter = require('./investimentosRouter')
const router = Router();


router.use('/investimentos', investimentosRouter);
router.get('/',  async (req, res) => {
    const test = await model.getClientsBalance();
    return res.status(200).json({ test })
});


module.exports = router;
