// ======================================================
// ELEMENTOS DO CALENDÁRIO
// ======================================================

// Pega o elemento que mostra o mês
const monthElement = document.getElementById("month");

// Pega o elemento que mostra o ano
const yearElement = document.getElementById("year");

// Pega a área onde os dias serão criados
const calendarElement = document.getElementById("calendar");

// Pega o botão de mês anterior
const previousMonthButton =
    document.getElementById("previousMonth");

// Pega o botão de próximo mês
const nextMonthButton =
    document.getElementById("nextMonth");


// ======================================================
// ELEMENTOS DO REGISTRO DO CICLO
// ======================================================

// Pega o campo da última menstruação
const campoUltimaMenstruacao =
    document.getElementById("ultimaMenstruacao");

// Pega o campo da duração do ciclo
const campoTamanhoCiclo =
    document.getElementById("tamanhoCiclo");

// Pega o botão de salvar
const salvarCiclo =
    document.getElementById("salvarCiclo");


// ======================================================
// ELEMENTOS DA FASE ATUAL
// ======================================================

// Pega o card que mostra a fase atual
const faseAtualElement =
    document.getElementById("faseAtual");

// Pega o título da fase
const tituloFaseAtual =
    document.getElementById("tituloFaseAtual");

// Pega o elemento que mostra o dia do ciclo
const numeroDiaCiclo =
    document.getElementById("numeroDiaCiclo");


// ======================================================
// CONFIGURAÇÕES
// ======================================================

// Guarda o mês que estamos visualizando
let currentDate = new Date();
currentDate.setDate(1);


// Lista com os nomes dos meses
const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];


// ======================================================
// FUNÇÃO PARA CALCULAR DIFERENÇA ENTRE DATAS
// ======================================================

function calcularDiferencaEmDias(dataInicial, dataFinal) {

    // Cria uma cópia da data inicial
    const inicio = new Date(dataInicial);

    // Cria uma cópia da data final
    const fim = new Date(dataFinal);


    // Coloca as duas datas no início do dia
    inicio.setHours(0, 0, 0, 0);
    fim.setHours(0, 0, 0, 0);


    // Calcula a diferença em milissegundos
    const diferenca =
        fim.getTime() - inicio.getTime();


    // Quantidade de milissegundos existentes em um dia
    const milissegundosPorDia =
        1000 * 60 * 60 * 24;


    // Converte milissegundos para dias
    return Math.round(
        diferenca / milissegundosPorDia
    );
}


// ======================================================
// CALCULAR O DIA DO CICLO
// ======================================================

function calcularDiaDoCiclo(dataInicio, tamanhoCiclo) {

    // Pega a data de hoje
    const hoje = new Date();


    // Usa o mesmo cálculo cíclico dos dias exibidos no calendário.
    return calcularDiaDoCicloParaData(hoje, dataInicio, tamanhoCiclo);
}


// ======================================================
// DETERMINAR A FASE DO CICLO
// ======================================================

function determinarFase(diaDoCiclo, tamanhoCiclo) {

    // --------------------------------------------------
    // MENSTRUAÇÃO
    // --------------------------------------------------

    if (
        diaDoCiclo >= 1 &&
        diaDoCiclo <= 5
    ) {
        return "menstruacao";
    }


    // --------------------------------------------------
    // OVULAÇÃO ESTIMADA
    // --------------------------------------------------

    // Estimativa simplificada:
    // ovulação aproximadamente 14 dias antes
    // da próxima menstruação

    const diaOvulacao =
        tamanhoCiclo - 14;


    if (diaDoCiclo === diaOvulacao) {
        return "ovulacao";
    }


    // --------------------------------------------------
    // PERÍODO FÉRTIL
    // --------------------------------------------------

    const inicioPeriodoFertil =
        diaOvulacao - 5;

    const fimPeriodoFertil =
        diaOvulacao + 1;


    if (
        diaDoCiclo >= inicioPeriodoFertil &&
        diaDoCiclo <= fimPeriodoFertil
    ) {
        return "fertil";
    }


    // --------------------------------------------------
    // FASE FOLICULAR
    // --------------------------------------------------

    if (
        diaDoCiclo > 5 &&
        diaDoCiclo < inicioPeriodoFertil
    ) {
        return "folicular";
    }


    // --------------------------------------------------
    // FASE LÚTEA
    // --------------------------------------------------

    if (
        diaDoCiclo > fimPeriodoFertil &&
        diaDoCiclo <= tamanhoCiclo
    ) {
        return "lutea";
    }


    // Caso não se encaixe em nenhuma fase
    return "indefinida";
}


