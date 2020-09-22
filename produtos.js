const Koa = require("koa");
const bodyparser = require("koa-bodyparser");

const server = new Koa();

const products = [];
const orders = [];
let atualizar = false;
let precoPedido = 0;

server.use(bodyparser());

server.use((ctx) => {
  const requestBody = ctx.request.body;

  if (ctx.url.includes("/products")) {
    if (ctx.method == "POST") {
      console.log("ok");
      ctx.status = 201;
      ctx.body = {
        status: "sucesso",
        dados: newProducts(requestBody),
      };
    }
    if (ctx.method == "GET") {
      if (products.length > 0) {
        ctx.status = 200;
        ctx.body = {
          status: "sucesso",
          dados: products,
        };
      } else {
        ctx.status = 404;
        ctx.body = {
          status: "erro",
          dados: {
            mensagem: "Conteúdo não encontrado",
          },
        };
      }
    }
  }
  if (ctx.url.includes(`/products/:`)) {
    let url = ctx.url.split("/:");
    let indice = url[1] - 1;
    console.log(indice);
    if (ctx.method == "GET") {
      console.log("olá");

      if (!(url[1] == 0) && products.length != 0) {
        if (products.length > indice) {
          ctx.status = 200;
          ctx.body = {
            status: "sucesso",
            dados: products[indice],
          };
        } else {
          ctx.status = 404;
          ctx.body = {
            status: "erro",
            dados: {
              mensagem: "Conteúdo não encontrado",
            },
          };
        }
      } else {
        ctx.status = 404;
        ctx.body = {
          status: "erro",
          dados: {
            mensagem: "Conteúdo não encontrado",
          },
        };
      }
    } else if (ctx.method == "PUT") {
      if (!(url[1] == 0) && products.length != 0) {
        if (products.length > indice) {
          const resposta = updateProducts(products, indice, requestBody);
          if (resposta) {
            ctx.status = 200;
            ctx.body = {
              status: "Sucesso",
              dados: products[indice],
            };
          } else {
            ctx.status = 404;
            ctx.body = {
              status: "erro",
              dados: {
                mensagem: "Não foi possivel atualizar o item",
              },
            };
          }
        }
      } else {
        ctx.status = 404;
        ctx.body = {
          status: "erro",
          dados: {
            mensagem: "Conteúdo não encontrado",
          },
        };
      }
    } else if (ctx.method == "DELETE") {
      if (!(url[1] == 0) && products.length != 0) {
        if (products.length > indice) {
          products[indice].deletado = true;
          ctx.status = 200;
          ctx.body = {
            status: "Sucesso",
            dados: products[indice],
          };
        }
      }
    } else {
      ctx.status = 404;
      ctx.body = {
        status: "erro",
        dados: {
          mensagem: "Conteúdo não encontrado",
        },
      };
    }
  }
  if (ctx.url.includes("/orders")) {
    if (ctx.method == "POST") {
      ctx.status = 201;
      ctx.body = {
        status: "sucesso",
        dados: newOrder(requestBody),
      };
    } else if (ctx.method == "GET") {
      if (orders.length > 0) {
        ctx.status = 200;
        ctx.body = {
          status: "sucesso",
          dados: orders,
        };
      } else {
        ctx.status = 404;
        ctx.body = {
          status: "erro",
          dados: {
            mensagem: "Conteúdo não encontrado",
          },
        };
      }
    } else {
      ctx.status = 404;
      ctx.body = {
        status: "erro",
        dados: {
          mensagem: "Conteúdo não encontrado",
        },
      };
    }
  }
  if (ctx.url.includes(`/orders/:`)) {
    let url = ctx.url.split("/:");
    let indice = url[1] - 1;

    if (ctx.method == "GET") {
      if (!(url[1] == 0) && products.length != 0) {
        if (products.length > indice) {
          ctx.status = 200;
          ctx.body = {
            status: "sucesso",
            dados: products[indice],
          };
        } else {
          ctx.status = 404;
          ctx.body = {
            status: "erro",
            dados: {
              mensagem: "Conteúdo não encontrado",
            },
          };
        }
      } else {
        ctx.status = 404;
        ctx.body = {
          status: "erro",
          dados: {
            mensagem: "Conteúdo não encontrado",
          },
        };
      }
    } else if (ctx.method == "PUT") {
      if (!(url[1] == 0) && products.length != 0) {
        if (products.length > indice) {
          const resposta = updateProducts(products, indice, requestBody);
          if (resposta) {
            ctx.status = 200;
            ctx.body = {
              status: "Sucesso",
              dados: products[indice],
            };
          } else {
            ctx.status = 404;
            ctx.body = {
              status: "erro",
              dados: {
                mensagem: "Não foi possivel atualizar o item",
              },
            };
          }
        }
      } else {
        ctx.status = 404;
        ctx.body = {
          status: "erro",
          dados: {
            mensagem: "Conteúdo não encontrado",
          },
        };
      }
    } else if (ctx.method == "DELETE") {
      if (!(url[1] == 0) && products.length != 0) {
        if (products.length > indice) {
          products[indice].deletado = true;
          ctx.status = 200;
          ctx.body = {
            status: "Sucesso",
            dados: products[indice],
          };
        }
      }
    } else {
      ctx.status = 404;
      ctx.body = {
        status: "erro",
        dados: {
          mensagem: "Conteúdo não encontrado",
        },
      };
    }
  }
});

function newProducts(produto) {
  const novoProduto = {
    id: products.length + 1,
    nome: produto.nome,
    quantidadeDisponivel: produto.quantidadeDisponivel,
    valor: produto.valor,
    deletado: false,
  };
  products.push(novoProduto);
  return novoProduto;
}

function newOrder(pedido) {
  for (let i = 0; i < pedido.produtos.length; i++) {
    precoPedido +=
      products[pedido.produtos[i].id - 1].valor * pedido.produtos[i].qtd;
    products[pedido.produtos[i].id - 1].quantidadeDisponivel -=
      pedido.produtos[i].qtd;
  }
  const novoPedido = {
    id: orders.length + 1,
    produtos: pedido.produtos, // id e qntd;
    estado: "incompleto",
    idCliente: pedido.idCliente,
    valorTotal: precoPedido,
    deletado: false,
  };

  orders.push(novoPedido);

  return novoPedido;
}

function updateProducts(produto, index, requestBody) {
  if (produto[index].deletado == false) {
    if (
      requestBody.quantidadeDisponivel != undefined &&
      requestBody.valor != undefined
    ) {
      produto[index].quantidadeDisponivel = requestBody.quantidadeDisponivel;
      produto[index].valor = requestBody.valor;
    } else if (
      requestBody.quantidadeDisponivel == undefined &&
      requestBody.valor != undefined
    ) {
      produto[index].valor = requestBody.valor;
    } else if (
      requestBody.quantidadeDisponivel != undefined &&
      requestBody.valor == undefined
    ) {
      produto[index].quantidadeDisponivel = requestBody.quantidadeDisponivel;
    }
    return (atualizar = true);
  } else {
    return (atualizar = false);
  }
}

server.listen(8081, () => console.log("servidor está rodando na porta 8081"));
