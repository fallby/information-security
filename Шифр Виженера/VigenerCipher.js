const alphabet = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];
const keys = ["КОД", "КЛЮЧ", "ШИФР", "БАЙТ", "ФАЙЛ", "ВЗЛОМ", "ХАКЕР", "СЕРВЕР", "ПАРОЛЬ", "ЛОГИН", "АККАУНТ", "ПРОГРАММА", "СИСТЕМА", "ДАННЫЕ"];

let encryptedText = document.getElementById('encrypted-output');
let key = document.getElementById('encrypt-key-display');
let encryptButton = document.getElementById("encrypt-button");

function VigenerCipher() {
    let originalText = document.getElementById('text-encrypt').value;
    let k = keys[Math.ceil(Math.random() * keys.length)];
    let keyWord = "";
    let result = [];
    let textLength = originalText.length;
    let keyLength = k.length;
    originalText = originalText.toUpperCase();
    originalText.split("");


    let count = Math.round(textLength / keyLength);
    keyWord = k.repeat(count);
    keyWord = keyWord.slice(0, textLength);


    for (let i = 0; i < textLength; i++) {
        let indexWord = alphabet.indexOf(originalText[i], 0);
        let indexKey = alphabet.indexOf(keyWord[i], 0);
        let newIndex = (indexWord + indexKey) % alphabet.length;
        result.push(alphabet[newIndex]);
    }

    let resultText = result.join("");
    encryptedText.innerHTML = resultText;
    key.innerHTML = keyWord;
}

encryptButton.addEventListener('click', VigenerCipher);
