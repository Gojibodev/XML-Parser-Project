const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', handleFileSelectImport, false);

let db;
function initDB() {
    let request = window.indexedDB.open('questionsDB', 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains('questions')) {
            db.createObjectStore('questions', { keyPath: 'id', autoIncrement: true });
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log("IndexedDB erfolgreich geöffnet.");
        displayQuestions(); // Zeigt vorhandene Fragen beim Laden der Seite
    };

    request.onerror = function(event) {
        console.error('Fehler beim Öffnen der Datenbank:', event.target.error);
    };
}

initDB();

function handleFileSelectImport(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(e.target.result, "text/xml");
            populateXMLPreview(xmlDoc);
        };
        reader.readAsText(file);
    }
}

function populateXMLPreview(xmlDoc) {
    const XMLcontainer = editor.getTextArea();
    XMLcontainer.innerHTML = '';
    let xmlContent = "";
    let elements = xmlDoc.getElementsByTagName('question');

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        let questionType = element.getAttribute('type');
        let questionContent = extractQuestionContent(element);
        let obj = getQuestionObj(questionType, questionContent);
        saveToDB(obj);
        xmlContent += element.outerHTML;
    }

    editor.setValue(xmlContent);
    displayQuestions(); // Zeigt sofort die neuen Fragen
}

function extractQuestionContent(questionElement) {
    let content = {};
    
    for (let i = 0; i < questionElement.children.length; i++) {
        let child = questionElement.children[i];
        content[child.tagName] = child.innerHTML.trim();
    }
    return content;
}

function getQuestionObj(type, values) {
    let questionObj;

    if (type === "category") {
        questionObj = new CategoryDTO();
        questionObj.info = values.info;
        questionObj.category = values.category;
    } else if (type === "matching") {
        questionObj = new QuestionDTO();
        fillBasisDto(questionObj, values);
        questionObj.type = type;
        questionObj.correctfeedback = values.correctfeedback;
        questionObj.incorrectfeedback = values.incorrectfeedback;
        questionObj.partiallycorrectfeedback = values.partiallycorrectfeedback;
        questionObj.shuffleanswers = values.shuffleanswers;
        questionObj.subquestions = values.subquestion;
    } else if (type === "multichoice") {
        questionObj = new MultichoiceDTO();
        fillBasisDto(questionObj, values);
        questionObj.correctfeedback = values.correctfeedback;
        questionObj.incorrectfeedback = values.incorrectfeedback;
        questionObj.partiallycorrectfeedback = values.partiallycorrectfeedback;
        questionObj.shuffleanswers = values.shuffleanswers;
        questionObj.single = values.single;
        questionObj.answernumbering = values.answernumbering;
        questionObj.showstandardinstruction = values.showstandardinstruction;
        questionObj.answer = values.answer;
    } else if (type === "truefalse") {
        questionObj = new TrueFalseDTO();
        fillBasisDto(questionObj, values);
        questionObj.answer = values.answer;
    } else {
        throw("Unbekannter Question Type gefunden: " + type);
    }
    
    return questionObj;
}

function saveToDB(questionObj) {
    if (!db) {
        console.error("Datenbank nicht initialisiert.");
        return;
    }

    let transaction = db.transaction(['questions'], 'readwrite');
    let objectStore = transaction.objectStore('questions');
    let request = objectStore.add(questionObj);

    request.onsuccess = function() {
        console.log("Frage erfolgreich gespeichert.");
        displayQuestions();
    };

    request.onerror = function(event) {
        console.error("Fehler beim Speichern der Frage:", event.target.error);
    };
}

function fillBasisDto(basisobj, value) {
    basisobj.name = value.name;
    basisobj.questionText = value.questiontext;
    basisobj.generalfeedback = value.generalfeedback;
    basisobj.defaultgrade = value.defaultgrade;
    basisobj.penalty = value.penalty;
    basisobj.hidden = value.hidden;
    basisobj.idnumber = value.idnumber;
    basisobj.tags = value.tags;
}

