const Koa = require("koa");
const bodyparser = require("koa-bodyparser");

const server = new Koa();

const products = [];
const orders = [];
let precoPedido = [];

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
  if (ctx.url.includes(`/products/`)) {
    let url = ctx.url.split("/");
    let indice = url[2] - 1;
    if (ctx.method == "GET") {
      if (!(url[2] == 0) && products.length != 0) {
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
      let ordensPermitidas = [];
      for (let i = 0; i < orders.length; i++) {
        if (orders[i].deletado == false) {
          ordensPermitidas.push(orders[i]);
        }
      }
      if (orders.length > 0) {
        ctx.status = 200;
        ctx.body = {
          status: "sucesso",
          dados: ordensPermitidas,
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
  if (ctx.url.includes(`/orders/`)) {
    let url = ctx.url.split("/");
    let indice = url[2] - 1;
    const regex = /[0-9]/;

    if (ctx.method == "GET") {
      if (url[2] == "incompleto") {
        console.log("entrei 2");
        let incompletos = [];
        for (let x = 0; x < orders.length; x++) {
          if (url[2] == orders[x].estado) {
            incompletos.push(orders[x]);
          }
          ctx.status = 200;
          ctx.body = {
            status: "sucesso",
            dados: incompletos,
          };
        }
      } else if (url[2] == "processando") {
        let processando = [];
        for (let x = 0; x < orders.length; x++) {
          if (url[2] == orders[x].estado) {
            processando.push(orders[x]);
          }
          ctx.status = 200;
          ctx.body = {
            status: "sucesso",
            dados: processando,
          };
        }
      } else if (url[2] == "pago") {
        console.log("entrei");
        let pagos = [];
        for (let x = 0; x < orders.length; x++) {
          if (url[2] == orders[x].estado) {
            console.log(url[2], orders[x].estado);
            pagos.push(orders[x]);
          }
          ctx.status = 200;
          ctx.body = {
            status: "sucesso",
            dados: pagos,
          };
        }
      } else if (url[2] == "enviado") {
        let enviados = [];
        for (let x = 0; x < orders.length; x++) {
          if (url[2] == orders[x].estado) {
            enviados.push(orders[x]);
          }
          ctx.status = 200;
          ctx.body = {
            status: "sucesso",
            dados: enviados,
          };
        }
      } else if (url[2] == "entregue") {
        let entregues = [];
        for (let x = 0; x < orders.length; x++) {
          if (url[2] == orders[x].estado) {
            entregues.push(orders[x]);
          }
          ctx.status = 200;
          ctx.body = {
            status: "sucesso",
            dados: entregues,
          };
        }
      } else if (url[2] == "cancelado") {
        let cancelados = [];
        for (let x = 0; x < orders.length; x++) {
          if (url[2] == orders[x].estado) {
            cancelados.push(orders[x]);
          }
          ctx.status = 200;
          ctx.body = {
            status: "sucesso",
            dados: cancelados,
          };
        }
      } else if (regex.test(url[2])) {
        if (!(url[2] == 0) && orders.length != 0) {
          if (orders.length > indice) {
            ctx.status = 200;
            ctx.body = {
              status: "sucesso",
              dados: orders[indice],
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
    } else if (ctx.method == "PUT") {
      if (!(url[1] == 0) && orders.length != 0) {
        if (orders.length > indice) {
          const resposta = updateOrders(orders, indice, requestBody);
          if (resposta) {
            ctx.status = 200;
            ctx.body = {
              status: "Sucesso",
              dados: orders[indice],
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
      if (!(url[1] == 0) && orders.length != 0) {
        if (orders.length > indice) {
          orders[indice].deletado = true;
          ctx.status = 200;
          ctx.body = {
            status: "Sucesso",
            dados: orders[indice],
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
  precoPedido[orders.length + 1] = 0;
  const novoPedido = {
    id: orders.length + 1,
    produtos: [], // id e qtd;
    estado: "incompleto",
    idCliente: pedido.idCliente,
    valorTotal: precoPedido[orders.length + 1],
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

function updateOrders(ordens, index, pedido) {
  let cont = 0;
  if (!pedido.hasOwnProperty("estado") && pedido.hasOwnProperty("qtd")) {
    if (ordens[index].produtos.length == 0) {
      if (ordens[index].estado == "incompleto") {
        for (let i = 0; i < pedido.length; i++) {
          precoPedido[index] +=
            products[pedido[i].id - 1].valor * pedido[i].qtd;
          products[pedido[i].id - 1].quantidadeDisponivel -= pedido[i].qtd;
        }
        const novoPedido = {
          id: ordens[index].id,
          produtos: [pedido],
          estado: "incompleto",
          idCliente: ordens[index].idCliente,
          valorTotal: precoPedido[index],
          deletado: false,
        };

        orders[index] = novoPedido;
        return novoPedido;
      }
    } else {
      if (ordens[index].estado == "incompleto") {
        for (let i = 0; i < pedido.length; i++) {
          precoPedido[index] +=
            products[pedido[i].id - 1].valor * pedido[i].qtd;
          products[pedido[i].id - 1].quantidadeDisponivel -= pedido[i].qtd;
        }

        const novoPedido = {
          produtos: pedido,
          valorTotal: precoPedido[index],
        };
        for (let i = 0; i < orders[index].produtos.length; i++) {
          if (orders[index].produtos[i].id == pedido.id) {
            orders[index].produtos[i].qtd =
              parseInt(orders[index].produtos[i].qtd) + parseInt(pedido.qtd);
            break;
          } else {
            cont++;
          }
        }
        if (cont == orders[index].produtos.length) {
          ordens[index].produtos.push(novoPedido.produtos);
          ordens[index].valorTotal = novoPedido.valorTotal;
          cont = 0;
        }

        console.log(ordens[index].produtos);

        return novoPedido;
      }
    }
  } else if (pedido.hasOwnProperty("estado") && !pedido.hasOwnProperty("qtd")) {
    orders[index].estado = pedido.estado;
    return pedido.estado;
  } else if (pedido.hasOwnProperty("estado") && pedido.hasOwnProperty("qtd")) {
  }
}

server.listen(8081, () => console.log("servidor está rodando na porta 8081"));
