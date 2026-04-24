const express = require('express');
const router = express.Router();
const db = require('../data/supabase');

// Normaliza o campo categoria_id (snake_case do Supabase/PostgreSQL)
// para categoriaId (camelCase esperado pelo frontend)
function normalizarProduto(p) {
    const { categoria_id, ...resto } = p;
    return {
        ...resto,
        categoriaId: categoria_id ?? p.categoriaId
    };
}

// Rota de teste de erro
router.get('/erro-teste', (req, res, next) => {
    next(new Error('Teste de Erro :('));
});

// GET /api/produtos?categoriaId=1 — filtra por categoria (opcional)
router.get('/', async (req, res) => {
    const categoriaId = req.query.categoriaId;
    if (categoriaId) {
        const { data, error } = await db.from('produtos').select('*').eq('categoria_id', categoriaId);
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data.map(normalizarProduto));
    }
    const { data, error } = await db.from('produtos').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data.map(normalizarProduto));
});

// GET /api/produtos/:id — retorna um produto pelo id
router.get('/:id', async (req, res) => {
    const produtoID = parseInt(req.params.id);
    const { data, error } = await db.from('produtos').select('*').eq('id', produtoID).single();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(normalizarProduto(data));
});

// POST /api/produtos — cria um novo produto
router.post('/', async (req, res) => {
    const { data, error } = await db.from('produtos').insert([
        {
            categoria_id: req.body.categoriaId,
            nome: req.body.nome,
            descricao: req.body.descricao,
            preco: req.body.preco,
            imagem: req.body.imagem
        }
    ]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(normalizarProduto(data[0]));
});

// PUT /api/produtos/:id — atualiza um produto
router.put('/:id', async (req, res) => {
    const produtoID = parseInt(req.params.id);
    const body = { ...req.body };
    if (body.categoriaId !== undefined) {
        body.categoria_id = body.categoriaId;
        delete body.categoriaId;
    }
    const { data, error } = await db.from('produtos').update(body).eq('id', produtoID).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(normalizarProduto(data[0]));
});

// DELETE /api/produtos/:id — deleta um produto
router.delete('/:id', async (req, res) => {
    const produtoID = parseInt(req.params.id);
    const { error } = await db.from('produtos').delete().eq('id', produtoID);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Produto deletado com sucesso' });
});

module.exports = router;
