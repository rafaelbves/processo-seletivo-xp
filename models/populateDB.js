const Importer = require("mysql-import");
require("dotenv").config();

const populateDB = async () => {
  const importer = new Importer({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    });

    await importer.import("./database/install_db.sql");

    await importer.disconnect();
};

module.exports = populateDB;
