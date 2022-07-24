# Desafio Técnico Turma XP - Trybe (BackEnd) 

Esse projeto foi desenvolvido como a primeira fase de um processo seletivo organizado pela XP inc. em parceria com Trybe, com a finalidade de contratar desenvolvedores juniors.

O desafio consistiu em desenvolver uma API que fosse semelhante ao dia a dia da empresa, desenvolvendo endpoints que simulavam cenários de:
* Compra e venda de ações;
* Saque e depósito de saldo na conta de um cliente, assim como a consulta do saldo que ele possui atualmente na conta;
* Listagem de ativos disponíveis para a compra ou que o cliente possui.

## Tecnologias usadas

Para o desenvolvimento da aplicação foi utilizado:
* NodeJS e ExpressJS, para o desenvolvimento da plicação;
* Docker, par roda o projeto em containers;
* MYSQL, para o banco de dados;
* Mocha, Chai e Sinon, para os testes.

## Instalando dependências
Na pasta raiz do projeto execute os comandos:
~~~~
docker-compose up
docker exec -it xpsel bash
npm install
~~~~

## Executando a aplicação
Para rodar a aplicação:
~~~~
npm start
~~~~

###### Observações:
Ao executar o comando `npm start` dados fictícios são inseridos ao banco de dados, sempre que a aplicação é iniciada/reiniciada ela restaura as informações originais do banco de dados. Para alterar as informações iniciais altere o arquivo  `/database/install_db.sql.`

## Endpoints
[![Run in Postman](https://run.pstmn.io/button.svg)](https://god.gw.postman.com/run-collection/20323323-556e65cc-c330-43d0-b919-5c7601e31c6a?action=collection%2Ffork&collection-url=entityId%3D20323323-556e65cc-c330-43d0-b919-5c7601e31c6a%26entityType%3Dcollection%26workspaceId%3Dd1baa3d9-9f25-41b4-8510-642d214f4015)

### /investimentos/comprar
Requisição do tipo POST que simula uma ação de compra de um ativo específico.

###### Corpo de requisição esperado:
~~~
{
    "codCliente": 1,
    "codAtivo": 2,
    "qtdeAtivo": 100
}
~~~

### /investimentos/vender

Requisição do tipo POST que simula uma situação de venda de um ativo.

###### Corpo da requisição esperado:
~~~

{
    "codCliente": 1,
    "codAtivo": 2,
    "qtdeAtivo": 100
}
~~~

### /ativos/cliente/:codCliente
Requisição do tipo GET que lista os ativos que um  determinado cliente tenha em sua conta.
 
### /ativos/:codAtivo
Requisição do tipo GET que retorna o ativo com aquele id específico.
 
### /conta/deposito
Requisição do tipo POST que simule o depósito de um valor na conta do cliente

###### Corpo da requisição esperado:
~~~
{
    "codCliente": 1,
    "valor": 1000.00
}
~~~~
 
### /conta/saque
Requisição do tipo POST que simula o saque de um valor da conta.

###### Corpo da requisição esperado:
~~~
{
    "codCliente": 1,
    "valor": 1000.00
}
~~~
 
### /conta/:codCliente
Requisição do tipo GET que retorna o saldo da conta do cliente.
