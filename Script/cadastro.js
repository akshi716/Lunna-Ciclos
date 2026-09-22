const formCadastro = document.querySelector('#cadastro-form');
const mensagemCadastro = document.querySelector('#message');
const CHAVE_USUARIOS_CADASTRO = 'lunna.usuarios';
const CHAVE_SESSAO_CADASTRO = 'lunna.sessao';
const PAGINA_INICIO_CADASTRO = 'index.html';

function mostrarMensagemCadastro(texto, sucesso = false) {
  mensagemCadastro.textContent = texto;
  mensagemCadastro.style.color = sucesso ? '#48743f' : '#b54661';
}

function obterUsuarios() {
  try {
    const usuarios = JSON.parse(localStorage.getItem(CHAVE_USUARIOS_CADASTRO) || '[]');
    return Array.isArray(usuarios) ? usuarios : [];
  } catch {
    return [];
  }
}

formCadastro?.addEventListener('submit', (event) => {
  event.preventDefault();
  const dados = new FormData(formCadastro);
  const nome = String(dados.get('nome') || '').trim();
  const email = String(dados.get('email') || '').trim().toLowerCase();
  const senha = String(dados.get('senha') || '');
  const confirmarSenha = String(dados.get('confirmarSenha') || '');

  if (!formCadastro.checkValidity() || !nome || !email || senha.length < 6) {
    mostrarMensagemCadastro('Preencha seu nome, e-mail e uma senha de ao menos 6 caracteres.');
    return;
  }
  if (senha !== confirmarSenha) {
    mostrarMensagemCadastro('As senhas precisam ser iguais.');
    return;
  }

  const usuarios = obterUsuarios();
  if (usuarios.some((usuario) => usuario.email === email)) {
    mostrarMensagemCadastro('Já existe uma conta cadastrada com este e-mail.');
    return;
  }

  const usuario = { email, senha, perfil: { nome, idade: '', peso: '', altura: '', email } };
  usuarios.push(usuario);

  try {
    localStorage.setItem(CHAVE_USUARIOS_CADASTRO, JSON.stringify(usuarios));
    localStorage.setItem(CHAVE_SESSAO_CADASTRO, JSON.stringify({ email, lembrar: true }));
    localStorage.setItem('lunna.perfil', JSON.stringify(usuario.perfil));
  } catch {
    mostrarMensagemCadastro('Não foi possível salvar seus dados neste navegador.');
    return;
  }

  mostrarMensagemCadastro('Conta criada! Redirecionando para o início...', true);
  window.setTimeout(() => { window.location.href = PAGINA_INICIO_CADASTRO; }, 450);
});
