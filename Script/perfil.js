const botaoEditar = document.getElementById("editarPerfil");
const modalPerfil = document.getElementById("modalPerfil");
const botaoCancelar = document.getElementById("cancelarEdicao");
const formPerfil = document.getElementById("formPerfil");

const campoNome = document.getElementById("nomePerfil");
const campoIdade = document.getElementById("idadePerfil");
const campoPeso = document.getElementById("pesoPerfil");
const campoAltura = document.getElementById("alturaPerfil");

const chave_perfil = "lunna.perfil";

let perfil = {
    nome : "",
    idade : "",
    peso: "",
    altura: ""

}

function carregarPerfil() {
    try{
        const dadosSalvos = localStorage.getItem(chave_perfil);
        
        if(dadosSalvos) {
            const dados = JSON.parse(dadosSalvos);

            if(dados && typeof dados === "object" && !Array.isArray(dados)) {
                for (const campo of ["nome", "idade", "peso", "altura"]) {
                    if (typeof dados [campo] === "string") {
                        perfil [campo] = dados [campo];
                    }

                }
            }
        }
    }
catch (erro) {
    console.error("Não foi possível carregar o perfil: ", erro);
}
}
 
function atualizarDado(id, valor) {
    const elemento = document.getElementById(id);

    elemento.textContent = valor || "-";

    if (valor) {
        elemento.removeAttribute("aria-label");
    }   else {
        elemento.setAttribute("aria-label", "Não informado");
    }
}

function atualizarTela() {
    document.getElementById("userName").textContent = 
    perfil.nome || "Seu nome";

    document.getElementById("cumprimentoUser").textContent = 
    perfil.nome ? `Olá, ${perfil.nome}!` : "Bem-vinda ao seu espaço";

    atualizarDado("idadeUsuario", perfil.idade);
    atualizarDado("pesoUsuario", perfil.peso);
    atualizarDado("alturaUsuario", perfil.altura);

    const peso = Number(perfil.peso);
    const altura = Number(perfil.altura);

    const imc = 
    Number.isFinite(peso) &&
    Number.isFinite(altura) &&
    peso > 0 &&
    altura > 0
     ? (peso / (altura * altura)).toFixed(1).replace(".", ",")
     :"";
     atualizarDado("imcUsuario", imc);
}
    
campoNome.addEventListener("input", () => {
    campoNome.setCustomValidity("");
})


botaoEditar.addEventListener("click", () => {
    campoNome.setCustomValidity(""); 

    campoNome.value = perfil.nome;
    campoIdade.value = perfil.idade;
    campoPeso.value = perfil.peso;
    campoAltura.value = perfil.altura

    modalPerfil.showModal();
});

botaoCancelar.addEventListener("click", () => {
    modalPerfil.close();
});

formPerfil.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = campoNome.value.trim();

    campoNome.setCustomValidity(nome ? "" : "Digite o seu nome.");
    if(!formPerfil.reportValidity()){
        return;
    }

    const novoPerfil = {
        nome,
        idade: campoIdade.value,
        peso: campoPeso.value,
        altura: campoAltura.value,
        };

        try{
            localStorage.setItem(chave_perfil, JSON.stringify(novoPerfil));
        } catch (erro){
            console.error("Não foi possivel salvar o perfil:", erro);
            alert("Não foi possivel salvar seus dados nesse navegador. Tente novamente.");
            return;
        }

        perfil = novoPerfil;
        atualizarTela();
        modalPerfil.close();
});

carregarPerfil();
atualizarTela();
