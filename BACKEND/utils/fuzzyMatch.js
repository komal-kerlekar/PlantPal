// utils/fuzzyMatch.js

const knownPlants = [
    "aloe vera",
    "snake plant",
    "money plant",
    "peace lily",
    "monstera deliciosa",
    "pothos",
    "areca palm",
];

function normalize(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

// Levenshtein Distance Algorithm (lightweight)
function levenshtein(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

function fuzzyMatch(input) {
    const cleanedInput = normalize(input);

    let bestMatch = input;
    let smallestDistance = Infinity;

    for (let plant of knownPlants) {
        const cleanedPlant = normalize(plant);

        const distance = levenshtein(cleanedInput, cleanedPlant);

        if (distance < smallestDistance) {
            smallestDistance = distance;
            bestMatch = plant;
        }
    }

    // Threshold: allow small typos only
    if (smallestDistance <= 2) {
        return bestMatch;
    }

    return input;
}

module.exports = { fuzzyMatch };