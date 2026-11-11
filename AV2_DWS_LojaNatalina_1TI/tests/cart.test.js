const assert = require('assert');

const { removerDoCarrinho, adicionarAoCarrinho, carrinho } = require('../js/script.js');

const produto = { id: 1, nome: 'Panetone', preco: 35.9 };

carrinho.length = 0;
carrinho.push(produto);

assert.strictEqual(removerDoCarrinho(1), true, 'Deve remover um item do carrinho pelo ID');
assert.strictEqual(carrinho.some(item => item.id === 1), false, 'O produto removido não deve permanecer no carrinho');

carrinho.length = 0;
carrinho.push(produto);
carrinho.push({ id: 2, nome: 'Bebida', preco: 20 });
assert.strictEqual(removerDoCarrinho(1), true, 'Deve remover apenas o item solicitado');
assert.strictEqual(carrinho.length, 1, 'O restante do carrinho deve continuar intacto');

console.log('Testes do carrinho aprovados.');
