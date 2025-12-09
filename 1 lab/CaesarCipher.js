const alphabet = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];

const textInput = document.getElementById('text-input');
const resultOutput = document.getElementById('result-output');
const keyInput = document.getElementById('key-input');
const keyOutput = document.getElementById('key-output');

const encryptButton = document.getElementById("encrypt-button");
const decryptButton = document.getElementById("decrypt-button");
const hackButton = document.getElementById("hack-button");

function encryptCaesarCipher() {

    let originalText = textInput.value.toUpperCase();;
    let k = Math.floor(Math.random() * alphabet.length) + 1;
    let encryptedText = [];

    for (let i = 0; i < originalText.length; i++) {
        currentLetter = originalText[i];
        if (currentLetter === ' ') {
            encryptedText.push(' ')
            continue;
        }

        let indexOfLetter = alphabet.indexOf(currentLetter);

        if (indexOfLetter === -1) {
            encryptedText.push(currentLetter);
            continue;
        }

        let newIndex = (indexOfLetter + k) % alphabet.length;

        encryptedText.push(alphabet[newIndex]);
    }

    let result = encryptedText.join("");

    resultOutput.innerHTML = result;
    keyOutput.innerHTML = k;
}


function decryptCaesarCipher() {

    const originalText = textInput.value.toUpperCase();
    const k = parseInt(keyInput.value);
    let decryptedText = [];

    if (isNaN(k) || k < 1 || k > 32) {
        resultOutput.textContent = 'Введите ключ от 1 до 32';
        keyDisplay.textContent = '';
        return;
    }

    for (let i = 0; i < originalText.length; i++) {
        let currentLetter = originalText[i];

        if (currentLetter === ' ') {
            decryptedText.push(' ');
            continue;
        }

        let indexOfLetter = alphabet.indexOf(currentLetter);

        if (indexOfLetter === -1) {
            decryptedText.push(currentLetter);
            continue;
        }

        let newIndex = (indexOfLetter - k + alphabet.length) % alphabet.length;
        decryptedText.push(alphabet[newIndex]);
    }

    let result = decryptedText.join("");
    resultOutput.innerHTML = result;
    keyOutput.innerHTML = k;
}


function hackCaesarCipher() {

    const originalText = textInput.value.toUpperCase();
    let result = '';

    for (let k = 1; k <= alphabet.length; k++) {
        let hackedText = [];
        for (let i = 0; i < originalText.length; i++) {
            const currentLetter = originalText[i];
            if (currentLetter === ' ') {
                hackedText.push(' ');
                continue;
            }

            const indexOfLetter = alphabet.indexOf(currentLetter);

            if (indexOfLetter === -1) {
                hackedText.push(currentLetter);
                continue;
            }

            const newIndex = (indexOfLetter - k + alphabet.length) % alphabet.length;
            hackedText.push(alphabet[newIndex]);
        }

        result += `Ключ ${k}: ${hackedText.join('').toLowerCase()}<br>`;
    }

    resultOutput.innerHTML = result;
}

encryptButton.addEventListener('click', encryptCaesarCipher);
decryptButton.addEventListener('click', decryptCaesarCipher);
hackButton.addEventListener('click', hackCaesarCipher);

// Примеры для расшифровки
// 1. Ефзп тулезх!
// Ключ: 3
// Всем привет!

// 2. Ъ ЙТАИЧ РЙТО КЙЬЦЭЫНЧ Э ЪКЙИДД
// Ключ: 28
// Я очень хочу побывать в Японии

// 3. МЕЖЧХЕ ЧХН ФЕХА
// Ключ: 5
// Завтра три пары