// ======================================================
// ATUALIZAR CARD DA FASE
// ======================================================

function atualizarTemaFase(fase) {

    // Verifica se o elemento existe
    if (!faseAtualElement) {
        return;
    }


    // Remove as classes antigas
    faseAtualElement.classList.remove(
        "menstruacao",
        "folicular",
        "ovulacao",
        "lutea",
        "fertil",
        "indefinida"
    );


    // Adiciona a classe correspondente à fase
    faseAtualElement.classList.add(fase);


    // --------------------------------------------------
    // MENSTRUAÇÃO
    // --------------------------------------------------

    if (fase === "menstruacao") {

        tituloFaseAtual.textContent =
            "Fase menstrual";

        return;
    }


    // --------------------------------------------------
    // FASE FOLICULAR
    // --------------------------------------------------

    if (fase === "folicular") {

        tituloFaseAtual.textContent =
            "Fase folicular";

        return;
    }


    // --------------------------------------------------
    // OVULAÇÃO
    // --------------------------------------------------

    if (fase === "ovulacao") {

        tituloFaseAtual.textContent =
            "Ovulação";

        return;
    }


    // --------------------------------------------------
    // FASE FÉRTIL
    // --------------------------------------------------

    if (fase === "fertil") {

        tituloFaseAtual.textContent =
            "Período fértil";

        return;
    }


    // --------------------------------------------------
    // FASE LÚTEA
    // --------------------------------------------------

    if (fase === "lutea") {

        tituloFaseAtual.textContent =
            "Fase lútea";

        return;
    }


    // --------------------------------------------------
    // INDEFINIDA
    // --------------------------------------------------

    tituloFaseAtual.textContent =
        "Fase não identificada";
}


// ======================================================
// VERIFICAR SE O USUÁRIO JÁ CADASTROU O CICLO
// ======================================================

const chaveCiclo = "lunna.ciclo";

function lerCicloSalvo() {
    try {
        const dados = JSON.parse(localStorage.getItem(chaveCiclo));
        return dados && typeof dados === "object" ? dados : {};
    } catch {
        return {};
    }
}

function obterDadosDoCiclo() {
    const salvo = lerCicloSalvo();

    // Pega a data informada no input
    const valorData =
        campoUltimaMenstruacao ? campoUltimaMenstruacao.value : salvo.data;


    // Pega a duração informada
    const valorTamanho =
        campoTamanhoCiclo ? campoTamanhoCiclo.value : salvo.tamanho;


    // Se não houver data, retorna null
    if (!valorData) {
        return null;
    }


    // Converte o tamanho do ciclo para número
    const tamanhoCiclo =
        Number(valorTamanho);


    // Verifica se o tamanho é válido
    if (
        !Number.isInteger(tamanhoCiclo) ||
        tamanhoCiclo < 20 ||
        tamanhoCiclo > 45
    ) {
        return null;
    }


    // Converte a data para objeto Date
    const dataInicio =
        new Date(valorData + "T00:00:00");

    if (
        Number.isNaN(dataInicio.getTime()) ||
        calcularDiferencaEmDias(dataInicio, new Date()) < 0
    ) {
        return null;
    }


    // Retorna os dados organizados
    return {
        dataInicio: dataInicio,
        tamanhoCiclo: tamanhoCiclo
    };
}


// ======================================================
// CALCULAR DIA DO CICLO PARA UMA DATA ESPECÍFICA
// ======================================================

function calcularDiaDoCicloParaData(
    data,
    dataInicio,
    tamanhoCiclo
) {

    // Calcula quantos dias existem entre as datas
    const diasDesdeInicio =
        calcularDiferencaEmDias(
            dataInicio,
            data
        );


    // Se a data for antes do início
    if (diasDesdeInicio < 0) {
        return null;
    }


    // Descobre em qual dia do ciclo estamos
    const diaDoCiclo =
        (diasDesdeInicio % tamanhoCiclo) + 1;


    return diaDoCiclo;
}


