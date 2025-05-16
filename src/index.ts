
export function compareStrings(str1: string, str2: string): number {
    if (typeof str1 !== "string" || typeof str2 !== "string") {
        throw new TypeError("Both inputs must be strings");
    }
    if (!str1 || !str2) {
        throw new Error("Both strings must be non-empty");
    }

    const length1 = str1.length;
    const length2 = str2.length;
    const maxLength = Math.max(length1, length2);

    if (maxLength === 0) {
        return 1.0; // Both strings are empty
    }

    const distance = levenshteinDistance(str1, str2);
    return (maxLength - distance) / maxLength;
}

export function batchCompareStrings(target: string, candidates: string[]): { candidate: string; similarity: number }[] {
    if (typeof target !== "string" || !Array.isArray(candidates)) {
        throw new TypeError("Target must be a string and candidates must be an array of strings");
    }
    if (!target || candidates.length === 0) {
        throw new Error("Target string must be non-empty and candidates array must not be empty");
    }

    return candidates.map(candidate => ({
        candidate,
        similarity: compareStrings(target, candidate),
    }));
}

export function findMatchesAboveThreshold(target: string, candidates: string[], threshold: number): string[] {
    if (typeof target !== "string" || !Array.isArray(candidates)) {
        throw new TypeError("Target must be a string and candidates must be an array of strings");
    }
    if (!target || candidates.length === 0) {
        throw new Error("Target string must be non-empty and candidates array must not be empty");
    }

    return candidates.filter(candidate => compareStrings(target, candidate) >= threshold);
}

export function jaroWinklerDistance(str1: string, str2: string): number {
    if (!str1 || !str2) {
        throw new Error("Both strings must be provided");
    }

    const m = getMatchingCharacters(str1, str2);
    if (m === 0) return 0;

    const t = getTranspositions(str1, str2, m);
    const jaro = (m / str1.length + m / str2.length + (m - t) / m) / 3;

    const prefixLength = getCommonPrefixLength(str1, str2);
    const scalingFactor = 0.1; // Default scaling factor
    return jaro + Math.min(prefixLength, 4) * scalingFactor * (1 - jaro);
}

export function cosineSimilarity(str1: string, str2: string): number {
    if (!str1 || !str2) {
        throw new Error("Both strings must be provided");
    }

    const vector1 = getCharacterFrequencyVector(str1);
    const vector2 = getCharacterFrequencyVector(str2);

    const dotProduct = vector1.reduce((sum, val, i) => sum + (vector2[i] || 0) * val, 0);
    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));

    return magnitude1 === 0 || magnitude2 === 0 ? 0 : dotProduct / (magnitude1 * magnitude2);
}

export function diceCoefficient(str1: string, str2: string): number {
    if (!str1 || !str2) {
        throw new Error("Both strings must be provided");
    }

    const bigrams1 = getBigrams(str1);
    const bigrams2 = getBigrams(str2);

    const intersection = bigrams1.filter(bigram => bigrams2.includes(bigram)).length;
    return (2 * intersection) / (bigrams1.length + bigrams2.length);
}

function levenshteinDistance(a: string, b: string): number {
    const aArray = Array.from(a);
    const bArray = Array.from(b);

    if (aArray.length === 0) return bArray.length;
    if (bArray.length === 0) return aArray.length;

    let previousRow = Array(bArray.length + 1).fill(0).map((_, i) => i);
    let currentRow = Array(bArray.length + 1).fill(0);

    for (let i = 1; i <= aArray.length; i++) {
        currentRow[0] = i;
        for (let j = 1; j <= bArray.length; j++) {
            const cost = aArray[i - 1] === bArray[j - 1] ? 0 : 1;
            currentRow[j] = Math.min(
                previousRow[j] + 1, // Deletion
                currentRow[j - 1] + 1, // Insertion
                previousRow[j - 1] + cost // Substitution
            );
        }
        [previousRow, currentRow] = [currentRow, previousRow];
    }

    return previousRow[bArray.length];
}

function getMatchingCharacters(str1: string, str2: string): number {
    const str1Array = Array.from(str1);
    const str2Array = Array.from(str2);

    const matchWindow = Math.floor(Math.max(str1Array.length, str2Array.length) / 2) - 1;
    const matches1 = Array(str1Array.length).fill(false);
    const matches2 = Array(str2Array.length).fill(false);

    let matches = 0;
    for (let i = 0; i < str1Array.length; i++) {
        const start = Math.max(0, i - matchWindow);
        const end = Math.min(i + matchWindow + 1, str2Array.length);

        for (let j = start; j < end; j++) {
            if (!matches2[j] && str1Array[i] === str2Array[j]) {
                matches1[i] = true;
                matches2[j] = true;
                matches++;
                break;
            }
        }
    }

    return matches;
}

function getTranspositions(str1: string, str2: string, matches: number): number {
    const matched1 = [];
    const matched2 = [];

    for (let i = 0; i < str1.length; i++) {
        if (matches > 0 && str1[i] === str2[i]) {
            matched1.push(str1[i]);
            matched2.push(str2[i]);
        }
    }

    let transpositions = 0;
    for (let i = 0; i < matched1.length; i++) {
        if (matched1[i] !== matched2[i]) {
            transpositions++;
        }
    }

    return transpositions / 2;
}

function getCommonPrefixLength(str1: string, str2: string): number {
    let prefixLength = 0;
    for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
        if (str1[i] === str2[i]) {
            prefixLength++;
        } else {
            break;
        }
    }
    return prefixLength;
}

function getCharacterFrequencyVector(str: string): number[] {
    const frequency: { [key: string]: number } = {};
    for (const char of str) {
        frequency[char] = (frequency[char] || 0) + 1;
    }
    return Object.values(frequency);
}

function getBigrams(str: string): string[] {
    const strArray = Array.from(str);
    const bigrams = [];
    for (let i = 0; i < strArray.length - 1; i++) {
        bigrams.push(strArray[i] + strArray[i + 1]);
    }
    return bigrams;
}
