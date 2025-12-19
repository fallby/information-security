const textInput = document.getElementById('text-input');
const resultOutput = document.getElementById('result-output');

const hashButton = document.getElementById("encrypt-button");

function MD5() {
    let originalText = textInput.value;

    let encoder = new TextEncoder();
    let bytes = encoder.encode(originalText);
    let textBytes = Array.from(bytes);
    let originalTextBytesLength = textBytes.length;
    let originalLengthInBits = originalTextBytesLength * 8;

    textBytes.push(0x80);

    while (textBytes.length % 64 !== 56) {
        textBytes.push(0);
    }

    let remainingBits = originalLengthInBits;
    for (let i = 0; i < 8; i++) {
        const byte = remainingBits % 256;
        textBytes.push(byte);
        remainingBits = Math.floor(remainingBits / 256);
    }

    let blocks = [];
    for (let i = 0; i < textBytes.length; i += 64) {
        let block = textBytes.slice(i, i + 64);
        blocks.push(block);
    }

    let T = [];
    for (let i = 1; i <= 64; i++) {
        T.push(Math.floor(Math.abs(Math.sin(i)) * Math.pow(2, 32)) % Math.pow(2, 32));
    }

    let M = [];
    if (blocks.length > 0) {
        let block = blocks[0];
        for (let i = 0; i < 64; i += 4) {
            let word = 0;
            for (let j = 0; j < 4; j++) {
                word += block[i + j] * Math.pow(256, j);
            }
            word = word % 4294967296;
            M.push(word);
        }
    }

    let A = 0x67452301;
    let B = 0xEFCDAB89;
    let C = 0x98BADCFE;
    let D = 0x10325476;

    let AA = A;
    let BB = B;
    let CC = C;
    let DD = D;

    for (let round = 0; round < 64; round++) {
        let result, wordIndex, shift;

        if (round < 16) {
            result = (B & C) | ((~B) & D);
            wordIndex = round;
            shift = [7, 12, 17, 22][round % 4];
        } else if (round >= 16 & round < 32) {
            result = (B & D) | ((~D) & C);
            wordIndex = (5 * round + 1) % 16;
            shift = [5, 9, 14, 20][round % 4];
        } else if (round >= 32 & round < 48) {
            result = B ^ C ^ D;
            wordIndex = (3 * round + 5) % 16;
            shift = [4, 11, 16, 23][round % 4];
        } else {
            result = C ^ ((~D) | B);
            wordIndex = (7 * round) % 16;
            shift = [6, 10, 15, 21][round % 4];
        }

        let temp = (A + result) % 4294967296;
        temp = (temp + M[wordIndex]) % 4294967296;
        temp = (temp + T[round]) % 4294967296;

        temp = temp % 4294967296;
        let leftShifted = (temp * Math.pow(2, shift)) % 4294967296;
        let overflowBits = Math.floor(temp / Math.pow(2, 32 - shift))
        temp = (leftShifted + overflowBits) % 4294967296;
        temp = (B + temp) % 4294967296;

        let newA = D;
        let newB = temp;
        let newC = B;
        let newD = C;

        A = newA;
        B = newB;
        C = newC;
        D = newD;
    }


    A = (A + AA) % 4294967296;
    B = (B + BB) % 4294967296;
    C = (C + CC) % 4294967296;
    D = (D + DD) % 4294967296;

    AA = A;
    BB = B;
    CC = C;
    DD = D;

    let hash = toHex(A) + toHex(B) + toHex(C) + toHex(D);

    let result = hash;
    resultOutput.innerHTML = result;
}

function toHex(num) {
    let result = "";
    for (let i = 0; i < 4; i++) {
        let byte = Math.floor(num / Math.pow(256, i)) % 256;
        result += byte.toString(16).padStart(2, '0');
    }
    return result;
}

hashButton.addEventListener('click', MD5);
