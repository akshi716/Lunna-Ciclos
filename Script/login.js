const form = document.querySelector('#login-form');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const message = document.querySelector('#message');

const CHAVE_USUARIOS = 'lunna.usuarios';
const CHAVE_SESSAO = 'lunna.sessao';
const PAGINA_INICIO = 'index.html';

function mostrarMensagem(texto, sucesso = false) {
  message.textContent = texto;
  message.style.color = sucesso ? '#48743f' : '#b54661';
}

function lerUsuarios() {
  try {
    const usuarios = JSON.parse(localStorage.getItem(CHAVE_USUARIOS) || '[]');
    return Array.isArray(usuarios) ? usuarios : [];
  } catch {
    return [];
  }
}

function salvarSessao(usuario, lembrar) {
  const perfil = usuario.perfil && typeof usuario.perfil === 'object'
    ? usuario.perfil
    : { nome: '', idade: '', peso: '', altura: '', email: usuario.email };

  try {
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify({ email: usuario.email, lembrar: Boolean(lembrar) }));
    localStorage.setItem('lunna.perfil', JSON.stringify(perfil));
    return true;
  } catch {
    return false;
  }
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!email.validity.valid || !password.validity.valid) {
    mostrarMensagem('Preencha um e-mail válido e uma senha de ao menos 6 caracteres.');
    return;
  }

  const usuario = lerUsuarios().find((item) => item.email === email.value.trim().toLowerCase());
  if (!usuario || usuario.senha !== password.value) {
    mostrarMensagem('E-mail ou senha incorretos.');
    password.focus();
    return;
  }

  if (!salvarSessao(usuario, form.elements.remember?.checked)) {
    mostrarMensagem('Não foi possível iniciar a sessão neste navegador.');
    return;
  }
  mostrarMensagem('Login realizado. Redirecionando para o início...', true);
  window.setTimeout(() => { window.location.href = PAGINA_INICIO; }, 450);
});

document.querySelector('#forgot-link')?.addEventListener('click', (event) => {
  event.preventDefault();
  mostrarMensagem('Para esta versão local, crie uma nova conta para definir outra senha.');
});

try {
  const sessao = JSON.parse(localStorage.getItem(CHAVE_SESSAO) || 'null');
  if (sessao?.email && lerUsuarios().some((usuario) => usuario.email === sessao.email)) {
    window.location.replace(PAGINA_INICIO);
  }
} catch {
  localStorage.removeItem(CHAVE_SESSAO);
}
