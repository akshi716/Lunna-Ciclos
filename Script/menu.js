
(() => {
    const raiz = new URL("../", document.currentScript.src);

    const itens = [
        {texto:"Início", caminho:"index.html", icone:"house"},
        {texto:"Calendário", caminho:"calendario.html", icone:"calendar"},
        {texto:"Dispositivo", caminho:"dispositivo.html", icone:"smartphone"},
        {texto:"Perfil", caminho:"perfil.html", icone:"user"},
        {texto:"Login", caminho:"login.html", icone:"log-in"},
        {texto:"Chat Lunna", caminho:"chatIA.html", icone:"message-circle"},

    ];
    function enderecoPagina (caminho) {
        return new URL(`pages/${caminho}`, raiz).href;
    }

    function criarMenu (){
        const menu = document.createElement("aside");
        menu.id = "menuLunna";

        menu.innerHTML = `
            <a class = "lunna-marca"
           href="${enderecoPagina("index.html")}"
               aria-label="Lunna — ir para o início">
                <img
                    src="${new URL("../img/logo.svg", raiz).href}"
                    alt="Lunna"
                    width="144"
                    height="44"
                >
            </a>

            <nav class="lunna-links" aria-label="Navegação principal">
                ${itens.map(item => `
                    <a class="lunna-link"
                       href="${enderecoPagina(item.caminho)}">
                        <i class="lunna-icone" data-lucide="${item.icone}" aria-hidden="true"></i>
                        <span>${item.texto}</span>
                    </a>
                `).join("")}
            </nav>
        `;

        document.body.prepend(menu);
        document.body.classList.add("com-menu");

        return menu;
    }

    function atualizarLinkAtivo(menu) {
        const links = [...menu.querySelectorAll(".lunna-link")];

        // Primeiro procura um link para a seção atual.
        const linkDaSecao = links.find(link => {
            const destino = new URL(link.href);

            return destino.pathname === location.pathname
                && destino.hash !== ""
                && destino.hash === location.hash;
        });

        // Sem uma seção correspondente, destaca o link da página.
        const linkDaPagina = links.find(link => {
            const destino = new URL(link.href);

            return destino.pathname === location.pathname
                && destino.hash === "";
        });

        const linkAtivo = linkDaSecao || linkDaPagina;

        links.forEach(link => {
            link.removeAttribute("aria-current");

            if (link === linkAtivo) {
                link.setAttribute(
                    "aria-current",
                    linkDaSecao ? "location" : "page"
                );
            }
        });
    }

    function iniciarMenu() {
        if (document.getElementById("menuLunna")) return;

        const menu = criarMenu();
        window.lucide?.createIcons();

        atualizarLinkAtivo(menu);

        window.addEventListener("hashchange", () => {
            atualizarLinkAtivo(menu);
        });
    }

    iniciarMenu();
})();