function removeTags(value) {
    return value.replace(/<\/?[^>]+>/g, "");
}

async function displayQuestions() {
    const selectionContainer = document.getElementById('selection-container');
    if (!selectionContainer) {
        console.error("selection-container nicht gefunden!");
        return;
    }

    try {
        const questions = await getQuestions();

        clearSelectionContainer();

        questions.forEach((question, index) => {
            const div = document.createElement('div');
            div.classList.add('selection-elem');

            let questionObj = getQuestionObj(question.type, question)

            if (questionObj.type == 'category') {
                div.innerHTML = getCategoryHtml(questionObj, index);
            } else if (questionObj.type == 'matching') {
                div.innerHTML = getMatchingHtml(questionObj, index);
            } else if (questionObj.type == 'multichoice') {
                div.innerHTML = getMulitchoiceHtml(questionObj, index);
            } else if (questionObj.type == 'truefalse') {
                div.innerHTML = getTruefalseHtml(questionObj, index);
            }

            selectionContainer.appendChild(div);
        });
    } catch (error) {
        console.error("Fehler beim Laden der Fragen:", error);
    }
}

function getCategoryHtml(categoryObj, index) {
    return `<input type="checkbox" id="select-${index}" name="select-${index}" value="${index}">
                <label for="select-${index}">${categoryObj.info || `Frage ${index + 1}`}</label>
                <br>
                <div class="subitems">
                    <p><strong>Fragetext:</strong> ${categoryObj.questionText || 'Keine Frage vorhanden'}</p>
                    <p><strong>Antwort:</strong> ${categoryObj.answer || 'Keine Antwort'}</p>
                </div>`;
}

function getMatchingHtml(matchingObj, index) {
    return `
                <input type="checkbox" id="select-${index}" name="select-${index}" value="${index}">
                <label for="select-${index}">${matchingObj.name || `Frage ${index + 1}`}</label>
                <br>
                <div class="subitems">
                    <p><strong>Fragetext:</strong> ${matchingObj.questionText || 'Keine Frage vorhanden'}</p>
                    <p><strong>Antwort:</strong> ${matchingObj.answer || 'Keine Antwort'}</p>
                </div>`;
}

function getMulitchoiceHtml(multichoiceObj, index) {
    return `
                <input type="checkbox" id="select-${index}" name="select-${index}" value="${index}">
                <label for="select-${index}">${multichoiceObj.name || `Frage ${index + 1}`}</label>
                <br>
                <div class="subitems">
                    <p><strong>Fragetext:</strong> ${multichoiceObj.questionText || 'Keine Frage vorhanden'}</p>
                    <p><strong>Antwort:</strong> ${multichoiceObj.answer || 'Keine Antwort'}</p>
                </div>`;
}

function getTruefalseHtml(truefalseObj, index) {
    return `
                <input type="checkbox" id="select-${index}" name="select-${index}" value="${index}">
                <label for="select-${index}">${truefalseObj.name || `Frage ${index + 1}`}</label>
                <br>
                <div class="subitems">
                    <p><strong>Fragetext:</strong> ${truefalseObj.questionText || 'Keine Frage vorhanden'}</p>
                    <p><strong>Antwort:</strong> ${truefalseObj.answer || 'Keine Antwort'}</p>
                </div>`;
}

function clearSelectionContainer() {
    const selectionContainer = document.getElementById('selection-container');
    if (selectionContainer) {
        selectionContainer.innerHTML = `<h4>Elements to be included in the XML output:</h4><br>`;
    }
}

async function getQuestions() {
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(['questions'], 'readonly');
        let objectStore = transaction.objectStore('questions');
        let request = objectStore.getAll();

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function (event) {
            reject('Fehler beim Abrufen der Fragen: ' + event.target.error);
        };
    });
}
