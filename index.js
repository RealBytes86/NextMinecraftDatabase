// Beispiel-Dokumente als JSON-Objekte
const documents = [
    { id: 1, content: "Dies ist ein Beispieltext über das Vektorraummodell." },
    { id: 2, content: "Das Vektorraummodell ermöglicht die Textsuche." },
    { id: 3, content: "Textsuche ist in vielen Anwendungen nützlich." }
];

// Funktion zum Tokenisieren des Texts
function tokenize(text) {
    return text.toLowerCase().split(/\W+/).filter(word => word.length > 0);
}

// Funktion zur Erstellung der TF-IDF-Vektoren
function createTFIDFVectors(documents) {
    const vocabulary = new Set();
    const documentVectors = [];

    documents.forEach(document => {
        const tokens = tokenize(document.content);
        tokens.forEach(token => vocabulary.add(token));

        const tfidfVector = {};
        tokens.forEach(token => {
            if (!tfidfVector[token]) {
                tfidfVector[token] = 0;
            }
            tfidfVector[token]++;
        });

        documentVectors.push({ id: document.id, vector: tfidfVector });
    });

    return { vocabulary: Array.from(vocabulary), vectors: documentVectors };
}

// Funktion zur Berechnung der Kosinus-Ähnlichkeit
function cosineSimilarity(vector1, vector2) {
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (const token in vector1) {
        dotProduct += vector1[token] * (vector2[token] || 0);
        magnitude1 += Math.pow(vector1[token], 2);
    }

    for (const token in vector2) {
        magnitude2 += Math.pow(vector2[token], 2);
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    return dotProduct / (magnitude1 * magnitude2);
}

// Vektorraummodell anwenden
const { vocabulary, vectors } = createTFIDFVectors(documents);
const query = "Vektorraummodell Text";

const queryVector = {};
tokenize(query).forEach(token => {
    if (!queryVector[token]) {
        queryVector[token] = 0;
    }
    queryVector[token]++;
});

const queryTFIDFVector = {};
for (const token in queryVector) {
    if (vocabulary.includes(token)) {
        queryTFIDFVector[token] = (queryVector[token] / tokenize(query).length);
    }
}

const similarities = vectors.map(vector => ({
    id: vector.id,
    similarity: cosineSimilarity(queryTFIDFVector, vector.vector)
}));

console.log("Ähnlichkeiten:", similarities);
