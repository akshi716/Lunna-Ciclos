// ELEMENTOS DO HTML
const btnChat = document.querySelector("#btnChat");




const chatbot = document.querySelector(".chatbot");




const btnFechar = document.querySelector("#btnFechar");




const btnMensagem = document.querySelector("#btnMensagem");




const btnEnviar = document.querySelector("#btnEnviar");




const mensagens = document.querySelector(".chatbot-mensagens");




// ABRIR CHAT




btnChat.addEventListener("click", function () {




    chatbot.classList.add("aberto");




    btnMensagem.focus();




});




// FECHAR CHAT




btnFechar.addEventListener("click", function () {




    chatbot.classList.remove("aberto");




});




// ENVIAR PELO BOTÃO




btnEnviar.addEventListener("click", enviarMensagem);




// ENVIAR COM ENTER




btnMensagem.addEventListener("keydown", function (event) {




    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {




        event.preventDefault();




        enviarMensagem();




    }




});




// FUNÇÃO PRINCIPAL




function enviarMensagem() {




    const texto = btnMensagem.value.trim();








    // Impede mensagem vazia




    if (texto === "") {




        return;




    }








    // Mostra mensagem do usuário




    adicionarMensagemUsuario(texto);








    // Limpa o campo




    btnMensagem.value = "";
    ajustarCampoMensagem();








    // Pequeno atraso para parecer que a Lunna está "pensando"




    setTimeout(function () {




        const resposta = gerarResposta(texto);




        adicionarMensagemLunna(resposta);




    }, 700);




}




// "CÉREBRO" DA LUNNA




function gerarResposta(texto) {




    const mensagem = texto.toLowerCase();








    // SAUDAÇÕES




    if (
        mensagem.includes("oi") ||
        mensagem.includes("olá") ||
        mensagem.includes("ola") ||
        mensagem.includes("bom dia") ||
        mensagem.includes("boa tarde") ||
        mensagem.includes("boa noite")
    ) {




        return "Olá! Que bom conversar com você. Como você está se sentindo hoje?";




    }








    // PERGUNTA SOBRE A LUNNA




    if (
        mensagem.includes("quem é você") ||
        mensagem.includes("quem e você") ||
        mensagem.includes("quem é a lunna") ||
        mensagem.includes("quem e a lunna")
    ) {




        return "Eu sou a Lunna 🌙, uma assistente virtual criada para conversar sobre bem-estar, rotina e autocuidado.";




    }








    // PERGUNTA SOBRE COMO ELA PODE AJUDAR




    if (
        mensagem.includes("o que você faz") ||
        mensagem.includes("o que voce faz") ||
        mensagem.includes("como você pode ajudar") ||
        mensagem.includes("como voce pode ajudar") ||
        mensagem.includes("pode me ajudar")
    ) {




        return "Posso conversar com você sobre bem-estar, sentimentos, rotina, descanso e autocuidado.  Se quiser, podemos conversar sobre como você está se sentindo hoje.";




    }








    // TRISTEZA




    if (
        mensagem.includes("triste") ||
        mensagem.includes("tristeza") ||
        mensagem.includes("chorando")
    ) {




        return "Sinto muito que você esteja se sentindo assim. Se quiser, pode me contar um pouco mais sobre o que aconteceu.";





    }








    // ANSIEDADE




    if (
        mensagem.includes("ansioso") ||
        mensagem.includes("ansiosa") ||
        mensagem.includes("ansiedade") ||
        mensagem.includes("nervoso") ||
        mensagem.includes("nervosa")
    ) {




        return "Entendo.  Talvez seja útil fazer uma pequena pausa, respirar com calma e perceber como você está se sentindo neste momento.";




    }








    // CANSAÇO




    if (
        mensagem.includes("cansado") ||
        mensagem.includes("cansada") ||
        mensagem.includes("exausto") ||
        mensagem.includes("exausta")
    ) {




        return "Parece que você está precisando de um pouco de descanso. 🌙 Se puder, faça uma pausa e cuide um pouco de você.";




    }








    // FELICIDADE




    if (
        mensagem.includes("feliz") ||
        mensagem.includes("felicidade") ||
        mensagem.includes("bem") ||
        mensagem.includes("ótimo") ||
        mensagem.includes("otimo")
    ) {




        return "Que bom saber disso!  É muito bom perceber e valorizar os momentos em que estamos nos sentindo bem.";




    }








    // SONO




    if (
        mensagem.includes("sono") ||
        mensagem.includes("dormir") ||
        mensagem.includes("insônia") ||
        mensagem.includes("insonia")
    ) {




        return "Uma rotina tranquila antes de dormir pode ajudar. 🌙 Tente diminuir estímulos e reservar alguns minutos para desacelerar.";




    }








    // AGRADECIMENTO




    if (
        mensagem.includes("obrigado") ||
        mensagem.includes("obrigada") ||
        mensagem.includes("valeu")
    ) {




        return "Por nada!  Estou aqui para conversar com você.";




    }








    // DESPEDIDA




    if (
        mensagem.includes("tchau") ||
        mensagem.includes("até mais") ||
        mensagem.includes("ate mais") ||
        mensagem.includes("até logo") ||
        mensagem.includes("ate logo")
    ) {




        return "Até mais! 🌙 Cuide-se e tenha um ótimo momento.";




    }








    // RESPOSTA PADRÃO




    return "Ainda estou aprendendo a conversar sobre isso.  Você pode tentar explicar um pouco mais o que está pensando ou sentindo?";




}




