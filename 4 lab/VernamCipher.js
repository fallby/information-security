const textInput = document.getElementById('text-input');
const resultOutput = document.getElementById('result-output');
const resultOutputDec = document.getElementById('result-output-dec');
const keyInput = document.getElementById('key-input');
const keyOutput = document.getElementById('key-output');
const keyOutputDec = document.getElementById('key-output-dec');

const encryptButton = document.getElementById("encrypt-button");
const decryptButton = document.getElementById("decrypt-button");

function encryptVernamCipher() {
    let originalText = textInput.value;
    let keyWord = keyInput.value;
    let originalTextDec = [];
    let keyDec = [];
    let keyChar = [];
    let resultDec = [];
    let resultText = [];

    // находим введённый текст в ascii
    for (let i = 0; i < originalText.length; i++) {
        let char = findKeyByValue(asciiMap, originalText[i]);
        if (char === undefined) {
            resultOutput.innerHTML = `Символ ${originalText[i]} не поддерживается кодировкой Ascii`;
            return;
        }
        originalTextDec.push(char);
    }
    console.log(originalTextDec);

    if (keyInput.value === "") {
        // генерируем ключ 
        for (let i = 0; i < originalText.length; i++) {
            let randomKey = Math.floor(Math.random() * asciiMap.size);
            keyDec.push(randomKey);
            keyChar.push(asciiMap.get(randomKey));
        }
    } else {
        // проверяем длину ключа
        if (keyWord.length != originalText.length) {
            resultOutput.innerHTML = "Длина ключа должна быть равна длине текста";
            return;
        } else {
            for (let i = 0; i < keyWord.length; i++) {
                let userKey = findKeyByValue(asciiMap, keyWord[i]); 
                if (userKey === undefined) {
                    resultOutput.innerHTML = `Символ ${keyWord[i]} не поддерживается кодировкой Ascii`;
                    return;
                }
                keyDec.push(userKey);
                keyChar.push(asciiMap.get(userKey));
            }
        }
    }

    // шифрование
    for (let i = 0; i < originalText.length; i++) {
        let resultOfOperation = originalTextDec[i] ^ keyDec[i];
        resultDec.push(resultOfOperation);
        let resultSymbol = asciiMap.get(resultOfOperation);
        resultText.push(resultSymbol);
    }

    let result = resultText.join("");
    let k = keyChar.join("");
    resultOutput.innerHTML = result;
    resultOutputDec.innerHTML = resultDec;
    keyOutput.innerHTML = k;
    keyOutputDec.innerHTML = keyDec;
}

function decryptVernamCipher() {
    const originalText = textInput.value;
    let keyWord = keyInput.value;
    let originalTextDec = [];
    let keyDec = [];
    let keyChar = [];
    let resultDec = [];
    let resultText = [];

    // находим введённый текст в ascii
    for (let i = 0; i < originalText.length; i++) {
        let char = findKeyByValue(asciiMap, originalText[i]);
        if (char === undefined) {
            resultOutput.innerHTML = `Символ ${originalText[i]} не поддерживается кодировкой Ascii`;
            return;
        }
        originalTextDec.push(char);
    }
    console.log(originalTextDec);
    
    if (keyInput.value === "") {
        resultOutput.innerHTML = "Введите ключ";
        return;
    } else {
        // проверяем длину ключа
        if (keyWord.length != originalText.length) {
            resultOutput.innerHTML = "Длина ключа должна быть равна длине текста";
            return;
        } else {
            for (let i = 0; i < keyWord.length; i++) {
                let userKey = findKeyByValue(asciiMap, keyWord[i]); 
                if (userKey === undefined) {
                    resultOutput.innerHTML = `Символ ${keyWord[i]} не поддерживается кодировкой Ascii`;
                    return;
                }
                keyDec.push(userKey);
                keyChar.push(asciiMap.get(userKey));
            }
        }
    }

    // расшифровка
    for (let i = 0; i < originalText.length; i++) {
        let resultOfOperation = originalTextDec[i] ^ keyDec[i];
        resultDec.push(resultOfOperation);
        let resultSymbol = asciiMap.get(resultOfOperation);
        resultText.push(resultSymbol);
    }

    let result = resultText.join("");
    let k = keyChar.join("");
    resultOutput.innerHTML = result;
    resultOutputDec.innerHTML = resultDec;
    keyOutput.innerHTML = k;
    keyOutputDec.innerHTML = keyDec;
}

// функция для поиска ключа по значению
function findKeyByValue(map, searchValue) {
    for (const [key, value] of map.entries()) {
        if (value === searchValue)
            return key;
    }
    return undefined;
}

encryptButton.addEventListener('click', encryptVernamCipher);
decryptButton.addEventListener('click', decryptVernamCipher);