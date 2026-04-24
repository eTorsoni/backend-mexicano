const errorHandler = (err, req, res, next) => {
    console.error(`Erro Detectado: ${err.message}`);
    res.status(500).json({
        sucesso: false,
        mensagem: 'Xiih deu ruim la no servidor',
        detalhe: err.message
    });
};

module.exports = errorHandler;
