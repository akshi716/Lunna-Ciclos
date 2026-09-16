// Ainda não existe serviço de autenticação: não envie os campos a uma rota inexistente.
document.querySelector('form')?.addEventListener('submit', evento => {
    evento.preventDefault();
});
