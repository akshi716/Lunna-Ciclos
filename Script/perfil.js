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


botaoEditar.addEventListener("click", () => {
    modalPerfil.showModal();
});

botaoCancelar.addEventListener("click", () => {
    modalPerfil.close();
});

formPerfil.addEventListener("submit", (evento) => {
    evento.preventDefault();
})

