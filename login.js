const botaoEntrar = document.getElementById('entrar-login');
const emailInput = document.getElementById('email-login');
const senhaInput = document.getElementById('senha-login');

botaoEntrar.addEventListener("click", async () => {
    const dados = {
        email: emailInput.value,
        senha: senhaInput.value
    }

    try {
        const resposta = await fetch("https://ninifood.onrender.com/login", {
            method: "POST",
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if(resposta.ok) {
           
            localStorage.removeItem("pedido_em_andamento");
            localStorage.removeItem("hora_inicio_pedido");
            localStorage.removeItem("ultimo_resumo");
            localStorage.removeItem("carrinho_projeto");

            localStorage.setItem("token", resultado.token);
            localStorage.setItem("usuarioNome", resultado.nome);

            alert(`Bem-vindo, ${resultado.nome}!`);
            window.location.href = "cardapio.html";
        } else {
            alert(resultado.mensagem);
        }
    } catch (erro) {
        console.error("Erro ao fazer login:", erro);
        alert("Erro ao conectar com o servidor.");
    }
});