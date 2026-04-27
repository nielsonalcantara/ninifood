const API_URL = "http://localhost:3000";
const token = localStorage.getItem('token');

let sacolaPedidos = JSON.parse(localStorage.getItem('carrinho_projeto')) || [];

const listaUl = document.getElementById('lista-pedidos');
const divAcoes = document.getElementById('acoes-pedido');
const divHistorico = document.getElementById('container-historico');
const mainPedidos = document.querySelector('main');
const telaStatus = document.getElementById('tela-status');
const textoStatus = document.getElementById('texto-status');
const resumoItens = document.getElementById('resumo-itens-status');
const iconeStatus = document.getElementById('icone-status');

function verificarEstadoNoCarregamento() {
    const pedidoAtivo = localStorage.getItem('pedido_em_andamento');
    
    if (pedidoAtivo === 'true') {
        mostrarTelaStatus();
    } else {
        if (mainPedidos) mainPedidos.style.display = "block";
        if (telaStatus) telaStatus.style.display = "none";
        
        mostrarPedidos();
        carregarHistoricoDoBanco();
    }
}

function mostrarPedidos() {
    if (!listaUl) return;
    
    listaUl.innerHTML = ""; 

    if (sacolaPedidos && sacolaPedidos.length > 0) {
        if (divAcoes) divAcoes.style.display = "block";
        
        sacolaPedidos.forEach((item, index) => {
            const li = document.createElement('li');
            li.style.cssText = "list-style: none; padding: 15px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;";
            
            const nomeFormatado = item.nome ? item.nome.replace(/_/g, " ") : "Item sem nome";
            
            li.innerHTML = `
                <span><strong>${item.quantidade}x</strong> ${nomeFormatado}</span>
                <button onclick="removerUmItem(${index})" style="border:none; background:none; color:red; cursor:pointer;">
                    <i class="bi bi-trash"></i>
                </button>
            `;
            listaUl.appendChild(li);
        });
    } else {
        listaUl.innerHTML = "<li style='text-align:center; list-style:none; padding: 20px;'>Sua sacola está vazia.</li>";
        if (divAcoes) divAcoes.style.display = "none";
    }
}

async function atualizarStatusNoBanco() {
    try {
        console.log("Tentando atualizar status no banco...");
        const response = await fetch(`${API_URL}/atualizar-status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                token: token, 
                novoStatus: "Entregue" 
            })
        });

        if (response.ok) {
            console.log("Banco atualizado!");
            await carregarHistoricoDoBanco();
        } else {
            console.error("O servidor recusou a atualização.");
        }
    } catch (erro) {
        console.error("Erro de conexão ao atualizar status:", erro);
    }
}

function verificarEstadoNoCarregamento() {
    const pedidoAtivo = localStorage.getItem('pedido_em_andamento');
    
    if (pedidoAtivo === 'true') {
        mostrarTelaStatus();
    } else {
        if (mainPedidos) mainPedidos.style.display = "block";
        if (telaStatus) telaStatus.style.display = "none";
        
        mostrarPedidos(); 
        carregarHistoricoDoBanco();
    }
}

async function confirmarPedido() {
    if (!token) {
        alert("Você precisa estar logado para fazer um pedido!");
        window.location.href = "login.html";
        return;
    }

    if (sacolaPedidos.length === 0) {
        alert("Sua sacola está vazia!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/pedidos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itens: sacolaPedidos, token: token })
        });

        if (response.ok) {
            localStorage.setItem('pedido_em_andamento', 'true');
            localStorage.setItem('hora_inicio_pedido', Date.now());
            localStorage.setItem('ultimo_resumo', JSON.stringify(sacolaPedidos));
            
            localStorage.removeItem('carrinho_projeto');
            sacolaPedidos = [];
            
            mostrarTelaStatus();
        } else {
            const dados = await response.json();
            alert("Erro: " + dados.mensagem);
        }
    } catch (erro) {
        console.error("Erro ao conectar:", erro);
        alert("Servidor fora do ar!");
    }
}

function removerUmItem(index) {
    sacolaPedidos.splice(index, 1);
    localStorage.setItem('carrinho_projeto', JSON.stringify(sacolaPedidos));
    mostrarPedidos();
}

function mostrarTelaStatus() {
    const header = document.querySelector('header');
    if (header) header.style.display = "none";
    if (mainPedidos) mainPedidos.style.display = "none";
    if (telaStatus) telaStatus.style.display = "block";

    const resumo = JSON.parse(localStorage.getItem('ultimo_resumo')) || [];
    resumoItens.innerHTML = resumo.map(i => `<p>${i.quantidade}x ${i.nome.replace(/_/g, " ")}</p>`).join('');

    iniciarTimelineRealTime();
}

function iniciarTimelineRealTime() {
    const horaInicio = localStorage.getItem('hora_inicio_pedido');
    const intervalo = setInterval(async () => {
        const segundosPassados = Math.floor((Date.now() - horaInicio) / 1000);

        if (segundosPassados < 5) {
            textoStatus.innerText = "Aguardando confirmação...";
            iconeStatus.className = "bi bi-clock-history";
        } else if (segundosPassados < 10) {
            textoStatus.innerText = "Preparando seu pedido...";
            iconeStatus.className = "bi bi-fire";
        } else if (segundosPassados < 20) {
            textoStatus.innerText = "Pedido a caminho!";
            iconeStatus.className = "bi bi-bicycle";
        } else {
            textoStatus.innerText = "Pedido entregue!";
            iconeStatus.className = "bi bi-check-circle-fill";
            iconeStatus.style.color = "green";
            
            clearInterval(intervalo);
            localStorage.removeItem('pedido_em_andamento');
            
            await atualizarStatusNoBanco();
        }
    }, 1000);
}

async function atualizarStatusNoBanco() {
    try {
        await fetch(`${API_URL}/atualizar-status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token, novoStatus: "Entregue" })
        });
        carregarHistoricoDoBanco();
    } catch (erro) {
        console.error("Erro ao atualizar status:", erro);
    }
}

