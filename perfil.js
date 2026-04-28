const API_URL = "https://ninifood.onrender.com";
const token = localStorage.getItem('token');
let campoSendoEditado = ""; 

function sairDaConta() {
    if (confirm("Deseja realmente sair da conta?")) {
        localStorage.removeItem('token');
        localStorage.removeItem('pedido_em_andamento');
        
        window.location.href = "login.html"; 
    }
}


function abrirEdicao(campo) {
    campoSendoEditado = campo;
    const telaEdicao = document.getElementById('tela-edicao');
    const titulo = document.getElementById('titulo-edicao');
    const input = document.getElementById('input-edicao');

    telaEdicao.classList.remove('hidden');

    if (campo === 'email') {
        titulo.innerText = "Alterar e-mail";
        input.type = "email";
        input.placeholder = "Digite o novo e-mail";
    } else if (campo === 'senha') {
        titulo.innerText = "Alterar senha";
        input.type = "password";
        input.placeholder = "Digite a nova senha";
    } else if (campo === 'nome') {
        titulo.innerText = "Alterar nome";
        input.type = "text";
        input.placeholder = "Digite o novo nome";
    }
    
    input.value = ""; 
}

function fechar() {
    document.getElementById('tela-edicao').classList.add('hidden');
}

async function salvar() {
    const novoValor = document.getElementById('input-edicao').value;

    if (!novoValor) {
        alert("Preencha o campo antes de salvar!");
        return;
    }

    const dadosParaEnviar = {
        token: token
    };

    if (campoSendoEditado === 'nome') dadosParaEnviar.novoNome = novoValor;
    if (campoSendoEditado === 'email') dadosParaEnviar.novoEmail = novoValor;
    if (campoSendoEditado === 'senha') dadosParaEnviar.novaSenha = novoValor;

    try {
        const response = await fetch(`${API_URL}/usuarios/atualizar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosParaEnviar)
        });

        const resultado = await response.json();

        if (response.ok) {
            alert(resultado.mensagem);

            if (campoSendoEditado === 'nome') {
            localStorage.setItem("usuarioNome", novoValor);
            }

            fechar();
            window.location.reload(); 
        } else {
            alert("Erro: " + resultado.mensagem);
        }
    } catch (error) {
        console.error("Erro ao conectar ao servidor:", error);
        alert("Erro ao conectar ao servidor.");
    }
}