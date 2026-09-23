const botaoEditar = document.getElementById('editarPerfil');
const modalPerfil = document.getElementById('modalPerfil');
const botaoCancelar = document.getElementById('cancelarEdicao');
const formPerfil = document.getElementById('formPerfil');
const campoNome = document.getElementById('nomePerfil');
const campoIdade = document.getElementById('idadePerfil');
const campoPeso = document.getElementById('pesoPerfil');
const campoAltura = document.getElementById('alturaPerfil');

const CHAVE_USUARIOS = 'lunna.usuarios';
const CHAVE_SESSAO = 'lunna.sessao';
const CHAVE_PERFIL = 'lunna.perfil';

function lerJson(chave, padrao) {
  try { return JSON.parse(localStorage.getItem(chave) || JSON.stringify(padrao)); }
  catch { return padrao; }
}

function formatarNome(nome) {
  return String(nome || '')
    .trim()
    .toLocaleLowerCase('pt-BR')
    .replace(/(^|[\s'-])(\p{L})/gu, (trecho, separador, letra) => `${separador}${letra.toLocaleUpperCase('pt-BR')}`);
}

const sessao = lerJson(CHAVE_SESSAO, null);
let usuarios = lerJson(CHAVE_USUARIOS, []);
let usuarioAtual = Array.isArray(usuarios) ? usuarios.find((usuario) => usuario.email === sessao?.email) : null;

if (!usuarioAtual) {
  window.location.replace('login.html');
} else {
  usuarioAtual.perfil = usuarioAtual.perfil || { nome: '', idade: '', peso: '', altura: '', email: usuarioAtual.email };
  let perfil = { ...usuarioAtual.perfil, nome: formatarNome(usuarioAtual.perfil.nome), email: usuarioAtual.email };

  function atualizarDado(id, valor) {
    const elemento = document.getElementById(id);
    elemento.textContent = valor || '-';
    elemento.toggleAttribute('aria-label', !valor);
    if (!valor) elemento.setAttribute('aria-label', 'Não informado');
  }

  function atualizarTela() {
    document.getElementById('userName').textContent = perfil.nome || 'Seu nome';

    // Formatação para o nome do usuario ficar destacado 
    const cumprimento = document.getElementById('cumprimentoUser');

    if (perfil.nome) {
      const nome = document.createElement('strong');
      nome.textContent = perfil.nome;

      cumprimento.replaceChildren('Olá, ', nome, '!');
    } else {
      cumprimento.textContent = 'Bem-vinda ao seu espaço';
    }

    document.getElementById('userEmail').textContent = perfil.email;
    atualizarDado('idadeUsuario', perfil.idade);
    atualizarDado('pesoUsuario', perfil.peso);
    atualizarDado('alturaUsuario', perfil.altura);

    const peso = Number(perfil.peso);
    const altura = Number(String(perfil.altura).replace(',', '.'));
    const imc = Number.isFinite(peso) && Number.isFinite(altura) && peso > 0 && altura > 0
      ? (peso / (altura * altura)).toFixed(1).replace('.', ',') : '';
    atualizarDado('imcUsuario', imc);
  }

  botaoEditar?.addEventListener('click', () => {
    campoNome.value = perfil.nome || '';
    campoIdade.value = perfil.idade || '';
    campoPeso.value = perfil.peso || '';
    campoAltura.value = perfil.altura || '';
    modalPerfil.showModal();
  });

  botaoCancelar?.addEventListener('click', () => modalPerfil.close());

  campoNome?.addEventListener('blur', () => {
    campoNome.value = formatarNome(campoNome.value);
  });

  formPerfil?.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const nome = formatarNome(campoNome.value);
    if (!nome) { campoNome.focus(); return; }

    perfil = {
      ...perfil,
      nome,
      idade: campoIdade.value,
      peso: campoPeso.value,
      altura: campoAltura.value
    };
    usuarioAtual.perfil = perfil;
    usuarios = usuarios.map((usuario) => usuario.email === usuarioAtual.email ? usuarioAtual : usuario);

    try {
      localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
      localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));
    } catch {
      alert('Não foi possível salvar seus dados neste navegador.');
      return;
    }
    atualizarTela();
    modalPerfil.close();
  });

  document.getElementById('sairConta')?.addEventListener('click', () => {
    localStorage.removeItem(CHAVE_SESSAO);
    localStorage.removeItem(CHAVE_PERFIL);
    window.location.replace('login.html');
  });

  atualizarTela();
}
