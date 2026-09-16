

const form = document.querySelector('#login-form');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const message = document.querySelector('#message');
const togglePassword = document.querySelector('#toggle-password');


function showMessage(text, success = false) {
  message.textContent = text;
  message.style.color = success ? '#6844b5' : '#b54661';
}


if (togglePassword) {
  togglePassword.addEventListener('click', () => {
    const isVisible = password.type === 'text';
    password.type = isVisible ? 'password' : 'text';
    Password.textContent = isVisible ? 'Mostrar' : 'Ocultar';
    togglePassword.setAttribute(
      'aria-label',
      isVisible ? 'Mostrar senha' : 'Ocultar senha'
    );
  });
}


if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();


    if (!email.validity.valid) {
      showMessage('Digite um e-mail válido para continuar.');
      email.focus();
      return;
    }


    if (!password.validity.valid) {
      showMessage('A senha precisa ter pelo menos 6 caracteres.');
      password.focus();
      return;
    }


    const formData = {
      email: email.value.trim(),
      password: password.value,
      remember: form.elements.remember?.checked ?? false,
    };


    // Conecte aqui ao endpoint real de autenticação.
    console.log('Dados de login prontos para envio:', {
      ...formData,
      password: '[oculta]',
    });


    showMessage('Login pronto para ser conectado ao seu backend.', true);
  });
}


document.querySelector('#forgot-link')?.addEventListener('click', (event) => {
  event.preventDefault();
  showMessage('Fluxo de recuperação de senha selecionado.', true);
});


document.querySelector('#create-link')?.addEventListener('click', (event) => {
  event.preventDefault();
  showMessage('Fluxo de criação de conta selecionado.', true);
});


