(() => {
    const campo = document.getElementById("registroEmocionalInicio");
    const enviar = document.getElementById("enviarRegistroInicio");
    const status = document.getElementById("statusRegistroInicio");
    const botoes = document.querySelectorAll(".emocional .humor");
    const chave = "lunna.registrosEmocionais";
    let humor = "";

    function dataHoje() {
        const hoje = new Date();
        return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
    }

    function lerRegistros() {
        const dados = JSON.parse(localStorage.getItem(chave) || "{}");
        if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
            throw new Error("Registros inválidos");
        }
        return dados;
    }

    function selecionar(valor) {
        humor = valor;
        botoes.forEach((botao) => {
            const ativo = botao.dataset.humor === humor;
            botao.classList.toggle("selecionado", ativo);
            botao.setAttribute("aria-pressed", String(ativo));
        });
    }

    botoes.forEach((botao) => {
        botao.addEventListener("click", () => {
            selecionar(botao.dataset.humor);
            status.textContent = "";
        });
    });
    campo.addEventListener("input", () => { status.textContent = ""; });

    selecionar("");
    campo.value = "";

    enviar.addEventListener("click", () => {
        if (!humor) {
            status.textContent = "Selecione como você está se sentindo antes de enviar.";
            botoes[0]?.focus();
            return;
        }
        try {
            const registros = lerRegistros();
            registros[dataHoje()] = { humor, observacao: campo.value.trim() };
            localStorage.setItem(chave, JSON.stringify(registros));
            campo.value = "";
            selecionar("");
            status.textContent = "Registro de hoje salvo com sucesso!";
        } catch {
            status.textContent = "Não foi possível salvar. Tente novamente neste navegador.";
        }
    });
})();

const map = L.map("map").setView([-15.7942, -47.8822], 13);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: '&copy; OpenStreetMap contributors'
    }
).addTo(map);

const marcadoresFarmacias = L.layerGroup().addTo(map);
const statusFarmacias = document.getElementById("statusFarmacias");
const redesPopulares = /drogasil|droga raia|pague menos|drogaria são paulo|drogaria sp|panvel|nissei|farmácias são joão|drogaria araújo|drogaria pacheco|drogaria venancio/i;
const CHAVE_CACHE_FARMACIAS = "lunna.cacheFarmacias";
const DURACAO_CACHE_FARMACIAS = 10 * 60 * 1000;
let buscaFarmacias;
let esperaBuscaFarmacias;
let identificadorBusca = 0;

function textoSeguro(texto) {
    return String(texto || "Farmácia").replace(/[&<>'"]/g, (caractere) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;"
    })[caractere]);
}

function coordenadasDoLocal(local) {
    const latitude = local.lat ?? local.center?.lat;
    const longitude = local.lon ?? local.center?.lon;
    return Number.isFinite(latitude) && Number.isFinite(longitude) ? [latitude, longitude] : null;
}

function chaveDaAreaAtual() {
    const limites = map.getBounds();
    return [
        map.getZoom().toFixed(1),
        limites.getSouth().toFixed(2),
        limites.getWest().toFixed(2),
        limites.getNorth().toFixed(2),
        limites.getEast().toFixed(2)
    ].join("|");
}

function lerCacheFarmacias() {
    try {
        const cache = JSON.parse(sessionStorage.getItem(CHAVE_CACHE_FARMACIAS) || "{}");
        return cache && typeof cache === "object" && !Array.isArray(cache) ? cache : {};
    } catch {
        return {};
    }
}

function salvarNoCache(chave, locais) {
    try {
        const agora = Date.now();
        const cache = lerCacheFarmacias();
        Object.keys(cache).forEach((item) => {
            if (agora - cache[item].criadoEm > DURACAO_CACHE_FARMACIAS) delete cache[item];
        });
        cache[chave] = { criadoEm: agora, locais };
        sessionStorage.setItem(CHAVE_CACHE_FARMACIAS, JSON.stringify(cache));
    } catch {
        // O mapa continua funcionando mesmo se o navegador bloquear o cache.
    }
}

function desenharFarmacias(locais) {
    marcadoresFarmacias.clearLayers();
    const icone = L.divIcon({
        className: "marcador-farmacia-popular",
        html: "<span>✚</span>",
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -32]
    });

    locais.forEach((local) => {
        L.marker([local.latitude, local.longitude], { icon: icone, title: local.nome })
            .bindPopup(`<strong>${textoSeguro(local.nome)}</strong>${local.endereco ? `<br>${textoSeguro(local.endereco)}` : ""}`)
            .addTo(marcadoresFarmacias);
    });
}

async function carregarFarmaciasPopulares() {
    const buscaAtual = ++identificadorBusca;
    buscaFarmacias?.abort();
    const chaveArea = chaveDaAreaAtual();
    const cache = lerCacheFarmacias()[chaveArea];

    if (cache && Date.now() - cache.criadoEm < DURACAO_CACHE_FARMACIAS && cache.locais?.length) {
        desenharFarmacias(cache.locais);
        statusFarmacias.textContent = `${cache.locais.length} rede${cache.locais.length > 1 ? "s" : ""} popular${cache.locais.length > 1 ? "es" : ""} carregada${cache.locais.length > 1 ? "s" : ""} do cache.`;
        return;
    }

    buscaFarmacias = new AbortController();

    const limites = map.getBounds();
    const caixa = [
        limites.getSouth().toFixed(5),
        limites.getWest().toFixed(5),
        limites.getNorth().toFixed(5),
        limites.getEast().toFixed(5)
    ].join(",");
    const consulta = `[out:json][timeout:20];nwr["amenity"="pharmacy"](${caixa});out center tags;`;

    statusFarmacias.textContent = "Buscando redes populares nesta área...";
    try {
        const resposta = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: consulta,
            signal: buscaFarmacias.signal
        });
        if (!resposta.ok) throw new Error("Não foi possível consultar o mapa.");

        const dados = await resposta.json();
        if (buscaAtual !== identificadorBusca) return;

        const locais = (dados.elements || []).filter((local) => redesPopulares.test(`${local.tags?.brand || ""} ${local.tags?.name || ""}`)).map((local) => {
            const coordenadas = coordenadasDoLocal(local);
            if (!coordenadas) return null;
            return {
                latitude: coordenadas[0],
                longitude: coordenadas[1],
                nome: local.tags?.name || local.tags?.brand || "Farmácia",
                endereco: [local.tags?.["addr:street"], local.tags?.["addr:housenumber"]].filter(Boolean).join(", ")
            };
        }).filter(Boolean);

        if (!locais.length) {
            statusFarmacias.textContent = "Nenhuma rede popular encontrada nesta área. Os destaques anteriores foram mantidos.";
            return;
        }

        desenharFarmacias(locais);
        salvarNoCache(chaveArea, locais);
        statusFarmacias.textContent = `${locais.length} rede${locais.length > 1 ? "s" : ""} popular${locais.length > 1 ? "es" : ""} destacada${locais.length > 1 ? "s" : ""} nesta área.`;
    } catch (erro) {
        if (erro.name !== "AbortError" && buscaAtual === identificadorBusca) {
            statusFarmacias.textContent = "Não foi possível carregar as farmácias agora. Os destaques anteriores foram mantidos.";
        }
    }
}

function agendarBuscaFarmacias() {
    clearTimeout(esperaBuscaFarmacias);
    esperaBuscaFarmacias = setTimeout(carregarFarmaciasPopulares, 450);
}

map.on("moveend", agendarBuscaFarmacias);
carregarFarmaciasPopulares();
