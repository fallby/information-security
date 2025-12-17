const textInput = document.getElementById('text-input');
const resultOutput = document.getElementById('result-output');
const keyInputOpen = document.getElementById('key-input-open');
const keyOutputOpen = document.getElementById('key-output-open');
const keyInputClose = document.getElementById('key-input-close');
const keyOutputClose = document.getElementById('key-output-close');

const encryptButton = document.getElementById("encrypt-button");
const decryptButton = document.getElementById("decrypt-button");

function encryptRSA() {
    const originalText = textInput.value;
    let openKey = [];
    let closeKey = [];

    if (originalText == "") {
        resultOutput.innerHTML = "Введите текст";
        return;
    }

    // получаем введенные пользователем p q и проверяем простые ли они
    const p = Number(keyInputOpen.value);
    const q = Number(keyInputClose.value);

    if (!p || !q) {
        resultOutput.innerHTML = "Введите значения p и q";
        return;
    }

    if (p === q) {
        resultOutput.innerHTML = "Числа p и q должны быть разными";
        return;
    }

    if (!checkSimple(p)) {
        resultOutput.innerHTML = `Число "${p}" не простое`;
        return;
    }
    if (!checkSimple(q)) {
        resultOutput.innerHTML = `Число "${q}" не простое`;
        return;
    }

    // вычисляем их произведение N
    const N = p * q;
    
    // вычисляем функцию эйлера
    const EilerFunction = (p - 1) * (q - 1);
    
    // выбираем e
    let e = 0;
    for (let i = 3; i < EilerFunction; i += 2) {
        if (NOD(i, EilerFunction) === 1) {
            e = i;
            break;
        }
    }

    // считаем d
    const result = extendedEuclideanAlgorithm(EilerFunction, e);
    let y = result[1];
    let d = y % EilerFunction;
    if (d < 0) d += EilerFunction;
    
    if ((e * d) % EilerFunction !== 1) {
        resultOutput.innerHTML = "d не является обратным к e";
        return;
    }

    // открытый и закрытый ключи
    openKey = [e, N];
    closeKey = [d, N];

    // зашифровка
    const encryptedText = [];
    for (let i = 0; i < originalText.length; i++) {
        const charCode = originalText.charCodeAt(i); 
        
        const encrypted = modPow(charCode, e, N);
        encryptedText.push(encrypted);
    }

    // вывод результатов 
    resultOutput.innerHTML = encryptedText;
    keyOutputOpen.innerHTML = openKey;
    keyOutputClose.innerHTML = closeKey;
}

function decryptRSA() {
    const encryptedText = textInput.value.trim();
    let openKey = [];
    let closeKey = [];

    if (!encryptedText) {
        resultOutput.innerHTML = "Введите зашифрованный текст (массив чисел)";
        return;
    }

    // получаем введенные пользователем p q и проверяем простые ли они
    const p = Number(keyInputOpen.value);
    const q = Number(keyInputClose.value);

    if (!p || !q) {
        resultOutput.innerHTML = "Введите значения p и q";
        return;
    }

    if (p === q) {
        resultOutput.innerHTML = "Числа p и q должны быть разными";
        return;
    }

    if (!checkSimple(p)) {
        resultOutput.innerHTML = `Число "${p}" не простое`;
        return;
    }
    if (!checkSimple(q)) {
        resultOutput.innerHTML = `Число "${q}" не простое`;
        return;
    }

    // вычисляем их произведение N
    const N = p * q;
    
    // вычисляем функцию эйлера
    const EilerFunction = (p - 1) * (q - 1);
    
    // выбираем e
    let e = 0;
    for (let i = 3; i < EilerFunction; i += 2) {
        if (NOD(i, EilerFunction) === 1) {
            e = i;
            break;
        }
    }

    // считаем d
    const result = extendedEuclideanAlgorithm(EilerFunction, e);
    let y = result[1];
    let d = y % EilerFunction;
    if (d < 0) d += EilerFunction;

    if ((e * d) % EilerFunction !== 1) {
        resultOutput.innerHTML = "Ошибка: неверный закрытый ключ";
        return;
    }

    openKey = [e, N];
    closeKey = [d, N];

    const encryptedBlocks = encryptedText.split(',').map(block => {
        const trimmed = block.trim();
        return trimmed ? Number(trimmed) : null;
    }).filter(block => block !== null);

    // расшифровываем каждый блок
    const decryptedText = [];
    
    for (let i = 0; i < encryptedBlocks.length; i++) {
        const decryptedCode = modPow(encryptedBlocks[i], d, N);
        
        decryptedText.push(String.fromCharCode(decryptedCode));
    }

    // вывод результатов
    resultOutput.innerHTML = decryptedText.join('');
    keyOutputOpen.innerHTML = openKey;
    keyOutputClose.innerHTML = closeKey;
}

function checkSimple(a) {
    if (a <= 1) return false;
    if (a === 2) return true;
    if (a % 2 === 0) return false;
    
    for (let i = 3; i <= Math.sqrt(a); i += 2) {
        if (a % i === 0) return false;
    }
    return true;
}

function NOD(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function extendedEuclideanAlgorithm(a, b) {
    let x1 = 0;
    let x2 = 1;
    let y1 = 1;
    let y2 = 0;
    let q, r, x, y;
    
    while (b > 0) {
        q = Math.floor(a / b);
        r = a - q * b;
        x = x2 - q * x1;
        y = y2 - q * y1;
        a = b;
        b = r;
        x2 = x1;
        x1 = x;
        y2 = y1;
        y1 = y;
    }
    return [x2, y2];
}

function modPow(base, exponent, modulus) {
    if (modulus === 1) return 0;
    
    let result = 1n;
    base = BigInt(base) % BigInt(modulus);
    exponent = BigInt(exponent);
    modulus = BigInt(modulus);
    
    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = (result * base) % modulus;
        }
        exponent = exponent / 2n;
        base = (base * base) % modulus;
    }
    
    return Number(result);
}

encryptButton.addEventListener('click', encryptRSA);
decryptButton.addEventListener('click', decryptRSA);