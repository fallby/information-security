const textInput = document.getElementById('text-input');
const resultOutput = document.getElementById('result-output');
const resultOutputBin = document.getElementById('result-output-bin');
const resultOutputDec = document.getElementById('result-output-dec');
const keyInput = document.getElementById('key-input');
const keyOutput = document.getElementById('key-output');
const keyOutputDec = document.getElementById('key-output-dec');

const encryptButton = document.getElementById("encrypt-button");
const decryptButton = document.getElementById("decrypt-button");

function encryptDES() {
    let originalText = textInput.value;
    let keyWord = keyInput.value;
    let originalTextBit = [];
    let keyBin = [];
    let keyDec = [];
    let keyDec2 = [];
    let keyChar = [];
    let keyBinPC1 = [];

    // проверка на длину введенного текста
    if (originalText.length !== 8) {
        resultOutput.innerHTML = "Введите текст из 8 символов";
        return;
    }

    // находим введённый текст в ascii и переводим в биты
    for (let i = 0; i < originalText.length; i++) {
        let char = findKeyByValue(asciiMap, originalText[i]);
        if (char === undefined) {
            resultOutput.innerHTML = `Символ ${originalText[i]} не поддерживается кодировкой Ascii`;
            return;
        }

        let binChar = decToBin(char);
        console.log(binChar);
        binChar.forEach(element => {
            originalTextBit.push(Number(element));
        });
    }
    console.log("Исходный текст в битах " + originalTextBit);

    // перестановка IP
    let originalTextIP = [];
    for (let i = 0; i < IP.length; i++) {
        let value = IP[i];
        originalTextIP.push(originalTextBit[value - 1]);
    }
    console.log("перестановка IP " + originalTextIP);

    // делим массив на левую и правую часть
    let L0 = originalTextIP.slice(0, 32);
    let R0 = originalTextIP.slice(32, 64);
    console.log("L0 " + L0);
    console.log("R0 " + R0);

    // генерируем ключ или берем ключ введенный пользователем
    if (keyInput.value === "") {
        // генерируем ключ 
        for (let i = 0; i < 8; i++) {
            let randomKey = Math.floor(Math.random() * asciiMap.size);
            let bin = decToBin(randomKey);
            keyDec2.push(randomKey);
            keyDec.push(bin);
            keyChar.push(asciiMap.get(randomKey));
        }
    } else {
        // проверяем длину ключа
        if (keyWord.length != 8) {
            resultOutput.innerHTML = "Длина ключа должна быть равна 8 символам";
            return;
        } else {
            for (let i = 0; i < keyWord.length; i++) {
                let userKey = findKeyByValue(asciiMap, keyWord[i]);
                if (userKey === undefined) {
                    resultOutput.innerHTML = `Символ ${keyWord[i]} не поддерживается кодировкой Ascii`;
                    return;
                }
                keyDec2.push(userKey);
                let bin = decToBin(userKey);
                keyDec.push(bin);
                keyChar.push(asciiMap.get(userKey));
            }
        }
    }
    // переводим ключ в двоичную систему
    keyDec.forEach(element => {
        for (let bit of element) {
            keyBin.push(Number(bit));
        }
    })
    console.log("ключ в двоичной системе " + keyBin);

    // перестановка РС-1, убираем биты четности (8, 16, 24, 32, 48, 56, 64) 
    for (let i = 0; i < PC1.length; i++) {
        let value = PC1[i];
        keyBinPC1.push(keyBin[value - 1]);
    }
    console.log("перестановка РС-1 " + keyBinPC1);

    // делим ключ на левую и правую часть
    let C0 = keyBinPC1.slice(0, 28);
    let D0 = keyBinPC1.slice(28, 56);
    console.log("D0 " + D0);

    // 16 раундов генерации ключа
    let keys16 = [];
    for (let i = 1; i <= 16; i++) {
        let key = [];
        // сдвиг на 1 бит
        if (i == 1 || i == 2 || i == 9 || i == 16) {
            C0 = C0.slice(1).concat(C0.slice(0, 1));
            D0 = D0.slice(1).concat(D0.slice(0, 1));
        } else { // сдвиг на 2 бита
            C0 = C0.slice(2).concat(C0.slice(0, 2));
            D0 = D0.slice(2).concat(D0.slice(0, 2));
        }
        // объединяем массивы, делаем перестановку, сжимаем ключ до 48 битов
        key = C0.concat(D0);
        let keyPC2 = [];
        for (let i = 0; i < PC2.length; i++) {
            let value = PC2[i];
            keyPC2.push(key[value - 1]);
        }
        keys16.push(keyPC2);
    }

    // шифрование 16 раундов
    let right = R0;
    let left = L0;
    for (let i = 1; i <= 16; i++) {
        let textBinE = [];

        // расширение правой части текста с 32 до 48 бит
        for (let i = 0; i < E.length; i++) {
            let value = E[i];
            textBinE.push(right[value - 1]);
        }
        console.log("E " + textBinE);

        let key = keys16[i - 1];
        // XOR
        let xorResult = [];
        for (let i = 0; i < textBinE.length; i++) {
            xorResult.push(textBinE[i] ^ key[i]);
        }
        console.log("xor " + xorResult);

        // находим элемент в S таблице
        let sBlocks = [];
        for (let i = 0; i < 8; i++) {
            let bits6 = xorResult.slice(i * 6, (i + 1) * 6);
            let rowBits = bits6[0].toString() + bits6[5].toString();
            let row = parseInt(rowBits, 2);

            let columnBits = bits6[1].toString() + bits6[2].toString() + bits6[3].toString() + bits6[4].toString();
            let column = parseInt(columnBits, 2);

            let STableValue = S[i][row][column];
            let bits = STableValue.toString(2).padStart(4, '0').split('').map(Number)
            sBlocks.push(bits[0], bits[1], bits[2], bits[3]);
        }

        // перестановка P
        let textBinP = [];
        for (let i = 0; i < P.length; i++) {
            let value = P[i];
            textBinP.push(sBlocks[value - 1]);
        }
        console.log("P " + textBinP);

        // XOR с левой частью
        let newRight = [];
        for (let i = 0; i < 32; i++) {
            newRight.push(left[i] ^ textBinP[i]);
        }

        let newLeft = right;

        left = newLeft;
        right = newRight;

    }

    // соединяем правую и левую часть
    let finalResult = right.concat(left);
    // перестановка IPInversion
    let textBinIPInversion = [];
    for (let i = 0; i < IPInversion.length; i++) {
        let value = IPInversion[i];
        textBinIPInversion.push(finalResult[value - 1]);
    }

    // вывод результата в десятичном, двоичном и в виде символов
    let resultDec = "";
    let resultBin = "";
    let result = "";
    let k = keyChar.join("");;
    for (let i = 0; i < textBinIPInversion.length; i++) {
        if (i % 8 == 0) {
            if (i > 0) {
                resultBin += ' ';
                resultDec += ' ';
            }
            let bits = textBinIPInversion.slice(i, i + 8);
            let bin = bits.join('');
            resultBin += bin;

            let num = parseInt(bin, 2);
            resultDec += num.toString().padStart(3, '0');
            result += asciiMap.get(num);
        }

    }
    resultOutputBin.innerHTML = resultBin;
    resultOutputDec.innerHTML = resultDec;
    resultOutput.innerHTML = result;

    keyOutput.innerHTML = k;
    keyOutputDec.innerHTML = keyDec2;

}

