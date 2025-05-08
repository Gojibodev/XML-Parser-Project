let db;

export function initDB(callback) {
    const request = indexedDB.open('questionsDB', 1);

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains('questions')) {
            db.createObjectStore('questions', { keyPath: 'id', autoIncrement: true });
        }
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("IndexedDB erfolgreich geöffnet.");
        if (callback) callback();
    };

    request.onerror = function (event) {
        console.error('Fehler beim Öffnen der Datenbank:', event.target.error);
    };
}

export function saveToDB(questionObj) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("Datenbank nicht initialisiert.");

        const tx = db.transaction(['questions'], 'readwrite');
        const store = tx.objectStore('questions');
        const req = store.add(questionObj);

        req.onsuccess = () => resolve();
        req.onerror = (e) => reject(e.target.error);
    });
}

export function updateQuestion(indexedQuestion) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("Datenbank nicht initialisiert.");
        const tx = db.transaction(['questions'], 'readwrite');
        const store = tx.objectStore('questions');
        const req = store.put(indexedQuestion);
        req.onsuccess = () => resolve();
        req.onerror = (e) => reject(e.target.error);
    });
}

export function getQuestions() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['questions'], 'readonly');
        const store = tx.objectStore('questions');
        const req = store.getAll();

        req.onsuccess = () => resolve(req.result);
        req.onerror = (e) => reject(e.target.error);
    });
}

export function clearQuestions() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['questions'], 'readwrite');
        const store = tx.objectStore('questions');
        const req = store.clear();

        req.onsuccess = () => resolve();
        req.onerror = (e) => reject(e.target.error);
    });
}