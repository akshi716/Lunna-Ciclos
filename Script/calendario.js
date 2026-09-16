// Pega o elemento que mostra o mês
const monthElement = document.getElementById("month");

// Pega o elemento que mostra o ano
const yearElement = document.getElementById("year");

// Pega a área onde os dias serão criados
const calendarElement = document.getElementById("calendar");

// Pega o botão de mês anterior
const previousMonthButton = document.getElementById("previousMonth");

// Pega o botão de próximo mês
const nextMonthButton = document.getElementById("nextMonth");


// Guarda a data que estamos visualizando
let currentDate = new Date();


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


// Função que cria o calendário
function generateCalendar() {

    // Limpa o calendário antes de criar novamente
    calendarElement.innerHTML = "";


    // Pega o mês atual
    const month = currentDate.getMonth();

    // Pega o ano atual
    const year = currentDate.getFullYear();


    // Mostra o mês no HTML
    monthElement.textContent = months[month];

    // Mostra o ano no HTML
    yearElement.textContent = year;


    // Cria uma data representando o primeiro dia do mês
    const firstDay = new Date(year, month, 1);


    // Descobre quantos dias existem nesse mês
    const daysInMonth = new Date(year, month + 1, 0).getDate();


    // Descobre em qual dia da semana o mês começa
    let firstDayOfWeek = firstDay.getDay();


    // Ajusta domingo para ser o último dia da semana
    if (firstDayOfWeek === 0) {
        firstDayOfWeek = 7;
    }


    // Cria os espaços vazios antes do primeiro dia
    for (let i = 1; i < firstDayOfWeek; i++) {

        const emptyDay = document.createElement("div");

        emptyDay.classList.add("calendar-day", "empty");

        calendarElement.appendChild(emptyDay);
    }


    // Cria cada dia do mês
    for (let day = 1; day <= daysInMonth; day++) {

        // Cria um botão para representar o dia
        const dayElement = document.createElement("button");

        // Define o tipo do botão
        dayElement.type = "button";

        // Adiciona a classe do dia
        dayElement.classList.add("calendar-day");

        // Coloca o número do dia dentro do botão
        dayElement.textContent = day;


        // Pega a data atual
        const today = new Date();


        // Verifica se o dia criado é hoje
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            // Marca o dia como "today"
            dayElement.classList.add("today");
        }


        // Adiciona o botão ao calendário
        calendarElement.appendChild(dayElement);
    }
}


// Quando clicar em "mês anterior"
previousMonthButton.addEventListener("click", () => {

    // Volta um mês
    currentDate.setMonth(currentDate.getMonth() - 1);

    // Recria o calendário
    generateCalendar();
});


// Quando clicar em "próximo mês"
nextMonthButton.addEventListener("click", () => {

    // Avança um mês
    currentDate.setMonth(currentDate.getMonth() + 1);

    // Recria o calendário
    generateCalendar();
});


// Cria o calendário assim que a página é carregada
generateCalendar();


/*capturando os elemtos html e guardadando os dentro de 
variaveis constantes*/

const campoUltimenstruacao =
    document.getElementById("ultimoMenstruacao");


const campoTamanhoCiclo =
    document.getElementById("tamanhoCiclo");

const salvarCiclo =
    document.getElementById("salvarCiclo");


/* Agora crio um evento para salvar os dados de
registroapos o click */


salvarCiclo.addEventListener("clck", function () {

    console.log(campoUltimenstruacao.value);

    console.log(campoTamanhoCiclo.value);


});

/*Tranformando os dados obtidos de Ultima Menstruacao realmente em um dado do
tipo data contendo dentro dele mês, dia, semana*/


const dataUltimaMenstruacao =

    new Date(campoUltimenstruacao.value);


function calcularDiaDoCiclo(dataInicio) {

    const hoje = new Date();

    const diferenca = hoje.getTime() -
        dataInicio.getTime();

    const milisegundosPorDia =
        1000 * 60 * 60 * 24;
const diasPassados = math.floor(
    diferenca / milisssegundosPorDia

);
return diasPassados + 1;

}

function determinarFase(diaDoCiclo) {

    if (diaDoCiclo >= 1 && diaDoCiclo <= 5) {
        return "menstruacao";
    }

    if (diaDoCiclo >= 6 && diaDoCiclo <= 13) {
        return "folicular";
    }

    if (diaDoCiclo === 14) {
        return "ovulacao";
    }

    return "indefinida";
}
