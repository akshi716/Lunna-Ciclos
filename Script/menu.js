(() => {
    // Resolve os caminhos a partir deste arquivo, inclusive em subpastas e file://.
    const raiz = new URL('../', document.currentScript.src);
    const pagina = nome => new URL(`pages/${nome}`, raiz).href;
    const icones = {
        inicio: '<path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9"/>',
        calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-14 4h2m3 0h2m3 0h1m-11 3h2m3 0h2"/>',
        registros: '<path d="M5 3h9l5 5v13H5zM14 3v5h5M8 12h8M8 16h8"/>',
        dispositivo: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/>',
        perfil: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
        chat: '<path d="M21 11a9 9 0 0 1-9 9H3l2-5a9 9 0 1 1 16-4Z"/><path d="M8 10h8m-8 4h5"/>',
        login: '<path d="M14 3h6v18h-6M3 12h12m-4-4 4 4-4 4"/>'
    };
    const itens = [
        ['Início', 'index.html', 'inicio'],
        ['Calendário', 'calendario.html', 'calendario'],
        ['Registros', 'perfil.html#tituloExames', 'registros'],
        ['Dispositivo', 'dispositivo.html', 'dispositivo'],
        ['Meu perfil', 'perfil.html', 'perfil'],
        ['Chat Lunna', 'chatIA.html', 'chat'],
        ['Login', 'login.html', 'login']
    ];
    if (document.getElementById('menuLunna')) return;

    const lateral = document.createElement('aside');
    lateral.id = 'menuLunna';
    lateral.className = 'sidebar';
    const marca = document.createElement('a');
    marca.className = 'sidebar-logo';
    marca.href = pagina('index.html');
    marca.setAttribute('aria-label', 'Lunna — ir para o início');
    const logo = document.createElement('img');
    logo.src = new URL('img/logo.svg', raiz).href;
    logo.alt = 'Lunna';
    logo.width = 144;
    logo.height = 44;
    marca.append(logo);
    lateral.append(marca);

    const nav = document.createElement('nav');
    nav.className = 'menu';
    nav.setAttribute('aria-label', 'Navegação principal');
    for (const [titulo, destino, icone] of itens) {
        const link = document.createElement('a');
        link.className = 'menu-item';
        link.href = pagina(destino);
        link.title = titulo;
        link.setAttribute('aria-label', titulo);
        link.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icones[icone]}</svg>`;
        const texto = document.createElement('span');
        texto.textContent = titulo;
        link.append(texto);
        nav.append(link);
    }
    lateral.append(nav);
    document.body.prepend(lateral);
    document.body.classList.add('com-menu');

    const atualizarPaginaAtiva = () => {
        const caminho = location.pathname;
        const naSecaoExames = caminho.endsWith('/perfil.html') && location.hash === '#tituloExames';
        for (const link of nav.querySelectorAll('a')) {
            const destino = new URL(link.href);
            const ativo = destino.pathname === caminho && (naSecaoExames ? destino.hash === '#tituloExames' : !destino.hash);
            link.classList.toggle('active', ativo);
            if (ativo) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        }
    };
    atualizarPaginaAtiva();
    window.addEventListener('hashchange', atualizarPaginaAtiva);
})();
