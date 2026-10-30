const repository = require('../repositories/treinosRepository.js');

const DURACAO_MAXIMA = 180;

function validarTreino(corpo) {
    if (typeof corpo?.nome !== 'string' || corpo.nome.trim() === '') {
        return 'O campo nome e obrigatorio e deve ser um texto.';
    }
    if (typeof corpo.duracao !== 'number' || corpo.duracao <= 0) {
        return 'O campo duracao e obrigatorio e deve ser um numero maior que zero.';
    }
    if (corpo.duracao > DURACAO_MAXIMA) {
        return 'O campo duracao nao pode ser maior que 180 minutos.';
    }
    return null;
}

function listar(minimo, busca) {
    return repository.listar(minimo, busca);
}

function total() {
    return repository.total();
}

function resumo() {
    return repository.resumo();
}

function filtrarPorDuracaoMaxima(max) {
    return repository.filtrarPorDuracaoMaxima(max);
}

function buscarPorId(id) {
    return repository.buscarPorId(id);
}

function criarTreino(corpo) {
    const erro = validarTreino(corpo);
    if (erro !== null) return { erro: erro };
    const novo = repository.criar(corpo.nome, corpo.duracao);
    return { treino: novo };
}

function atualizarTreino(id, corpo) {
    const existente = repository.buscarPorId(id);
    if (existente === undefined) return { naoEncontrado: true };
    const erro = validarTreino(corpo);
    if (erro !== null) return { erro: erro };
    const atualizado = repository.atualizar(id, corpo.nome, corpo.duracao);
    return { treino: atualizado };
}

function removerTreino(id) {
    const existente = repository.buscarPorId(id);
    if (existente === undefined) return { naoEncontrado: true };
    repository.remover(id);
    return { removido: true };
}

module.exports = {
    listar, total, resumo, filtrarPorDuracaoMaxima,
    buscarPorId, criarTreino, atualizarTreino, removerTreino,
};
