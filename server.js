import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const app = express()
app.use(express.json())
app.use(cors())

const secret = "SUA_CHAVE_MESTRE_SUPER_SECRETA"; 

mongoose.connect("mongodb+srv://ninifood:fluminense@ninifood.ttlxvwi.mongodb.net/projeto?retryWrites=true&w=majority")
.then(() => console.log("Banco conectado"))
.catch(err => console.log(err))

const userSchema = new mongoose.Schema({
    nome: String,
    email: String,
    senha: String
})

const orderSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    itens: Array,
    data: { type: Date, default: Date.now },
    status: { type: String, default: "Pendente" }
})

const Order = mongoose.model("Order", orderSchema)
const User = mongoose.model("User", userSchema)


app.post('/registro', async (req, res) => {
    const { nome, email, senha } = req.body
    try {
        const usuarioExistente = await User.findOne({ email })
        if (usuarioExistente) return res.status(400).json({ mensagem: "Email já cadastrado" })
        const novoUsuario = new User({ nome, email, senha })
        await novoUsuario.save()
        res.json({ mensagem: "Usuário cadastrado com sucesso", usuario: novoUsuario })
    } catch (erro) { res.status(500).json({ mensagem: "Erro ao cadastrar" }) }
})

app.post('/login', async (req, res) => { 
    const { email, senha } = req.body;
    try {
        const usuario = await User.findOne({ email });
        if (!usuario || usuario.senha !== senha) return res.status(401).json({ mensagem: "Credenciais inválidas" });
        const token = jwt.sign({ id: usuario._id }, secret, { expiresIn: '1h' });
        res.json({ mensagem: "Login realizado com sucesso!", token, nome: usuario.nome });
    } catch (erro) { res.status(500).json({ mensagem: "Erro ao realizar login" }); }
});

app.post('/pedidos', async (req, res) => {
    const { itens, token } = req.body;
    try {
        const decoded = jwt.verify(token, secret);
        const novoPedido = new Order({
            usuarioId: decoded.id,
            itens,
            status: "Aguardando confirmação"
        });
        await novoPedido.save();
        res.json({ mensagem: "Pedido salvo!", pedido: novoPedido });
    } catch (erro) { res.status(401).json({ mensagem: "Erro ao salvar pedido" }); }
});

app.get('/meus-pedidos/:token', async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, secret);
        const pedidos = await Order.find({ usuarioId: decoded.id }).sort({ data: -1 });
        res.json(pedidos);
    } catch (erro) { res.status(401).json({ mensagem: "Erro ao buscar histórico" }); }
});

app.patch('/atualizar-status', async (req, res) => {
    const { token, novoStatus } = req.body;
    const secret = "SUA_CHAVE_MESTRE_SUPER_SECRETA";

    try {
        const decoded = jwt.verify(token, secret);
        const usuarioId = decoded.id;

        const pedido = await Order.findOne({ 
            usuarioId: usuarioId, 
            status: { $ne: "Entregue" } 
        }).sort({ data: -1 });

        if (!pedido) {
            return res.status(404).json({ mensagem: "Nenhum pedido pendente para este usuário." });
        }

        pedido.status = novoStatus;
        await pedido.save();

        res.json({ mensagem: "Status atualizado!", pedido });
    } catch (erro) {
        res.status(401).json({ mensagem: "Sessão inválida" });
    }
});

app.put('/usuarios/atualizar', async (req, res) => {
    const { token, novoNome, novoEmail, novaSenha } = req.body;

    try {
        const decoded = jwt.verify(token, secret);
        const usuarioId = decoded.id;

        const usuarioAtual = await User.findById(usuarioId);
        if (!usuarioAtual) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }

        const dadosAtualizados = {};

        if (novaSenha) {
            if (usuarioAtual.senha === novaSenha) {
                return res.status(400).json({ mensagem: "A nova senha não pode ser igual à atual!" });
            }
            dadosAtualizados.senha = novaSenha;
        }

        if (novoEmail) {
            const emailEmUso = await User.findOne({ email: novoEmail, _id: { $ne: usuarioId } });
            if (emailEmUso) {
                return res.status(400).json({ mensagem: "Este e-mail já está sendo usado por outra conta." });
            }
            dadosAtualizados.email = novoEmail;
        }

        if (novoNome) dadosAtualizados.nome = novoNome;

        await User.findByIdAndUpdate(usuarioId, dadosAtualizados);

        res.json({ mensagem: "Dados atualizados com sucesso!" });

    } catch (erro) {
        res.status(401).json({ mensagem: "Sessão expirada. Faça login novamente." });
    }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'))