const digitInputs = [...document.querySelectorAll(".digit-input")];
const tryBtn = document.getElementById("tryBtn");
const giveUpBtn = document.getElementById("giveUpBtn");
const newGameBtn = document.getElementById("newGameBtn");
const attemptCount = document.getElementById("attemptCount");
const feedback = document.getElementById("feedback");
const history = document.getElementById("history");
const gameCard = document.querySelector(".game-card");

let secret = "";
let attempts = 0;
let gameOver = false;


/*
============================================================
1. VERIFICAR SE OS 3 DÍGITOS SÃO DIFERENTES
============================================================

Exemplos:

123 → true
527 → true
112 → false
121 → false
777 → false
*/

function hasDifferentDigits(number) {

    const digits = String(number);

    return (
        digits.length === 3 &&
        digits[0] !== digits[1] &&
        digits[0] !== digits[2] &&
        digits[1] !== digits[2]
    );
}


/*
============================================================
2. GERAR A SENHA
============================================================

A senha precisa:

- estar entre 100 e 999;
- possuir três dígitos;
- possuir dígitos diferentes entre si.

Equivalente à regra do código em C.
*/

function generateSecret() {

    let value;

    do {

        value = Math.floor(Math.random() * 900) + 100;

    } while (!hasDifferentDigits(value));

    return String(value);
}


/*
============================================================
3. INICIAR NOVA PARTIDA
============================================================
*/

function startGame() {

    secret = generateSecret();

    attempts = 0;

    gameOver = false;

    attemptCount.textContent = "00";

    feedback.className = "feedback";
    feedback.textContent = "";

    history.innerHTML = "";

    digitInputs.forEach((input, index) => {

        input.value = "";

        input.disabled = false;

        input.classList.remove("shake");

        if (index === 0) {
            input.focus();
        }
    });

    tryBtn.disabled = false;

    tryBtn.innerHTML = `
        <span>Testar combinação</span>
        <span class="arrow" aria-hidden="true">→</span>
    `;

    giveUpBtn.disabled = false;

    gameCard.classList.remove("win");
}


/*
============================================================
4. PEGAR A TENTATIVA
============================================================
*/

function getGuess() {

    return digitInputs
        .map(input => input.value)
        .join("");
}


/*
============================================================
5. LIMPAR OS CAMPOS
============================================================
*/

function clearInputs() {

    digitInputs.forEach(input => {
        input.value = "";
    });

    digitInputs[0].focus();
}


/*
============================================================
6. MOSTRAR MENSAGEM
============================================================
*/

function showFeedback(message, type) {

    feedback.className = `feedback show ${type}`;

    feedback.textContent = message;
}


/*
============================================================
7. COMPARAR TENTATIVA COM A SENHA
============================================================

caracteresCertos:

Quantidade de dígitos da tentativa que existem na senha.

caracteresNasPosicoesCorretas:

Quantidade de dígitos que estão exatamente
na mesma posição.

O vetor usado impede que uma posição da senha
seja utilizada mais de uma vez.
*/

function compareGuess(guess) {

    let caracteresCertos = 0;

    let caracteresNasPosicoesCorretas = 0;


    /*
    --------------------------------------------------------
    Verificar posições corretas
    --------------------------------------------------------
    */

    for (let i = 0; i < 3; i++) {

        if (guess[i] === secret[i]) {

            caracteresNasPosicoesCorretas++;
        }
    }


    /*
    --------------------------------------------------------
    Controlar posições já utilizadas
    --------------------------------------------------------
    */

    const usado = [0, 0, 0];


    /*
    --------------------------------------------------------
    Procurar os dígitos da tentativa dentro da senha
    --------------------------------------------------------
    */

    for (let i = 0; i < 3; i++) {

        for (let j = 0; j < 3; j++) {

            if (
                guess[i] === secret[j] &&
                usado[j] === 0
            ) {

                caracteresCertos++;

                usado[j] = 1;

                break;
            }
        }
    }


    return {
        caracteresCertos,
        caracteresNasPosicoesCorretas
    };
}


/*
============================================================
8. ADICIONAR TENTATIVA AO HISTÓRICO
============================================================
*/

function addHistory(guess, resultado) {

    const row = document.createElement("div");

    row.className = "history-row";

    row.innerHTML = `
        <span class="history-guess">
            ${guess}
        </span>

        <span class="history-clue">

            <b>${resultado.caracteresCertos}</b>
            número(s) certo(s)

            ·

            <b>${resultado.caracteresNasPosicoesCorretas}</b>
            posição(ões) correta(s)

        </span>
    `;

    history.prepend(row);
}


/*
============================================================
9. FINALIZAR PARTIDA
============================================================
*/

function finishGame() {

    gameOver = true;

    digitInputs.forEach(input => {
        input.disabled = true;
    });

    tryBtn.disabled = true;

    giveUpBtn.disabled = true;
}


/*
============================================================
10. REALIZAR TENTATIVA
============================================================
*/

