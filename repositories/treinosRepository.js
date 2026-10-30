const db = require('../banco.js');

function listar(minimo, busca) {
    let sql = 'SELECT * FROM treinos WHERE 1 = 1';
    const params = [];
    if (minimo !== undefined) {
        sql += ' AND duracao >= ?';
        params.push(minimo);
    }
    if (busca !== undefined) {
        sql += ' AND nome LIKE ?';
        params.push(`%${busca}%`);
    }
    sql += ' ORDER BY duracao DESC';
    return db.prepare(sql).all(...params);
}

function listarTodos() {
    return listar(undefined, undefined);
}

function total() {
    return db.prepare('SELECT COUNT(*) AS total FROM treinos').get();
}

function resumo() {
    return db.prepare(
        'SELECT COUNT(*) AS total, COALESCE(SUM(duracao), 0) AS minutos, COALESCE(AVG(duracao), 0) AS media FROM treinos'
    ).get();
}

function filtrarPorDuracaoMaxima(max) {
    return db.prepare('SELECT * FROM treinos WHERE duracao <= ?').all(max);
}

function buscarPorId(id) {
    return db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
}

function criar(nome, duracao) {
    const resultado = db
        .prepare('INSERT INTO treinos (nome, duracao) VALUES (?, ?)')
        .run(nome, duracao);
    return buscarPorId(resultado.lastInsertRowid);
}

function atualizar(id, nome, duracao) {
    db.prepare('UPDATE treinos SET nome = ?, duracao = ? WHERE id = ?')
      .run(nome, duracao, id);
    return buscarPorId(id);
}

function remover(id) {
    const resultado = db.prepare('DELETE FROM treinos WHERE id = ?').run(id);
    return resultado.changes > 0;
}

module.exports = {
    listar, listarTodos, total, resumo, filtrarPorDuracaoMaxima,
    buscarPorId, criar, atualizar, remover,
};
