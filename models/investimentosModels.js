const connection = require('./connection');

const buyRequest = async(buyOrder) => {
  const { codCliente, codAtivo, qtdeAtivo } = buyOrder;
  const [query] = await connection.execute(
    `
    INSERT INTO
      XPSel.compras_vendas (id_user, id_ativo, quantidade, data)
    VALUES (${codCliente}, ${codAtivo}, ${qtdeAtivo}, NOW())
    `,
  );

  return query;
}

const getAssetsAvailable = async () => {
  const query = await connection.execute(
    `
    SELECT 
	    a.id AS CodAtivo,
      a.quantidade - IFNULL(SUM(cv.quantidade), 0) AS QtdeAtivo,
      a.valor AS Valor
    FROM 
	    XPSel.compras_vendas AS cv
    RIGHT JOIN 
	    XPSel.ativos as a
    ON 
	    cv.id_ativo = a.id
    GROUP BY
      a.id;
    `
  );
  return query;
};

module.exports = {
  buyRequest,
  getAssetsAvailable,
}
