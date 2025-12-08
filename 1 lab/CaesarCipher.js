const alphabet = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];

const hackedTextResult = document.getElementById('encrypted-output');
const KResult = document.getElementById('encrypt-key-display');
const encryptButton = document.getElementById("encrypt-button");

function encryptCaesarCipher() {

    let originalText = document.getElementById('text-encrypt').value;
    let k = Math.floor(Math.random() * alphabet.length) + 1;
    let hackedText = [];
    originalText = originalText.toUpperCase();

    for (let i = 0; i < originalText.length; i++) { 
        currentLetter = originalText[i];
        if (currentLetter === ' ') {
            hackedText.push(' ')
            continue;
        }

        let indexOfLetter = alphabet.indexOf(currentLetter);

        if (indexOfLetter === -1) {
            hackedText.push(currentLetter);
            continue;
        }

        let newIndex = (indexOfLetter + k) % alphabet.length;
        
        hackedText.push(alphabet[newIndex]);
    } 

    let result = hackedText.join("");
    
    hackedTextResult.innerHTML = result;
    KResult.innerHTML = k;
}

encryptButton.addEventListener('click', encryptCaesarCipher);


const decryptedTextResult = document.getElementById('decrypted-output'); 
const KUsed = document.getElementById('decrypt-key-display');
const decryptButton = document.getElementById("decrypt-button");

function decryptCaesarCipher() {

    let originalText = document.getElementById('text-decrypt').value;
    let k = document.getElementById('key-input').value;
    k = Number(k);
    let decryptedText = [];
    originalText = originalText.toUpperCase();

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
    decryptedTextResult.innerHTML = result;
    KUsed.innerHTML = k;
}

decryptButton.addEventListener('click', decryptCaesarCipher);

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