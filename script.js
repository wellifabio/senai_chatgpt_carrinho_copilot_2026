const produtos = []
const carrinho = []

const btnCarrinho = document.querySelector('#btnCarrinho')
const modalCarrinho = document.querySelector('#modalCarrinho')
const listaCarrinho = document.querySelector('#listaCarrinho')
const totalGeralCarrinho = document.querySelector('#totalGeralCarrinho')
const btnFecharModal = document.querySelector('#btnFecharModal')
const btnEnviarPedido = document.querySelector('#btnEnviarPedido')

inicializar()

async function inicializar() {
    await obterProdutos()
    renderProdutos()
    configurarEventosCarrinho()
}

async function obterProdutos() {
    const response = await fetch('data.json')
    const data = await response.json()
    produtos.push(...data.produtos)
}

function renderProdutos() {
    const main = document.querySelector('main')
    main.innerHTML = ''
    produtos.forEach((p, index) => {
        main.innerHTML += `<div>
            <h2>${p.nome}</h2>
            <p>${p.descricao}</p>
            <p>R$ ${p.preco.toFixed(2)}</p>
            <img src="${p.img}" alt="${p.nome}">
            <button class="btn-add-carrinho" data-index="${index}">Add ao carrinho</button>
        </div>`
    })

    const botoesAdicionar = document.querySelectorAll('.btn-add-carrinho')
    botoesAdicionar.forEach(botao => {
        botao.addEventListener('click', () => {
            const indice = Number(botao.dataset.index)
            adicionarAoCarrinho(indice)
        })
    })
}

function configurarEventosCarrinho() {
    btnCarrinho.addEventListener('click', abrirModalCarrinho)
    btnFecharModal.addEventListener('click', fecharModalCarrinho)
    btnEnviarPedido.addEventListener('click', enviarPedido)
    modalCarrinho.addEventListener('click', evento => {
        if (evento.target === modalCarrinho) {
            fecharModalCarrinho()
        }
    })
}

function adicionarAoCarrinho(indiceProduto) {
    const itemExistente = carrinho.find(item => item.indiceProduto === indiceProduto)

    if (itemExistente) {
        itemExistente.quantidade += 1
    } else {
        carrinho.push({
            indiceProduto,
            produto: produtos[indiceProduto],
            quantidade: 1
        })
    }

    abrirModalCarrinho()
}

function abrirModalCarrinho() {
    renderCarrinho()
    modalCarrinho.classList.remove('oculto')
}

function fecharModalCarrinho() {
    modalCarrinho.classList.add('oculto')
}

function renderCarrinho() {
    listaCarrinho.innerHTML = ''
    let totalGeral = 0

    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = '<li>Carrinho vazio.</li>'
        totalGeralCarrinho.textContent = 'Total: R$ 0,00'
        return
    }

    carrinho.forEach(item => {
        const subtotal = item.produto.preco * item.quantidade
        totalGeral += subtotal

        listaCarrinho.innerHTML += `<li class="item-carrinho">
            <div class="item-carrinho-topo">
                <span>${item.produto.nome}</span>
                <strong>R$ ${item.produto.preco.toFixed(2)}</strong>
            </div>
            <div class="controle-quantidade">
                <button class="btn-qtd" data-acao="diminuir" data-index="${item.indiceProduto}">-</button>
                <span class="qtd-valor">${item.quantidade}</span>
                <button class="btn-qtd" data-acao="aumentar" data-index="${item.indiceProduto}">+</button>
            </div>
            <p class="item-subtotal">Subtotal: R$ ${subtotal.toFixed(2)}</p>
        </li>`
    })

    totalGeralCarrinho.textContent = `Total: R$ ${totalGeral.toFixed(2)}`
}

listaCarrinho.addEventListener('click', evento => {
    const botao = evento.target.closest('.btn-qtd')

    if (!botao) {
        return
    }

    const indiceProduto = Number(botao.dataset.index)
    const acao = botao.dataset.acao
    const delta = acao === 'aumentar' ? 1 : -1
    alterarQuantidadeItem(indiceProduto, delta)
})

function alterarQuantidadeItem(indiceProduto, delta) {
    const item = carrinho.find(produto => produto.indiceProduto === indiceProduto)

    if (!item) {
        return
    }

    item.quantidade += delta

    if (item.quantidade <= 0) {
        const indiceItem = carrinho.findIndex(produto => produto.indiceProduto === indiceProduto)
        carrinho.splice(indiceItem, 1)
    }

    renderCarrinho()
}

function enviarPedido() {
    carrinho.length = 0
    fecharModalCarrinho()
}
