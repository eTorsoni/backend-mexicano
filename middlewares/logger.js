const loggerMiddleware = (req, res, next) => {
    const horaAtual = new Date().toLocaleTimeString();
    console.log(`[${horaAtual}] Requisição Recebida: ${req.method} ${req.url}`);
    next();
};

module.exports = loggerMiddleware;