// ======================================================
// CRIAR O CALENDÁRIO
// ======================================================

function generateCalendar() {

    // Limpa os dias existentes
    calendarElement.innerHTML = "";


    // Pega o mês que está sendo visualizado
    const month =
        currentDate.getMonth();


    // Pega o ano que está sendo visualizado
    const year =
        currentDate.getFullYear();


    // Mostra o nome do mês
    monthElement.textContent =
        months[month];


    // Mostra o ano
    yearElement.textContent =
        year;


    // --------------------------------------------------
    // PRIMEIRO DIA DO MÊS
    // --------------------------------------------------

    const firstDay =
        new Date(year, month, 1);


    // --------------------------------------------------
    // QUANTIDADE DE DIAS DO MÊS
    // --------------------------------------------------

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    // --------------------------------------------------
    // DIA DA SEMANA
    // --------------------------------------------------

    let firstDayOfWeek =
        firstDay.getDay();


    // JavaScript:
    //
    // domingo = 0
    // segunda = 1
    // terça = 2
    // ...
    //
    // Como nosso calendário começa na segunda,
    // transformamos domingo em 7.

    if (firstDayOfWeek === 0) {
        firstDayOfWeek = 7;
    }


    // --------------------------------------------------
    // ESPAÇOS VAZIOS
    // --------------------------------------------------

    for (
        let i = 1;
        i < firstDayOfWeek;
        i++
    ) {

        // Cria uma div vazia
        const emptyDay =
            document.createElement("div");


        // Adiciona classes
        emptyDay.classList.add(
            "calendar-day",
            "empty"
        );


        // Coloca no calendário
        calendarElement.appendChild(
            emptyDay
        );
    }


    // --------------------------------------------------
    // DADOS DO CICLO
    // --------------------------------------------------

    const dadosCiclo =
        obterDadosDoCiclo();


    // --------------------------------------------------
    // CRIAR CADA DIA
    // --------------------------------------------------

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        // Cria o botão
        const dayElement =
            document.createElement("button");


        // Define o tipo
        dayElement.type = "button";


        // Adiciona a classe principal
        dayElement.classList.add(
            "calendar-day"
        );


        // Mostra o número do dia
        dayElement.textContent = day;


        // --------------------------------------------------
        // CRIA A DATA DESSE DIA
        // --------------------------------------------------

        const dataDoDia =
            new Date(
                year,
                month,
                day
            );


        // --------------------------------------------------
        // VERIFICAR SE É HOJE
        // --------------------------------------------------

        const hoje =
            new Date();


        if (
            day === hoje.getDate() &&
            month === hoje.getMonth() &&
            year === hoje.getFullYear()
        ) {

            dayElement.classList.add(
                "hoje"
            );
            dayElement.setAttribute("aria-current", "date");
        }


        // --------------------------------------------------
        // CALENDÁRIO DO CICLO
        // --------------------------------------------------

        if (dadosCiclo) {

            const diaDoCiclo =
                calcularDiaDoCicloParaData(
                    dataDoDia,
                    dadosCiclo.dataInicio,
                    dadosCiclo.tamanhoCiclo
                );


            // Se a data pertence a um ciclo válido
            if (diaDoCiclo !== null) {

                const fase =
                    determinarFase(
                        diaDoCiclo,
                        dadosCiclo.tamanhoCiclo
                    );


                // Adiciona a classe da fase
                dayElement.classList.add(
                    fase
                );


                // Guarda o dia do ciclo no HTML
                dayElement.dataset.diaCiclo =
                    diaDoCiclo;


                // Guarda a fase no HTML
                dayElement.dataset.fase =
                    fase;
            }
        }


        // --------------------------------------------------
        // ADICIONA O DIA AO CALENDÁRIO
        // --------------------------------------------------

        calendarElement.appendChild(
            dayElement
        );
    }
}


// ======================================================
// BOTÃO MÊS ANTERIOR
// ======================================================

previousMonthButton.addEventListener(
    "click",
    function () {

        // Diminui um mês
        currentDate.setMonth(
            currentDate.getMonth() - 1
        );


        // Recria o calendário
        generateCalendar();
    }
);


// ======================================================
// BOTÃO PRÓXIMO MÊS
// ======================================================