async function carregarHistoricoDoBanco() {
    if (!token || !divHistorico) return;

    try {
        const response = await fetch(`${API_URL}/meus-pedidos/${token}`);
        const pedidos = await response.json();

        if (response.ok) {
            divHistorico.innerHTML = `
                <div style="margin: 30px 0 15px 0; border-bottom: 2px solid #eee; padding-bottom: 10px;">
                    <h3 style="margin:0; color: #333;">Meus Pedidos no Nini Food</h3>
                </div>
            `;
            
            if (pedidos.length === 0) {
                divHistorico.innerHTML += "<p style='text-align:center; color:#999;'>Nenhum pedido encontrado.</p>";
                return;
            }

            pedidos.forEach(p => {
                const divH = document.createElement('div');
                
                const isEntregue = p.status === "Entregue";
                const corStatus = isEntregue ? "#28a745" : "#ff9800"; 
                const bgStatus = isEntregue ? "#e6f4ea" : "#fff4e5"; 
                const bordaLateral = isEntregue ? "#28a745" : "#06054c"; 

                divH.style.cssText = `
                    background: #fff; 
                    padding: 20px; 
                    margin-bottom: 20px; 
                    border-radius: 12px; 
                    border-left: 8px solid ${bordaLateral}; 
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    transition: transform 0.2s;
                `;

                const dataFormatada = new Date(p.data).toLocaleDateString();
                const itensTexto = p.itens.map(i => `<strong>${i.quantidade}x</strong> ${i.nome.replace(/_/g, " ")}`).join(', ');

                divH.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-size:0.85rem; color:#888; font-weight: 500;">
                            <i class="bi bi-calendar3"></i> ${dataFormatada}
                        </span>
                        <span style="
                            background: ${bgStatus}; 
                            color: ${corStatus}; 
                            padding: 4px 12px; 
                            border-radius: 20px; 
                            font-size: 0.75rem; 
                            font-weight: bold;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        ">
                            ${p.status}
                        </span>
                    </div>
                    <p style="margin:0; color:#444; line-height: 1.5; font-size: 1rem;">
                        ${itensTexto}
                    </p>
                `;

                divH.onmouseenter = () => divH.style.transform = "scale(1.01)";
                divH.onmouseleave = () => divH.style.transform = "scale(1)";

                divHistorico.appendChild(divH);
            });
        }
    } catch (erro) {
        console.log("Erro ao carregar histórico:", erro);
    }
}

verificarEstadoNoCarregamento();