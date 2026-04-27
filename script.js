const swiper = new Swiper('.swiper', {
  slidesPerView: 3, // quantos aparecem na tela
  spaceBetween: 17,
  freeMode: true, // deixa arrastar livre
});

// Verifica se o usuário tem um token salvo
function verificarAutenticacao() {
    const token = localStorage.getItem('token');

    // Se NÃO houver token, ele manda para a tela de registro/login
    if (!token) {
        window.location.href = "login.html"; // Coloque o nome correto do seu arquivo de cadastro
    }
}

// Executa a checagem assim que a página tenta carregar
verificarAutenticacao();



//  -------------------------------------------------------------- //

// 1. Criamos a nossa sacola vazia (é um array que vai guardar objetos)
let sacola = [];

function adicionarItem(botao) {
    const nomeItem = botao.getAttribute('data-nome');
    const itemEncontrado = sacola.find(item => item.nome === nomeItem);

    if (itemEncontrado) {
        itemEncontrado.quantidade += 1;
    } else {
        sacola.push({ nome: nomeItem, quantidade: 1 });
    }

    salvarSacola();
    renderizarCarrinho(); 
    
    console.log(sacola); 
}


function renderizarCarrinho() {
    const divCarrinho = document.getElementById('carrinho');
    
    // 1. Checa se a sacola está vazia
    if (sacola.length === 0) {
        divCarrinho.style.display = "none";
        return; // Sai da função aqui mesmo
    }

    // 2. Se chegou aqui, é porque tem itens! Vamos mostrar:
    divCarrinho.style.display = "flex";

    // 3. Calcula o total de itens (unidades)
    const totalItens = sacola.reduce((total, item) => total + item.quantidade, 0);

    // 4. Cria o visual interno (Ex: "3 itens na sacola | Ver Sacola")
    divCarrinho.innerHTML = `
        <span><i class="bi bi-bag-fill"></i> ${totalItens} ${totalItens > 1 ? 'itens' : 'item'}</span>
        <strong style="cursor: pointer;">Ver sacola </strong>
    `;
}

function salvarSacola() {
    // JSON.stringify transforma o array [ ] em uma string " [ ] "
    localStorage.setItem('carrinho_projeto', JSON.stringify(sacola));
}


// 1. A função que leva o usuário para a outra página
function irParaPedidos() {
    // Como os dados já foram salvos no LocalStorage pelo adicionarItem, 
    // a gente só precisa mudar de página agora.
    window.location.href = "pedidos.html";
}

// 2. Atualize sua função de renderizar para o botão ser clicável
function renderizarCarrinho() {
    const divCarrinho = document.getElementById('carrinho');
    
    if (sacola.length === 0) {
        divCarrinho.style.display = "none";
        return;
    }

    divCarrinho.style.display = "flex";

    const totalItens = sacola.reduce((total, item) => total + item.quantidade, 0);

    // Adicionamos o onclick="irParaPedidos()" aqui dentro do HTML dinâmico
    divCarrinho.innerHTML = `
        <span><i class="bi bi-bag-fill"></i> ${totalItens} ${totalItens > 1 ? 'itens' : 'item'}</span>
        <strong onclick="irParaPedidos()" style="cursor: pointer;">Ver sacola</strong>
    `;
}

function atualizarStatusRestaurante() {
    const agora = new Date();
    
    // Pega a hora exata de Brasília
    const horaBrasilia = parseInt(agora.toLocaleTimeString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        hour12: false
    }));

    const labelStatus = document.getElementById('texto-status-loja');
    const containerCardapio = document.getElementById('home'); // O <main id="home">

    // Regra: Aberto das 15h até as 23:59 (00h fecha)
    const estaAberto = horaBrasilia >= 15 && horaBrasilia < 24;

    if (estaAberto) {
        labelStatus.innerText = "Aberto";
        labelStatus.style.color = "green";
        containerCardapio.classList.remove('cardapio-fechado');
    } else {
        labelStatus.innerText = "Fechado";
        labelStatus.style.color = "red";
        containerCardapio.classList.add('cardapio-fechado');
        
        // Opcional: Bloqueia os botões individualmente por segurança
        document.querySelectorAll('button').forEach(btn => btn.disabled = true);
    }
}

// Chama a função assim que a página carregar
window.onload = atualizarStatusRestaurante;













