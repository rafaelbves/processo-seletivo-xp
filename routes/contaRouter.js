const {Router} = require('express');
// eslint-disable-next-line new-cap
const router = Router();
const contaController = require('../controllers/contaController');

router.get('/', (req, res) => {
  return res.status(200).json('home/conta');
});
router.post('/deposito', contaController.postDeposit);

module.exports = router;
