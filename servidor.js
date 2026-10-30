const express = require('express');
const treinosController = require('./controllers/treinosController.js');
const authController = require('./controllers/authController.js');

const app = express();
app.use(express.json());

// treinos (rotas fixas ANTES de /treinos/:id)
app.get('/treinos', treinosController.listar);
app.get('/treinos/total', treinosController.total);
app.get('/treinos/resumo', treinosController.resumo);
app.get('/treinos/filtrar/nome', treinosController.filtrarPorNome);
app.get('/treinos/filtrar/duracao', treinosController.filtrarPorDuracao);
app.get('/treinos/:id', treinosController.buscarUm);
app.post('/treinos', treinosController.criar);
app.put('/treinos/:id', treinosController.atualizar);
app.delete('/treinos/:id', treinosController.remover);

// autenticacao (Aula 05)
app.post('/login', authController.login);
app.get('/perfil', authController.perfil);
app.post('/logout', authController.logout);

const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
