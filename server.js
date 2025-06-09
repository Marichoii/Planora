const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // carrega as variáveis do .env

const app = express();
let port = 3001;

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

// Modelo do mapa/planta
const Mapa = mongoose.model('Mapa', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  nome: String,
  dados: Object,
  dataCriacao: { type: Date, default: Date.now },
  dataAtualizacao: { type: Date, default: Date.now }
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

// Rota de login
app.post('/login', async (req, res) => {
  const { username, email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ username, email, senha });

    if (usuario) {
      res.status(200).json({ 
        message: "Login bem-sucedido!",
        userId: usuario._id 
      });
    } else {
      res.status(401).send("Usuário ou senha inválidos.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor ao tentar fazer login.");
  }
});

// Rota para salvar mapa
app.post('/salvar-mapa', async (req, res) => {
  const { userId, nome, dados } = req.body;

  try {
    const mapa = new Mapa({
      userId,
      nome,
      dados,
      dataAtualizacao: new Date()
    });

    await mapa.save();
    res.status(200).json({ message: "Mapa salvo com sucesso!", mapaId: mapa._id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao salvar mapa.");
  }
});

// Rota para recuperar mapas do usuário
app.get('/mapas/:userId', async (req, res) => {
  try {
    const mapas = await Mapa.find({ userId: req.params.userId })
      .select('nome dataCriacao dataAtualizacao')
      .sort({ dataAtualizacao: -1 });
    res.status(200).json(mapas);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao recuperar mapas.");
  }
});

// Rota para recuperar um mapa específico
app.get('/mapa/:mapaId', async (req, res) => {
  try {
    const mapa = await Mapa.findById(req.params.mapaId);
    if (!mapa) {
      return res.status(404).send("Mapa não encontrado.");
    }
    res.status(200).json(mapa);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao recuperar mapa.");
  }
});

// Função para iniciar o servidor
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Porta ${port} em uso, tentando porta ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('❌ Erro ao iniciar o servidor:', err);
    }
  });

  // Tratamento de erros não capturados
  process.on('uncaughtException', (err) => {
    console.error('❌ Erro não capturado:', err);
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    console.log('👋 Encerrando servidor...');
    server.close(() => {
      console.log('✅ Servidor encerrado');
      process.exit(0);
    });
  });
}

// Iniciar o servidor
startServer(port);
