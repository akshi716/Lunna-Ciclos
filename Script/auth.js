(() => {
  const CHAVE_USUARIOS = 'lunna.usuarios';
  const CHAVE_SESSAO = 'lunna.sessao';
  const CHAVE_PERFIL = 'lunna.perfil';

  function redirecionarParaLogin() {
    window.location.replace('login.html');
  }

  try {
    const sessao = JSON.parse(localStorage.getItem(CHAVE_SESSAO) || 'null');
    const usuarios = JSON.parse(localStorage.getItem(CHAVE_USUARIOS) || '[]');
    const sessaoValida = Boolean(sessao?.email)
      && Array.isArray(usuarios)
      && usuarios.some((usuario) => usuario.email === sessao.email);

    if (!sessaoValida) {
      localStorage.removeItem(CHAVE_SESSAO);
      localStorage.removeItem(CHAVE_PERFIL);
      redirecionarParaLogin();
    }
  } catch {
    try {
      localStorage.removeItem(CHAVE_SESSAO);
      localStorage.removeItem(CHAVE_PERFIL);
    } catch {
      // O redirecionamento ainda impede o acesso quando o armazenamento falhar.
    }
    redirecionarParaLogin();
  }
})();
