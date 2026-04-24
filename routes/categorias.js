const express = require('express');
const router = express.Router();
const db = require('../data/supabase');

// GET /api/categorias — retorna todas as categorias
router.get('/', async (req, res) => {
    const { data, error } = await db.from('categorias').select('*');
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

// POST /api/categorias — cria uma nova categoria
router.post('/', async (req, res) => {
    const { data, error } = await db.from('categorias').insert([
        { nome: req.body.nome }
    ]).select();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data[0]);
});

module.exports = router;