nextMonthButton.addEventListener(
    "click",
    function () {

        // Aumenta um mês
        currentDate.setMonth(
            currentDate.getMonth() + 1
        );


        // Recria o calendário
        generateCalendar();
    }
);


// ======================================================
// SALVAR CICLO
// ======================================================

salvarCiclo?.addEventListener(
    "click",
    function () {

        // Verifica se a data foi preenchida
        if (!campoUltimaMenstruacao.value) {

            alert(
                "Informe o primeiro dia da sua última menstruação."
            );

            return;
        }


        // Pega o tamanho do ciclo
        const tamanhoCiclo =
            Number(
                campoTamanhoCiclo.value
            );


        // Verifica o tamanho
        if (
            !Number.isInteger(tamanhoCiclo) ||
            tamanhoCiclo < 20 ||
            tamanhoCiclo > 45
        ) {

            alert(
                "A duração do ciclo deve ser um número inteiro entre 20 e 45 dias."
            );

            return;
        }


        // Cria a data
        const dataUltimaMenstruacao =
            new Date(
                campoUltimaMenstruacao.value +
                "T00:00:00"
            );

        if (!obterDadosDoCiclo()) {
            alert("Informe uma data válida que não esteja no futuro.");
            return;
        }


        try {
            localStorage.setItem(chaveCiclo, JSON.stringify({
                data: campoUltimaMenstruacao.value,
                tamanho: tamanhoCiclo
            }));
        } catch {
            alert("Não foi possível salvar o ciclo neste navegador. Tente novamente.");
            return;
        }

        // Calcula o dia atual
        const diaDoCiclo =
            calcularDiaDoCiclo(
                dataUltimaMenstruacao,
                tamanhoCiclo
            );


        // Calcula a fase
        const fase =
            determinarFase(
                diaDoCiclo,
                tamanhoCiclo
            );


        // Mostra no console
        console.log(
            "Última menstruação:",
            dataUltimaMenstruacao
        );

        console.log(
            "Tamanho do ciclo:",
            tamanhoCiclo
        );

        console.log(
            "Dia do ciclo:",
            diaDoCiclo
        );

        console.log(
            "Fase atual:",
            fase
        );


        // Atualiza o card
        atualizarTemaFase(
            fase
        );


        // Mostra o dia do ciclo
        if (numeroDiaCiclo) {

            numeroDiaCiclo.textContent = diaDoCiclo;
        }


        // Volta o calendário para o mês atual
        currentDate = new Date();
        currentDate.setDate(1);


        // Recria novamente
        generateCalendar();
    }
);


function carregarCicloSalvo() {
    const salvo = lerCicloSalvo();
    if (campoUltimaMenstruacao) campoUltimaMenstruacao.value = salvo.data || "";
    if (campoTamanhoCiclo) campoTamanhoCiclo.value = salvo.tamanho || 28;
    const dados = obterDadosDoCiclo();
    if (dados) {
        const dia = calcularDiaDoCiclo(dados.dataInicio, dados.tamanhoCiclo);
        atualizarTemaFase(determinarFase(dia, dados.tamanhoCiclo));
        if (numeroDiaCiclo) numeroDiaCiclo.textContent = dia;
    } else {
        if (tituloFaseAtual) tituloFaseAtual.textContent = "Registre seu ciclo para visualizar a fase";
        if (numeroDiaCiclo) numeroDiaCiclo.textContent = "—";
    }
    generateCalendar();
}

carregarCicloSalvo();
window.addEventListener("storage", (evento) => {
    if (evento.key === chaveCiclo || evento.key === null) carregarCicloSalvo();
});

// Mantém o destaque correto após a meia-noite ou ao retornar à aba.
function atualizarDestaqueDeHoje() {
    const hoje = new Date();
    const mesAtualVisivel =
        currentDate.getMonth() === hoje.getMonth() &&
        currentDate.getFullYear() === hoje.getFullYear();

    calendarElement.querySelectorAll("button.calendar-day").forEach(function (dia) {
        const ehHoje = mesAtualVisivel && Number(dia.textContent) === hoje.getDate();
        dia.classList.toggle("hoje", ehHoje);

        if (ehHoje) {
            dia.setAttribute("aria-current", "date");
        } else {
            dia.removeAttribute("aria-current");
        }
    });
}

