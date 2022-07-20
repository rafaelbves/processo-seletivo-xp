const connection = require('./connection');

const buyOrSellRequest = async(buyOrder) => {
  const { codCliente, codAtivo, qtdeAtivo } = buyOrder;
  const [query] = await connection.execute(
    `
    INSERT INTO
      XPSel.compras_vendas (id_user, id_ativo, quantidade, data)
    VALUES
      (${codCliente}, ${codAtivo}, ${qtdeAtivo}, NOW());
    `,
  );

  return query;
}

const countBalanceMovement = async (newTransaction) => {
  const { codCliente, valor, transactionType } = newTransaction;
  const [query] = await connection.execute(
    `
    INSERT INTO
      XPSel.contas (id_user, transacao, tipo, data)
    VALUES
	    (${codCliente}, ${valor}, '${transactionType}', NOW());
    `
  );
  
  return query;
}

const getAssetsAvailable = async () => {
  const [query] = await connection.execute(
    `
    SELECT 
	    a.id AS codAtivo,
      a.quantidade - IFNULL(SUM(cv.quantidade), 0) AS qtdeAtivo,
      a.valor AS valor
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
    cv.id_user AS codCliente,
      a.id AS codAtivo,
    IFNULL(SUM(cv.quantidade), 0) AS qtdeAtivo,
      a.valor AS valor
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
    id_user AS codCliente,
      sum(transacao) AS saldo
    FROM
      XPSel.contas
    GROUP BY
      id_user;
    `
  );

  return query;
};

const undoAction = async (table, id) => {
  const [query] = await connection.execute(
    `
    DELETE FROM
      XPSel.${table}
    WHERE
      id = ${id};
    `
  )
  
  return query;
}

module.exports = {
  buyOrSellRequest,
  countBalanceMovement,
  getAssetsAvailable,
  getClientsAssets,
  getClientsBalance,
  undoAction,
}
