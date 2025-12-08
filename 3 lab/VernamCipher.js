let encryptedText = document.getElementById('encrypted-output-symbol');
let encryptedTextDec = document.getElementById('encrypted-output-dec');
let key = document.getElementById('encrypt-key-display');
let keyInDec = document.getElementById('encrypt-key-dec-display');
let encryptButton = document.getElementById("encrypt-button");

function VernamCipher() {
    let originalText = document.getElementById('text-encrypt').value;
    let originalTextAsciiDec = [];
    let keyDec = [];
    let keyChar = [];
    let resultDec = [];
    let resultText = [];

    originalText.split("");
    // находим введённый текст в ascii
    for (let i = 0; i < originalText.length; i++) {
        let char = findKeyByValue(asciiMap, originalText[i]);
        originalTextAsciiDec.push(char);
    }
    console.log(originalTextAsciiDec);

    // генерируем ключ 
    for (let i = 0; i < originalText.length; i++) {
        let randomKey = Math.floor(Math.random() * 95) + 32;
        keyDec.push(randomKey);
        keyChar.push(asciiMap.get(randomKey));
    }

    // шифрование (символы 1-31, 127 заменяются нижним подчеркиванием, тк они не отображаются в браузере)
    for (let i = 0; i < originalText.length; i++) {
        let resultOfOperation = originalTextAsciiDec[i] ^ keyDec[i];
        resultDec.push(resultOfOperation);
        if (resultOfOperation >= 32 && resultOfOperation <= 126) {
           resultText.push(asciiMap.get(resultOfOperation));
        } else {
            resultText.push(asciiMap.get(95));
        }
    }

    let result = resultText.join("");
    let k = keyChar.join("");
    encryptedText.innerHTML = result;
    encryptedTextDec.innerHTML =  resultDec;
    key.innerHTML = k;
    keyInDec.innerHTML = keyDec;
}

// функция для поиска ключа по значению
function findKeyByValue(map, searchValue) {
    for (const [key, value] of map.entries()) {
        if (value === searchValue)
            return key;
    }
    return undefined;
}

encryptButton.addEventListener('click', VernamCipher);