setInterval(atualizarDestaqueDeHoje, 1000);
window.addEventListener("focus", atualizarDestaqueDeHoje);
document.addEventListener("visibilitychange", atualizarDestaqueDeHoje);

// ======================================================
// REGISTRO EMOCIONAL
// ======================================================

(function () {

    // Pega os botões de humor
    const botoes = document.querySelectorAll(".humor");

    // Pega o campo de observação
    const campo =
        document.getElementById("registroEmocional");

    // Pega o botão de salvar
    const enviar =
        document.getElementById("salvarRegistro");

    // Cria uma área para mensagens de status
    // caso ela ainda não exista no HTML
    let status =
        document.getElementById("statusRegistro");

    if (!status) {
        status = document.createElement("p");
        status.id = "statusRegistro";

        enviar?.insertAdjacentElement(
            "afterend",
            status
        );
    }


    // Chave usada para guardar os registros
    const chave = "registrosEmocionais";


    // Guarda o humor atualmente selecionado
    let humor = "";


    // ==================================================
    // DATA DE HOJE
    // ==================================================

    function dataHoje() {

        const hoje = new Date();

        const ano =
            hoje.getFullYear();

        const mes =
            String(hoje.getMonth() + 1)
                .padStart(2, "0");

        const dia =
            String(hoje.getDate())
                .padStart(2, "0");

        return `${ano}-${mes}-${dia}`;
    }


    // ==================================================
    // LER REGISTROS
    // ==================================================

    function lerRegistros() {

        const dados =
            localStorage.getItem(chave);

        // Se não existir nenhum registro,
        // começa com um objeto vazio
        if (!dados) {
            return {};
        }

        return JSON.parse(dados);
    }


    // ==================================================
    // SELECIONAR HUMOR
    // ==================================================

    function selecionar(valor) {

        // Guarda o humor escolhido
        humor = valor;

        // Passa por todos os botões
        botoes.forEach(function (botao) {

            // Verifica se esse é o botão selecionado
            const ativo =
                botao.dataset.humor === humor;

            // Adiciona ou remove a classe selecionado
            botao.classList.toggle(
                "selecionado",
                ativo
            );

            // Atualiza acessibilidade
            botao.setAttribute(
                "aria-pressed",
                String(ativo)
            );
        });
    }


    // ==================================================
    // CLIQUE NOS BOTÕES DE HUMOR
    // ==================================================

    botoes.forEach(function (botao) {

        botao.addEventListener(
            "click",
            function () {

                // Seleciona o humor
                selecionar(
                    botao.dataset.humor
                );

                // Limpa mensagem anterior
                status.textContent = "";
            }
        );
    });


    // ==================================================
    // DIGITAÇÃO DA OBSERVAÇÃO
    // ==================================================

    campo?.addEventListener(
        "input",
        function () {

            // Remove mensagem anterior
            status.textContent = "";
        }
    );


    // ==================================================
    // ESTADO INICIAL
    // ==================================================

    // Nenhum humor selecionado inicialmente
    selecionar("");

    // Campo começa vazio
    if (campo) {
        campo.value = "";
    }


    // ==================================================
    // SALVAR REGISTRO
    // ==================================================

    enviar?.addEventListener(
        "click",
        function () {

            // Verifica se um humor foi selecionado
            if (!humor) {

                status.textContent =
                    "Selecione como você está se sentindo antes de enviar.";

                // Coloca o foco no primeiro botão
                botoes[0]?.focus();

                return;
            }


            try {

                // Recupera os registros existentes
                const registros =
                    lerRegistros();


                // Salva o registro de hoje
                registros[dataHoje()] = {

                    humor: humor,

                    observacao:
                        campo.value.trim()
                };


                // Salva novamente no LocalStorage
                localStorage.setItem(
                    chave,
                    JSON.stringify(registros)
                );


                // Limpa o campo
                campo.value = "";


                // Desmarca o humor
                selecionar("");


                // Mostra mensagem de sucesso
                status.textContent =
                    "Registro de hoje salvo com sucesso!";

            } catch {

                // Caso aconteça algum erro
                status.textContent =
                    "Não foi possível salvar. Tente novamente neste navegador.";
            }
        }
    );

})();