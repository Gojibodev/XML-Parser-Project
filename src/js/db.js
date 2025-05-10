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
        console.log('IndexedDB geöffnet.');
        if (callback) callback();
    };

    request.onerror = function (event) {
        console.error('Fehler beim Öffnen der Datenbank:', event.target.error);
    };
}

export async function deleteQuestionsByFilename(filename) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB nicht initialisiert");

        const tx = db.transaction('questions', 'readwrite');
        const store = tx.objectStore('questions');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
            const allQuestions = getAllRequest.result;
            const toDelete = allQuestions.filter(q => q.sourceFileName === filename);

            toDelete.forEach(q => {
                if (q.id !== undefined) store.delete(q.id);
            });

            tx.oncomplete = () => {
                console.log(`Gelöscht: ${toDelete.length} Fragen aus Datei "${filename}"`);
                resolve();
            };
        };

        getAllRequest.onerror = (event) => {
            console.error("Fehler beim Lesen:", event.target.error);
            reject(event.target.error);
        };
    });
}

export function saveToDB(questionObj) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB nicht initialisiert");

        const transaction = db.transaction(['questions'], 'readwrite');
        const store = transaction.objectStore('questions');
        const request = store.add(questionObj);

        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e);
    });
}

export function getQuestions() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['questions'], 'readonly');
        const store = transaction.objectStore('questions');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e);
    });
}

export function updateQuestion(questionObj) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['questions'], 'readwrite');
        const store = transaction.objectStore('questions');
        const request = store.put(questionObj);

        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e);
    });
}

export function deleteXmlFile(filename) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['questions'], 'readwrite');
        const objectStore = transaction.objectStore('questions');
        const request = objectStore.getAll();

        request.onsuccess = function () {
            const allQuestions = request.result;
            const matching = allQuestions.filter(q => q.sourceFile === filename);

            let deleteCount = 0;
            matching.forEach(q => {
                if (q.id !== undefined) {
                    objectStore.delete(q.id);
                    deleteCount++;
                }
            });

            transaction.oncomplete = () => {
                console.log(`Deleted ${deleteCount} questions from file ${filename}`);
                resolve();
            };
        };

        request.onerror = function (event) {
            console.error("Fehler beim Abrufen aus DB:", event.target.error);
            reject(event.target.error);
        };
    });
}