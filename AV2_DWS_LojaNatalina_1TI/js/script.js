// Utilitários
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const storage = typeof localStorage !== "undefined" ? localStorage : {
    getItem: () => null,
    setItem: () => {}
};

// 1. CARDS DINÂMICOS
function criarCard(produto) {
    const jaNoCarrinho = Array.isArray(carrinho) && carrinho.some(item => item.id === produto.id);

    return `
        <article class="card">
            <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
            <div class="card-body">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <strong>${formatarPreco(produto.preco)}</strong>
                <div class="acoes-carrinho">
                    <button class="btn-natal btn-comprar" data-id="${produto.id}">Adicionar ao Carrinho</button>
                    ${jaNoCarrinho ? `<button class="btn-natal btn-remover" data-id="${produto.id}">Remover do Carrinho</button>` : ""}
                </div>
            </div>
        </article>
    `;
}

function mostrarProdutos(lista) {
    const area = document.getElementById("lista-produtos");
    if (!area) return;

    if (lista.length === 0) {
        area.innerHTML = `<p style="grid-column: 1/-1; text-align: center; font-size: 1.2rem; color: var(--vermelho);">
            🎅 Ops! Nenhum produto natalino foi encontrado com essa busca.
        </p>`;
    } else {
        area.innerHTML = lista.map(criarCard).join("");
    }
}

function mostrarDestaques() {
    const area = document.getElementById("lista-destaques");
    if (!area) return;
    const destaques = produtos.filter(p => p.destaque);
    area.innerHTML = destaques.map(criarCard).join("");
}

// 2. FILTRO, BUSCA E ORDENAÇÃO
function filtrarEOrdenar() {
    const campoBusca = document.getElementById("busca");
    const seletorCategoria = document.getElementById("categoria");
    const seletorOrdenacao = document.getElementById("ordenacao");
    const contador = document.getElementById("contador");

    if (!campoBusca || !seletorCategoria) return;

    const texto = campoBusca.value.toLowerCase();
    const categoria = seletorCategoria.value;

    let resultado = produtos.filter(p => {
        const combinaNome = p.nome.toLowerCase().includes(texto) || p.descricao.toLowerCase().includes(texto);
        const combinaCategoria = categoria === "todas" || p.categoria === categoria;
        return combinaNome && combinaCategoria;
    });

    if (seletorOrdenacao) {
        const ord = seletorOrdenacao.value;
        if (ord === "menor-preco") resultado.sort((a, b) => a.preco - b.preco);
        if (ord === "maior-preco") resultado.sort((a, b) => b.preco - a.preco);
        if (ord === "nome") resultado.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    mostrarProdutos(resultado);
    if (contador) {
        contador.textContent = `Mostrando ${resultado.length} de ${produtos.length} produtos`;
    }
}

// 3. CARRINHO DE COMPRAS & LOCALSTORAGE
let carrinho = [];

try {
    carrinho = JSON.parse(storage.getItem("carrinho")) || [];
} catch (error) {
    carrinho = [];
}

function persistirCarrinho() {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
    }
}

function adicionarAoCarrinho(id) {
    const listaProdutos = typeof produtos !== "undefined" ? produtos : [];
    const prod = listaProdutos.find(p => p.id === id);
    if (prod) {
        carrinho.push(prod);
        persistirCarrinho();
        atualizarCarrinho();
        tocarSino();
    }
}

function removerDoCarrinho(id) {
    const indice = carrinho.findIndex(item => item.id === id);
    if (indice === -1) return false;

    carrinho.splice(indice, 1);
    persistirCarrinho();
    atualizarCarrinho();
    return true;
}

function atualizarCarrinho() {
    const qtdEl = document.getElementById("qtd-carrinho");
    const totalEl = document.getElementById("total-carrinho");
    if (qtdEl && totalEl) {
        const total = carrinho.reduce((acc, item) => acc + item.preco, 0);
        qtdEl.textContent = carrinho.length;
        totalEl.textContent = formatarPreco(total);
    }
}

// 4. SONS & ÁUDIO
const musica = typeof Audio !== "undefined" ? new Audio("C:\\Users\\kelvin_palhao\\Downloads\\alex-morgan-merry-christmas-545481.mp3") : null;
if (musica) {
    musica.loop = true;
    musica.volume = 0.2;
}

function alternarMusica() {
    const btn = document.getElementById("btn-musica");
    if (!btn || !musica) return;

    if (musica.paused) {
        musica.play().then(() => {
            btn.textContent = "⏸️ Pausar Música";
        }).catch(() => {
            alert("Clique na página primeiro para liberar o áudio!");
        });
    } else {
        musica.pause();
        btn.textContent = "🎵 Tocar Música";
    }
}

function tocarSino() {
    if (typeof Audio === "undefined") return;
    const sino = new Audio("C:\\Users\\kelvin_palhao\\Downloads\\alex-morgan-merry-christmas-545481.mp3");
    sino.volume = 0.4;
    sino.play().catch(() => {});
}

// 5. SLIDESHOW
let slideAtual = 0;
function inicializarSlideshow() {
    const slides = document.querySelectorAll(".slide");
    if (slides.length === 0) return;

    function mostrar(index) {
        slides.forEach(s => s.classList.remove("ativo"));
        slideAtual = (index + slides.length) % slides.length;
        slides[slideAtual].classList.add("ativo");
    }

    const btnProx = document.getElementById("proximo");
    const btnAnt = document.getElementById("anterior");

    if (btnProx) btnProx.addEventListener("click", () => mostrar(slideAtual + 1));
    if (btnAnt) btnAnt.addEventListener("click", () => mostrar(slideAtual - 1));

    setInterval(() => mostrar(slideAtual + 1), 4000);
}

