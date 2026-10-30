const service = require('../services/treinosService.js');
const auth = require('./authController.js');

function idValido(texto) {
    return /^\d+$/.test(texto);
}

function listar(req, res) {
    let minimo;
    if (req.query.minimo !== undefined) {
        minimo = Number(req.query.minimo);
        if (Number.isNaN(minimo)) {
            return res.status(400).json({ erro: 'O parametro minimo deve ser um numero.' });
        }
    }
    const busca = req.query.busca;
    res.status(200).json(service.listar(minimo, busca));
}

function total(req, res) {
    res.status(200).json(service.total());
}

function resumo(req, res) {
    res.status(200).json(service.resumo());
}

function filtrarPorNome(req, res) {
    const termo = req.query.termo;
    if (!termo || termo.trim() === '') {
        return res.status(400).json({ erro: 'O parametro de busca "termo" e obrigatorio.' });
    }
    res.status(200).json(service.listar(undefined, termo));
}

function filtrarPorDuracao(req, res) {
    const max = Number(req.query.max);
    if (Number.isNaN(max) || max <= 0) {
        return res.status(400).json({ erro: 'O parametro "max" deve ser um numero maior que zero.' });
    }
    res.status(200).json(service.filtrarPorDuracaoMaxima(max));
}

function buscarUm(req, res) {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ erro: 'ID invalido.' });
    }
    const treino = service.buscarPorId(Number(req.params.id));
    if (treino === undefined) {
        return res.status(404).json({ erro: 'Treino nao encontrado.' });
    }
    res.status(200).json(treino);
}

function criar(req, res) {
    // Aula 05, exercicio 18: so quem esta logado cria treino
    if (auth.usuarioDaRequisicao(req) === null) {
        return res.status(401).json({ erro: 'Faca login primeiro.' });
    }
    const resultado = service.criarTreino(req.body);
    if (resultado.erro !== undefined) {
        return res.status(400).json({ erro: resultado.erro });
    }
    res.status(201).json(resultado.treino);
}

function atualizar(req, res) {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ erro: 'ID invalido.' });
    }
    const resultado = service.atualizarTreino(Number(req.params.id), req.body);
    if (resultado.naoEncontrado === true) {
        return res.status(404).json({ erro: 'Treino nao encontrado.' });
    }
    if (resultado.erro !== undefined) {
        return res.status(400).json({ erro: resultado.erro });
    }
    res.status(200).json(resultado.treino);
}

function remover(req, res) {
    if (!idValido(req.params.id)) {
        return res.status(400).json({ erro: 'ID invalido.' });
    }
    const resultado = service.removerTreino(Number(req.params.id));
    if (resultado.naoEncontrado === true) {
        return res.status(404).json({ erro: 'Treino nao encontrado.' });
    }
    res.status(204).end();
}

module.exports = {
    listar, total, resumo, filtrarPorNome, filtrarPorDuracao,
    buscarUm, criar, atualizar, remover,
};
