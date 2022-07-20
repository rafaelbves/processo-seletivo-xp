const app = require('./app');

require('dotenv').config();


const populateDB = require('./models/populateDB');
populateDB();

app.listen(process.env.PORT, () => {
  console.log(`Escutando na porta ${process.env.PORT}`);
});
