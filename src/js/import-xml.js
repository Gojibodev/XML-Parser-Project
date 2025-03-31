const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', handleFileSelectImport, false);

// IndexedDB Initialisierung
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
    
    console.log(elements);



    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        let questionType = element.getAttribute('type');
        let questionContent = extractQuestionContent(element);
        proofQuestionType(questionType, questionContent);
        xmlContent += element.outerHTML;
    }

    editor.setValue(xmlContent);
}

function extractQuestionContent(questionElement) {
    let content = {};
    
    for (let i = 0; i < questionElement.children.length; i++) {
        let child = questionElement.children[i];
        content[child.tagName] = child.innerHTML.trim();
    }
    return content;
}

function proofQuestionType(type, values) {
    let questionObj;

    if (type === 'category') {
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
    
    saveToDB(questionObj);
}

function saveToDB(questionObj) {
    if (!db) {
        console.error("Datenbank nicht initialisiert");
        return;
    }

    let transaction = db.transaction(['questions'], 'readwrite');
    let objectStore = transaction.objectStore('questions');
    let request = objectStore.add(questionObj);

    request.onsuccess = function() {
        console.log("Frage erfolgreich gespeichert.");
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

function addToEditor(xmlObj) {
    editor.setValue(editor.getValue() + xmlObj.outerHTML);
}