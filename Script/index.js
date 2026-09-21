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
