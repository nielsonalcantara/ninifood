import express from 'express'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())

app.post('/registrar', (req, res) => {
    const nomeRegistrado = req.body.nome
    const emailRegistrado = req.body.email
    const senhaRegistrada = req.body.senha 

    res.json({
        mensagem: "Cadastro funcionando"
    })
})

app.listen(3000, () => {
    console.log('Servidor rodando')
})