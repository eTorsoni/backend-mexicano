const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const loggerMiddleware = require('./middlewares/logger.js');
const errorHandler = require('./middlewares/errorHandler.js');
const categoriasRouter = require('./routes/categorias.js');
const produtosRouter = require('./routes/produtos.js');

app.use(loggerMiddleware);

app.use('/api/categorias', categoriasRouter);
app.use('/api/produtos', produtosRouter);

app.get('/', (req, res) => {
    res.json({ mensagem: '🌮 Bem-vindo à API do Restaurante Mexicano' });
});

// Rota 404 — deve ficar ANTES do errorHandler
app.use((req, res, next) => {
    res.status(404).json({
        sucesso: false,
        mensagem: `Rota '${req.url}' não encontrada na API do Restaurante Mexicano.`
    });
});

app.use(errorHandler);

// ✅ Necessário para a Vercel conseguir iniciar o servidor
const PORTA = process.env.PORT || 3001;
app.listen(PORTA, () => {
    console.log(`Servidor aberto na porta http://localhost:${PORTA}`);
});

module.exports = app;