// 6. EFEITO DE NEVE
function criarNeve() {
    const quantidade = 25;
    for (let i = 0; i < quantidade; i++) {
        const floco = document.createElement("div");
        floco.className = "floco";
        floco.innerHTML = "❄";
        floco.style.left = Math.random() * 100 + "vw";
        floco.style.animationDuration = (Math.random() * 5 + 5) + "s";
        floco.style.opacity = Math.random();
        floco.style.fontSize = (Math.random() * 10 + 15) + "px";
        document.body.appendChild(floco);
    }
}

// 7. CONTAGEM REGRESSIVA PARA O NATAL
function inicializarContagem() {
    const el = document.getElementById("contagem");
    if (!el) return;

    function atualizar() {
        const agora = new Date();
        let natal = new Date(agora.getFullYear(), 11, 25);
        if (agora > natal) natal = new Date(agora.getFullYear() + 1, 11, 25);

        const diff = natal - agora;
        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutos = Math.floor((diff / 1000 / 60) % 60);
        const segundos = Math.floor((diff / 1000) % 60);

        el.textContent = `${dias}d ${horas}h ${minutos}m ${segundos}s para o Natal! 🎄`;
    }

    atualizar();
    setInterval(atualizar, 1000);
}

// 8. PARALLAX
function inicializarParallax() {
    const camadas = document.querySelectorAll("[data-velocidade]");
    window.addEventListener("scroll", () => {
        const rolagem = window.scrollY;
        camadas.forEach(camada => {
            const vel = camada.dataset.velocidade;
            camada.style.backgroundPositionY = `${rolagem * vel}px`;
        });
    });
}

// 9. VALIDAÇÃO DE FORMULÁRIO
function inicializarFormulario() {
    const form = document.getElementById("form-contato");
    const msg = document.getElementById("mensagem-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        if (!nome || !email || !mensagem) {
            msg.textContent = "❌ Por favor, preencha todos os campos obrigatórios.";
            msg.style.color = "var(--vermelho)";
            return;
        }

        msg.textContent = `✨ Obrigado ${nome}! Sua mensagem foi enviada com sucesso!`;
        msg.style.color = "var(--verde)";
        form.reset();
    });
}

// 10. LIGHTBOX / MODAL
function inicializarLightbox() {
    const modal = document.getElementById("modal-lightbox");
    const imgModal = document.getElementById("img-modal");
    const fechar = document.querySelector(".fechar-modal");
    if (!modal) return;

    document.querySelectorAll(".lightbox-img").forEach(img => {
        img.addEventListener("click", () => {
            modal.style.display = "flex";
            imgModal.src = img.src;
        });
    });

    if (fechar) {
        fechar.addEventListener("click", () => modal.style.display = "none");
    }
}

// 11. ANIMAÇÃO AO ROLAR & VOLTAR AO TOPO & MENU RESPONSIVO
function inicializarGerais() {
    // Menu Hambúrguer
    const btnMenu = document.querySelector(".btn-menu");
    const menu = document.querySelector(".menu");
    if (btnMenu && menu) {
        btnMenu.addEventListener("click", () => menu.classList.toggle("aberto"));
    }

    // Voltar ao topo
    const btnTopo = document.getElementById("topo");
    if (btnTopo) {
        window.addEventListener("scroll", () => {
            btnTopo.style.display = window.scrollY > 300 ? "block" : "none";
        });
        btnTopo.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    // Botão Música
    const btnMusica = document.getElementById("btn-musica");
    if (btnMusica) {
        btnMusica.addEventListener("click", alternarMusica);
    }

    // IntersectionObserver
    const obs = new IntersectionObserver((entradas) => {
        entradas.forEach(e => {
            if (e.isIntersecting) e.target.classList.add("visivel");
        });
    });
    document.querySelectorAll(".revelar").forEach(el => obs.observe(el));

    // Evento de clique para delegação de carrinho na grade
    document.addEventListener("click", (e) => {
        const botaoComprar = e.target.closest(".btn-comprar");
        if (botaoComprar) {
            const id = Number(botaoComprar.dataset.id);
            adicionarAoCarrinho(id);
            if (typeof filtrarEOrdenar === "function") filtrarEOrdenar();
            return;
        }

        const botaoRemover = e.target.closest(".btn-remover");
        if (botaoRemover) {
            const id = Number(botaoRemover.dataset.id);
            removerDoCarrinho(id);
            if (typeof filtrarEOrdenar === "function") filtrarEOrdenar();
        }
    });
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { carrinho, adicionarAoCarrinho, removerDoCarrinho, formatarPreco, atualizarCarrinho };
}

// EXECUÇÃO INICIAL
if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        mostrarProdutos(produtos);
        mostrarDestaques();
        atualizarCarrinho();
        inicializarSlideshow();
        criarNeve();
        inicializarContagem();
        inicializarParallax();
        inicializarFormulario();
        inicializarLightbox();
        inicializarGerais();

        const campoBusca = document.getElementById("busca");
        const seletorCat = document.getElementById("categoria");
        const seletorOrd = document.getElementById("ordenacao");

        if (campoBusca) campoBusca.addEventListener("input", filtrarEOrdenar);
        if (seletorCat) seletorCat.addEventListener("change", filtrarEOrdenar);
        if (seletorOrd) seletorOrd.addEventListener("change", filtrarEOrdenar);
    });
}