// ADICIONAR MENSAGEM DO USUÁRIO




function adicionarMensagemUsuario(texto) {




    const novaMensagem = document.createElement("div");




    novaMensagem.classList.add(
        "mensagem",
        "mensagem-usuario"
    );








    const conteudo = document.createElement("div");




    conteudo.classList.add(
        "mensagem-conteudo"
    );








    const paragrafo = document.createElement("p");




    paragrafo.textContent = texto;








    conteudo.appendChild(paragrafo);




    novaMensagem.appendChild(conteudo);




    mensagens.appendChild(novaMensagem);








    // Rola para a mensagem mais recente




    mensagens.scrollTop = mensagens.scrollHeight;




}




// ADICIONAR MENSAGEM DA LUNNA




function adicionarMensagemLunna(texto) {




    const novaMensagem = document.createElement("div");




    novaMensagem.classList.add(
        "mensagem",
        "mensagem-lunna"
    );








    const icone = document.createElement("div");




    icone.classList.add(
        "mensagem-icone"
    );




    icone.textContent = "🌙";








    const conteudo = document.createElement("div");




    conteudo.classList.add(
        "mensagem-conteudo"
    );








    const paragrafo = document.createElement("p");




    paragrafo.textContent = texto;








    conteudo.appendChild(paragrafo);




    novaMensagem.appendChild(icone);




    novaMensagem.appendChild(conteudo);




    mensagens.appendChild(novaMensagem);








    // Rola para a mensagem mais recente




    mensagens.scrollTop = mensagens.scrollHeight;




}

// A área visível encolhe quando o teclado virtual é aberto.
function ajustarAlturaChat() {
    const viewport = window.visualViewport;
    if (!viewport || viewport.scale !== 1) return;
    document.documentElement.style.setProperty("--chat-viewport-height", viewport.height + "px");
}
window.visualViewport?.addEventListener("resize", ajustarAlturaChat);
window.addEventListener("resize", ajustarAlturaChat);
ajustarAlturaChat();

function ajustarCampoMensagem() {
    btnMensagem.style.height = "auto";
    btnMensagem.style.height = Math.min(btnMensagem.scrollHeight, parseFloat(getComputedStyle(btnMensagem).maxHeight)) + "px";
}
btnMensagem.addEventListener("input", ajustarCampoMensagem);
