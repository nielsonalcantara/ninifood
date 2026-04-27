let cadastrarLogin = document.getElementById('cadastrarLogin')

cadastrarLogin.addEventListener("click", function () {
    let nomeCadastro = document.getElementById('nome-cadastro').value
    let emailCadastro = document.getElementById('email-cadastro').value
    let senhaCadastro = document.getElementById('senha-cadastro').value
    let confirmarSenhaCadastro = document.getElementById('confirmar-senha-cadastro').value
    let mensagemCadastro = document.getElementById('mensagem-cadastro')

    if (nomeCadastro === "" || emailCadastro === "" || senhaCadastro === "" || confirmarSenhaCadastro === "") {
        alert('Preencha todos os campos')
        return
    }

    if (senhaCadastro !== confirmarSenhaCadastro) {
        alert('Senhas divergem')
        return
    }

    fetch("http://localhost:3000/registro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nomeCadastro,
            email: emailCadastro,
            senha: senhaCadastro
        })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw err })
        }
        return res.json()
    })
    .then(data => {
        // --- LÓGICA DA MENSAGEM NA TELA ---
        
        // 1. Define o texto e a cor (opcional, se quiser verde)
        mensagemCadastro.innerText = "Cadastro realizado com sucesso!";
        mensagemCadastro.style.color = "green";
        mensagemCadastro.style.display = "block"; // Garante que a div apareça

        // 2. Aguarda 2 segundos (2000ms)
        setTimeout(() => {
            // Esconde a mensagem
            mensagemCadastro.style.display = "none";
            
            // Redireciona para o index (ou login, como preferir)
            window.location.href = "login.html"; 
        }, 2000);

    })
    .catch(error => {
        // Em caso de erro (como e-mail já existente), ainda usamos o alert ou você pode usar a mesma div de mensagem
        alert(error.mensagem || "Erro ao realizar cadastro");
    })
})