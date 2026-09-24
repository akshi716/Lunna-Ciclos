(() => {
    const campo = document.getElementById("registroEmocionalInicio") || document.getElementById("registroEmocional");
    const enviar = document.getElementById("enviarRegistroInicio") || document.getElementById("salvarRegistro");
    const status = document.getElementById("statusRegistroInicio") || document.getElementById("statusRegistro");
    const botoes = document.querySelectorAll(".emocional .humor");
    if (!campo || !enviar || !status) return;
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
    try {
        const salvo = lerRegistros()[dataHoje()];
        if (salvo && [...botoes].some((botao) => botao.dataset.humor === salvo.humor)) {
            selecionar(salvo.humor);
            campo.value = typeof salvo.observacao === "string" ? salvo.observacao : "";
        }
    } catch {
        status.textContent = "Não foi possível carregar o registro salvo neste navegador.";
    }

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
