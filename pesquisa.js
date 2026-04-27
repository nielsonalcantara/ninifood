// Mapeamento COMPLETO dos produtos do seu cardápio
const produtosCardapio = [
    // PIZZAS
    { nome: "Calabresa", categoria: "Pizza", id_data: "Pizza_calabresa", desc: "" },
    { nome: "Mussarela", categoria: "Pizza", id_data: "Pizza_mussarela", desc: "" },
    { nome: "4 queijos", categoria: "Pizza", id_data: "Pizza_4_queijos", desc: "" },
    { nome: "Carne de sol", categoria: "Pizza", id_data: "Pizza_carne_de_sol", desc: "" },
    { nome: "Frango com catupiry", categoria: "Pizza", id_data: "Pizza_frango_com_catupiry", desc: "" },
    { nome: "Peito de peru", categoria: "Pizza", id_data: "Pizza_peito_de_peru", desc: "" },
    { nome: "Chocolate", categoria: "Pizza", id_data: "Pizza_chocolate", desc: "" },

    // HAMBÚRGUERES
    { nome: "X-tudo", categoria: "Hambúrguer", id_data: "X_tudo", desc: "Pão bola, salsicha, carne de hambúrguer, ovo, frango, calabresa, bacon, queijo, presunto e salada" },
    { nome: "X-calabresa", categoria: "Hambúrguer", id_data: "X_calabresa", desc: "Pão bola, carne de hamburguer, calabresa, queijo, presunto e salada" },
    { nome: "X-egg", categoria: "Hambúrguer", id_data: "X_egg", desc: "Pão bola, carne de hambúrguer, ovo, queijo, presunto e salada" },
    { nome: "X-frango", categoria: "Hambúrguer", id_data: "X_frango", desc: "Pão bola, carne de hambúrguer, frango, queijo, presunto, salada" },

    // PASTÉIS
    { nome: "Pastel de frango", categoria: "Pastel", id_data: "Pastel_de_frango", desc: "" },
    { nome: "Pastel de queijo", categoria: "Pastel", id_data: "Pastel_de_queijo", desc: "" },
    { nome: "Pastel misto", categoria: "Pastel", id_data: "Pastel_misto", desc: "" },
    { nome: "Pastel de chocolate", categoria: "Pastel", id_data: "Pastel_de_chocolate", desc: "" },
    { nome: "Pastel de doce de leite", categoria: "Pastel", id_data: "Pastel_doce_de_leite", desc: "" },

    // CACHORRO-QUENTE
    { nome: "Carne", categoria: "Cachorro-quente", id_data: "Cachorro_quente_carne", desc: "Pão, salsicha, carne moída, verdura, ovo de codorna, batata palha" },
    { nome: "Frango", categoria: "Cachorro-quente", id_data: "Cachorro_quente_frango", desc: "Pão, salsicha, frango, verdura, ovo de codorna, batata palha" },
    { nome: "Carioca", categoria: "Cachorro-quente", id_data: "Cachorro_quente_carioca", desc: "Pão, salsicha, ovo de codorna" },

    // BATATA FRITA
    { nome: "Pequena", categoria: "Batata frita", id_data: "Batata_frita_pequena", desc: "" },
    { nome: "Média", categoria: "Batata frita", id_data: "Batata_frita_media", desc: "" },
    { nome: "Grande", categoria: "Batata frita", id_data: "Batata_frita_grande", desc: "" },

    // BEBIDAS
    { nome: "Coca cola", categoria: "Bebidas", id_data: "Coca_cola", desc: "" },
    { nome: "Fanta", categoria: "Bebidas", id_data: "Fanta", desc: "" },
    { nome: "Pepsi", categoria: "Bebidas", id_data: "Pepsi", desc: "" },
    { nome: "Sprite", categoria: "Bebidas", id_data: "Sprite", desc: "" },
    { nome: "Guaraná", categoria: "Bebidas", id_data: "Guarana", desc: "" }
];

// O RESTANTE DO CÓDIGO (Event Listener e renderização) continua igual ao que te mandei antes.
const inputBusca = document.getElementById('input-busca');
const containerResultados = document.getElementById('resultados-pesquisa');

inputBusca.addEventListener('input', () => {
    const termo = inputBusca.value.toLowerCase();
    containerResultados.innerHTML = "";

    if (termo.length < 2) {
        containerResultados.innerHTML = `<p style="text-align: center; color: #999; margin-top: 50px;">Digite pelo menos 2 letras...</p>`;
        return;
    }

    const filtrados = produtosCardapio.filter(p => 
        p.nome.toLowerCase().includes(termo) || 
        p.categoria.toLowerCase().includes(termo)
    );

    if (filtrados.length === 0) {
        containerResultados.innerHTML = `<p style="text-align: center; color: #999; margin-top: 50px;">Nenhum item encontrado.</p>`;
        return;
    }

    filtrados.forEach(p => {
        const div = document.createElement('div');
        div.className = "resultado-item";
        div.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #eee;";
        div.innerHTML = `
            <div>
                <small style="color: #e21b1b; font-weight: bold;">${p.categoria.toUpperCase()}</small>
                <h4 style="margin: 5px 0;">${p.nome}</h4>
                ${p.desc ? `<p style="font-size: 0.8rem; color: #666; margin: 0;">${p.desc}</p>` : ""}
            </div>
            <button onclick="adicionarDireto('${p.id_data}')" class="botao-adicionar-pesquisa">
                <i class="bi bi-plus-lg"></i>
            </button>
        `;
        containerResultados.appendChild(div);
    });
});

function adicionarDireto(idData) {
    let sacola = JSON.parse(localStorage.getItem('carrinho_projeto')) || [];
    const index = sacola.findIndex(item => item.nome === idData);
    
    if (index > -1) {
        sacola[index].quantidade++;
    } else {
        sacola.push({ nome: idData, quantidade: 1 });
    }

    localStorage.setItem('carrinho_projeto', JSON.stringify(sacola));
    alert(`${idData.replace(/_/g, " ")} adicionado!`);
}