function submitGuess() {

    if (gameOver) {
        return;
    }


    /*
    --------------------------------------------------------
    PEGAR A TENTATIVA
    --------------------------------------------------------
    */

    const guess = getGuess();


    /*
    --------------------------------------------------------
    VERIFICAR SE FOI DIGITADO UM NÚMERO DE 3 DÍGITOS
    --------------------------------------------------------
    */

    if (!/^\d{3}$/.test(guess)) {

        showFeedback(
            "Digite uma combinação com exatamente 3 dígitos.",
            "danger"
        );

        gameCard.classList.remove("shake");

        void gameCard.offsetWidth;

        gameCard.classList.add("shake");

        return;
    }


    /*
    --------------------------------------------------------
    REGRA DOS DÍGITOS DIFERENTES
    --------------------------------------------------------

    Aqui está a nova regra.

    Exemplos inválidos:

    112
    121
    122
    777

    Exemplos válidos:

    123
    527
    908
    */

    if (!hasDifferentDigits(guess)) {

        showFeedback(
            "A tentativa deve possuir 3 dígitos diferentes entre si.",
            "danger"
        );

        gameCard.classList.remove("shake");

        void gameCard.offsetWidth;

        gameCard.classList.add("shake");

        return;
    }


    /*
    --------------------------------------------------------
    CONTABILIZAR TENTATIVA
    --------------------------------------------------------
    */

    attempts++;

    attemptCount.textContent =
        String(attempts).padStart(2, "0");


    /*
    --------------------------------------------------------
    VERIFICAR DESISTÊNCIA
    --------------------------------------------------------

    Mantemos a possibilidade de usar 1 para desistir.

    Porém, como a interface exige 3 campos,
    essa opção pode ser usada pelo botão
    "Desistir e revelar senha".
    */

    if (guess === "1") {

        showFeedback(
            `SENHA: ${secret} — Você desistiu!`,
            "warning"
        );

        finishGame();

        return;
    }


    /*
    --------------------------------------------------------
    VERIFICAR SE ACERTOU
    --------------------------------------------------------
    */

    if (guess === secret) {

        showFeedback(
            `PARABÉNS! Você acertou a senha! ` +
            `Tentativa: ${guess} — ` +
            `Senha: ${secret} — ` +
            `Quantidade de tentativas: ${attempts}`,
            "success"
        );

        gameCard.classList.add("win");

        addHistory(
            guess,
            {
                caracteresCertos: 3,
                caracteresNasPosicoesCorretas: 3
            }
        );

        finishGame();

        return;
    }


    /*
    --------------------------------------------------------
    COMPARAR OS DÍGITOS
    --------------------------------------------------------
    */

    const resultado = compareGuess(guess);


    /*
    --------------------------------------------------------
    ADICIONAR AO HISTÓRICO
    --------------------------------------------------------
    */

    addHistory(guess, resultado);


    /*
    --------------------------------------------------------
    MOSTRAR RESULTADO
    --------------------------------------------------------
    */

    showFeedback(
        `Tentativa: ${guess} — ` +
        `Números certos: ${resultado.caracteresCertos} — ` +
        `Posições corretas: ${resultado.caracteresNasPosicoesCorretas}`,
        resultado.caracteresCertos === 0
            ? "warning"
            : "success"
    );


    /*
    --------------------------------------------------------
    LIMPAR PARA A PRÓXIMA TENTATIVA
    --------------------------------------------------------
    */

    clearInputs();
}


/*
============================================================
11. DESISTIR
============================================================
*/

function giveUp() {

    if (gameOver) {
        return;
    }

     showFeedback(`Partida encerrada. A senha secreta era ${secret}.`, "warning");

    finishGame();
}


/*
============================================================
12. CONTROLE DOS CAMPOS
============================================================
*/

digitInputs.forEach((input, index) => {

    input.addEventListener("input", () => {

        /*
        Aceitar somente números.
        */

        input.value = input.value
            .replace(/\D/g, "")
            .slice(0, 1);


        /*
        Impedir que o usuário mantenha
        um dígito igual a outro campo.
        */

        const currentValue = input.value;

        if (currentValue !== "") {

            const repeated = digitInputs.some(
                (otherInput, otherIndex) =>
                    otherIndex !== index &&
                    otherInput.value === currentValue
            );

            if (repeated) {

                showFeedback(
                    "Os três dígitos precisam ser diferentes entre si.",
                    "danger"
                );

                input.value = "";

                return;
            }
        }


        /*
        Passar para o próximo campo.
        */

        if (
            input.value &&
            index < digitInputs.length - 1
        ) {

            digitInputs[index + 1].focus();
        }
    });


    input.addEventListener("keydown", (event) => {

        /*
        BACKSPACE
        */

        if (
            event.key === "Backspace" &&
            !input.value &&
            index > 0
        ) {

            digitInputs[index - 1].focus();
        }


        /*
        SETA ESQUERDA
        */

        if (
            event.key === "ArrowLeft" &&
            index > 0
        ) {

            digitInputs[index - 1].focus();
        }


        /*
        SETA DIREITA
        */

        if (
            event.key === "ArrowRight" &&
            index < digitInputs.length - 1
        ) {

            digitInputs[index + 1].focus();
        }


        /*
        ENTER
        */

        if (event.key === "Enter") {

            submitGuess();
        }
    });


    /*
    --------------------------------------------------------
    COLAR NÚMERO
    --------------------------------------------------------
    */

    input.addEventListener("paste", (event) => {

        const pasted = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 3);

        if (!pasted) {
            return;
        }

        event.preventDefault();


        /*
        Verificar se os dígitos colados são diferentes.
        */

        if (!hasDifferentDigits(pasted)) {

            showFeedback(
                "Os três dígitos precisam ser diferentes entre si.",
                "danger"
            );

            return;
        }


        pasted.split("").forEach((digit, i) => {

            if (digitInputs[i]) {

                digitInputs[i].value = digit;
            }
        });


        const focusIndex =
            Math.min(pasted.length, 2);

        digitInputs[focusIndex].focus();
    });
});


/*
============================================================
13. BOTÕES
============================================================
*/

tryBtn.addEventListener(
    "click",
    submitGuess
);

giveUpBtn.addEventListener(
    "click",
    giveUp
);

newGameBtn.addEventListener(
    "click",
    startGame
);


/*
============================================================
14. INICIAR O JOGO
============================================================
*/

startGame();