function decryptDES() {
    let originalText = textInput.value;
    let keyWord = keyInput.value;
    let originalTextBit = [];
    let decryptedTextResult = [];
    let keyBin = [];
    let keyChar = [];
    let keyDec = [];
    let keyDec2 = [];
    let keyBinPC1 = [];

    // проверка на длину введенного текста
    if (originalText.length !== 8) {
        resultOutput.innerHTML = "Введите текст из 8 символов";
        return;
    }

    // находим введённый текст в ascii и переводим в биты
    for (let i = 0; i < originalText.length; i++) {
        let charCode = findKeyByValue(asciiMap, originalText[i]);
        if (charCode === undefined) {
            resultOutput.innerHTML = `Символ ${originalText[i]} не поддерживается кодировкой Ascii`;
            return;
        }

        let binChar = decToBin(charCode);
        binChar.forEach(element => {
            originalTextBit.push(Number(element));
        });
    }
    console.log("Исходный текст в битах " + originalTextBit);

    if (keyWord === "") {
        resultOutput.innerHTML = "Введите ключ для расшифровки";
        return;
    } else {
        // проверяем длину ключа
        if (keyWord.length != 8) {
            resultOutput.innerHTML = "Длина ключа должна быть равна 8 символам";
            return;
        } else {
            for (let i = 0; i < keyWord.length; i++) {
                let userKey = findKeyByValue(asciiMap, keyWord[i]);
                if (userKey === undefined) {
                    resultOutput.innerHTML = `Символ ${keyWord[i]} не поддерживается кодировкой Ascii`;
                    return;
                }
                let bin = decToBin(userKey);
                keyChar.push(asciiMap.get(userKey));
                keyDec2.push(userKey);
                keyDec.push(bin);
            }
        }
    }

    // переводим ключ в двоичную систему
    keyDec.forEach(element => {
        for (let bit of element) {
            keyBin.push(Number(bit));
        }
    })
    console.log("ключ в двоичной системе " + keyBin);

    // перестановка РС-1
    for (let i = 0; i < PC1.length; i++) {
        let value = PC1[i];
        keyBinPC1.push(keyBin[value - 1]);
    }
    console.log("перестановка РС-1 " + keyBinPC1);

    // делим ключ на левую и правую часть
    let C0 = keyBinPC1.slice(0, 28);
    let D0 = keyBinPC1.slice(28, 56);

    // генерируем 16 ключей
    let keys16 = [];
    let currentC = C0.slice();
    let currentD = D0.slice();
    for (let i = 1; i <= 16; i++) {
        // сдвиг на 1 бит
        if (i == 1 || i == 2 || i == 9 || i == 16) {
            currentC = currentC.slice(1).concat(currentC.slice(0, 1));
            currentD = currentD.slice(1).concat(currentD.slice(0, 1));
        } else { // сдвиг на 2 бита
            currentC = currentC.slice(2).concat(currentC.slice(0, 2));
            currentD = currentD.slice(2).concat(currentD.slice(0, 2));
        }

        // объединяем массивы, делаем перестановку, сжимаем ключ до 48 битов
        let key = currentC.concat(currentD);
        let keyPC2 = [];
        for (let j = 0; j < PC2.length; j++) {
            let value = PC2[j];
            keyPC2.push(key[value - 1]);
        }
        keys16.push(keyPC2);
    }

    let numBlocks = originalTextBit.length / 64;

    for (let block = 0; block < numBlocks; block++) {

        let blockStart = block * 64;
        let blockEnd = (block + 1) * 64;
        let currentBlockBits = originalTextBit.slice(blockStart, blockEnd);

        // перестановка IP
        let encryptedTextIP = [];
        for (let i = 0; i < IP.length; i++) {
            let value = IP[i];
            encryptedTextIP.push(currentBlockBits[value - 1]);
        }

        // делим массив на левую и правую часть
        let L16 = encryptedTextIP.slice(0, 32);
        let R16 = encryptedTextIP.slice(32, 64);

        // расшифровка 16 раундов 
        let right = R16;
        let left = L16;

        for (let round = 16; round >= 1; round--) {
            let textBinE = [];

            // расширение правой части текста с 32 до 48 бит
            for (let i = 0; i < E.length; i++) {
                let value = E[i];
                textBinE.push(right[value - 1]);
            }

            let key = keys16[round - 1];

            // XOR
            let xorResult = [];
            for (let i = 0; i < textBinE.length; i++) {
                xorResult.push(textBinE[i] ^ key[i]);
            }

            // находим элемент в S таблице
            let sBlocks = [];
            for (let i = 0; i < 8; i++) {
                let bits6 = xorResult.slice(i * 6, (i + 1) * 6);
                let rowBits = bits6[0].toString() + bits6[5].toString();
                let row = parseInt(rowBits, 2);

                let columnBits = bits6[1].toString() + bits6[2].toString() + bits6[3].toString() + bits6[4].toString();
                let column = parseInt(columnBits, 2);

                let STableValue = S[i][row][column];
                let bits = STableValue.toString(2).padStart(4, '0').split('').map(Number)
                sBlocks.push(bits[0], bits[1], bits[2], bits[3]);
            }

            // перестановка P
            let textBinP = [];
            for (let i = 0; i < P.length; i++) {
                let value = P[i];
                textBinP.push(sBlocks[value - 1]);
            }

            // XOR с левой частью
            let newRight = [];
            for (let i = 0; i < 32; i++) {
                newRight.push(left[i] ^ textBinP[i]);
            }

            if (round > 1) {
                left = right;
                right = newRight;
            } else {
                left = newRight;
            }
        }

        // соединяем left и right
        let finalBlock = left.concat(right);

        // перестановка IPInversion (обратная IP)
        let textBinIPInversion = [];
        for (let i = 0; i < IPInversion.length; i++) {
            let value = IPInversion[i];
            textBinIPInversion.push(finalBlock[value - 1]);
        }

        decryptedTextResult = textBinIPInversion;
    }

    // вывод результата в десятичном, двоичном и в виде символов
    let resultDec = "";
    let resultBin = "";
    let result = "";
    let k = keyChar.join("");;
    for (let i = 0; i < decryptedTextResult.length; i++) {
        if (i % 8 == 0) {
            if (i > 0) {
                resultBin += ' ';
                resultDec += ' ';
            }
            let bits = decryptedTextResult.slice(i, i + 8);
            let bin = bits.join('');
            resultBin += bin;

            let num = parseInt(bin, 2);
            resultDec += num.toString().padStart(3, '0');

            result += asciiMap.get(num);
        }
    }

    resultOutputBin.innerHTML = resultBin;
    resultOutputDec.innerHTML = resultDec;
    resultOutput.innerHTML = result;

    keyOutput.innerHTML = k;
    keyOutputDec.innerHTML = keyDec2;
}

function decToBin(dec) {
    return dec.toString(2).padStart(8, "0").split("");
}

// функция для поиска ключа по значению
function findKeyByValue(map, searchValue) {
    for (const [key, value] of map.entries()) {
        if (value === searchValue)
            return key;
    }
    return undefined;
}

encryptButton.addEventListener('click', encryptDES);
decryptButton.addEventListener('click', decryptDES);
