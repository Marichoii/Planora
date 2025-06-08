const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // carrega as variáveis do .env

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve arquivos HTML, CSS etc

console.log("URI:", process.env.MONGO_URI);
// Conectar ao MongoDB Atlas (usando string oculta)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Conectado ao MongoDB Atlas"))
  .catch(err => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Modelo do usuário
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
  username: String,
  email: String,
  senha: String
}));

// Rota de registro
app.post('/registrar', async (req, res) => {
  try {
    const novo = new Usuario(req.body);
    await novo.save();
    res.status(200).send("Usuário registrado com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao registrar usuário.");
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});

app.post('/login', async (req, res) => {
  const { username, email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ username, email, senha });

    if (usuario) {
      res.status(200).send("Login bem-sucedido!");
    } else {
      res.status(401).send("Usuário ou senha inválidos.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor ao tentar fazer login.");
  }
});
