const alphabet = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];
const keys = ["КОД", "КЛЮЧ", "ШИФР", "БАЙТ", "ФАЙЛ", "ВЗЛОМ", "ХАКЕР", "СЕРВЕР", "ПАРОЛЬ", "ЛОГИН", "АККАУНТ", "ПРОГРАММА", "СИСТЕМА", "ДАННЫЕ"];

const textInput = document.getElementById('text-input');
const resultOutput = document.getElementById('result-output');
const keyInput = document.getElementById('key-input');
const keyOutput = document.getElementById('key-output');

const encryptButton = document.getElementById("encrypt-button");
const decryptButton = document.getElementById("decrypt-button");

function encryptVigenerCipher() {
    let originalText = textInput.value.toUpperCase().replace(/[^А-ЯЁ]/g, '');;
    let keyWord = "";
    let result = [];
    let textLength = originalText.length;

    if (keyInput.value === "") {
        keyWord = keys[Math.floor(Math.random() * keys.length)].toUpperCase();
    } else {
        keyWord = keyInput.value.toUpperCase();
    }

    let keyLength = keyWord.length;
    let count = Math.ceil(textLength / keyLength);
    keyWord = keyWord.repeat(count);
    keyWord = keyWord.slice(0, textLength);
    
    for (let i = 0; i < textLength; i++) {
        let indexWord = alphabet.indexOf(originalText[i], 0);
        let indexKey = alphabet.indexOf(keyWord[i], 0);
        let newIndex = (indexWord + indexKey) % alphabet.length;
        result.push(alphabet[newIndex]);
    }

    let resultText = result.join("");
    resultOutput.innerHTML = resultText;
    keyOutput.innerHTML = keyWord;
}

function decryptVigenerCipher() {
    let originalText = textInput.value.toUpperCase().replace(/[^А-ЯЁ]/g, '');;
    let keyWord = keyInput.value.trim().toUpperCase();
    let result = [];
    let textLength = originalText.length;

    if (keyWord.length === 0) {
        resultOutput.innerHTML = 'Введите ключ для расшифровки!';
        return;
    }

    let keyLength = keyWord.length;
    let count = Math.ceil(textLength / keyLength);
    keyWord = keyWord.repeat(count);
    keyWord = keyWord.slice(0, textLength);


    for (let i = 0; i < textLength; i++) {
        let indexWord = alphabet.indexOf(originalText[i]);
        let indexKey = alphabet.indexOf(keyWord[i]);
        let newIndex = (indexWord - indexKey + alphabet.length) % alphabet.length;
        result.push(alphabet[newIndex]);
    }

    let resultText = result.join("");
    resultOutput.innerHTML = resultText;
    keyOutput.innerHTML = keyWord;
}


encryptButton.addEventListener('click', encryptVigenerCipher);
decryptButton.addEventListener('click', decryptVigenerCipher);
