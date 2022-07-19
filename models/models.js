const connection = require('./connection');

const buyRequest = async(buyOrder) => {
  const { CodCliente, CodAtivo, QtdeAtivo } = buyOrder;
  const [query] = await connection.execute(
    `
    INSERT INTO
      XPSel.compras_vendas (id_user, id_ativo, quantidade, data)
    VALUES
      (${CodCliente}, ${CodAtivo}, ${QtdeAtivo}, NOW())
    `,
  );

  return query;
}

const countBalanceMovement = async (newTransaction) => {
  const { CodCliente, Valor, transactionType } = newTransaction;
  const [query] = await connection.execute(
    `
    INSERT INTO
      XPSel.contas (id_user, transacao, tipo, data)
    VALUES
	    (${CodCliente}, ${Valor}, '${transactionType}', NOW()),
    `
  );
  
  return query;
}

const getAssetsAvailable = async () => {
  const [query] = await connection.execute(
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

const getClientsAssets = async () => {
  const [query] = await connection.execute(
    `
    SELECT 
    cv.id_user AS CodCliente,
      a.id AS CodAtivo,
    IFNULL(SUM(cv.quantidade), 0) AS QtdeAtivo,
      a.valor AS Valor
    FROM 
      XPSel.compras_vendas AS cv
    INNER JOIN 
      XPSel.ativos as a
    ON 
      cv.id_ativo = a.id
    GROUP BY
      a.id, 
      cv.id_user;
    `     
  );

  return query;
}

const getClientsBalance = async () => {
  const [query] = await connection.execute(
    `
    SELECT 
    id_user AS CodCliente,
      sum(transacao) AS Saldo
    FROM
      XPSel.contas
    GROUP BY
      id_user;
    `
  );

  return query;
};

module.exports = {
  buyRequest,
  countBalanceMovement,
  getAssetsAvailable,
  getClientsAssets,
  getClientsBalance,
}
