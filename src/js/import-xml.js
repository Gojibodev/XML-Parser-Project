// import-xml.js
import { initDB, saveToDB, getQuestions, updateQuestion, deleteQuestionsByFilename } from './db.js';
import { getQuestionObj, fillBasisDto } from './questionLogic.js';
import { editor } from './editor-parser.js';
import { setupUploadHandlers } from './upload-handler.js';

initDB(displayQuestions);

// Initialisiere Upload-Events
setupUploadHandlers(
    'file-input',
    'browse-btn',
    'upload-text',
    'upload-list',
    handleXmlFiles,
    deleteFileByName
);

function handleXmlFiles(files) {
    Array.from(files).forEach(file => {
        if (!file.name.endsWith('.xml')) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(e.target.result, "text/xml");
            populateXMLPreview(xmlDoc, file.name);
        };
        reader.readAsText(file);
    });
}

function populateXMLPreview(xmlDoc, filename) {
    const elements = xmlDoc.getElementsByTagName('question');

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const questionType = element.getAttribute('type');
        const questionContent = extractQuestionContent(element);
        const obj = getQuestionObj(questionType, questionContent);
        obj.originalXml = element.outerHTML;
        obj.selected = true;
        obj.sourceFileName = filename; // Datei-Name wird gespeichert

        saveToDB(obj).catch(err => console.error("Fehler beim Speichern:", err));
    }

    displayQuestions();
}

function extractQuestionContent(questionElement) {
    let content = {};
    for (let i = 0; i < questionElement.children.length; i++) {
        let child = questionElement.children[i];
        content[child.tagName] = child.innerHTML.trim();
    }
    return content;
}

export async function displayQuestions() {
    const selectionContainer = document.getElementById('selection-container');
    if (!selectionContainer) return;

    const questions = await getQuestions();
    clearSelectionContainer();

    questions.forEach((question, index) => {
        const div = document.createElement('div');
        div.classList.add('selection-elem');

        const checked = question.selected !== false ? 'checked' : '';
        const input = `<input type="checkbox" id="select-${index}" value="${index}" ${checked}>
` +
                      `<label for="select-${index}">${question.name || `Frage ${index + 1}`}</label><br>`;

        div.innerHTML = input + `<div class="subitems"><p><strong>Fragetext:</strong> ${question.questionText || 'Keine Frage vorhanden'}</p></div>`;
        selectionContainer.appendChild(div);
    });

    setTimeout(() => {
        const checkboxes = document.querySelectorAll('#selection-container input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', async (e) => {
                e.stopPropagation();
                const index = parseInt(checkbox.value);
                const isSelected = checkbox.checked;
                const questions = await getQuestions();
                questions[index].selected = isSelected;
                await updateQuestion(questions[index]);
                updateXmlOutput();
            });
        });

        setupSelectionElements();
        updateXmlOutput();
    }, 0);
}

function updateXmlOutput() {
    getQuestions().then(questions => {
        let outputLines = [];

        questions.forEach(question => {
            if (!question.originalXml) return;
            const xml = question.originalXml.trim();
            let lines = xml.split('\n');

            if (!question.selected) {
                lines = lines.map(line => `<!-- ${line} -->`);
            }

            outputLines.push(lines.join('\n'));
        });

        editor.setValue(outputLines.join('\n\n'));
    });
}

function clearSelectionContainer() {
    const selectionContainer = document.getElementById('selection-container');
    if (selectionContainer) {
        selectionContainer.innerHTML = `<h4>Elements to be included in the XML output:</h4><br>`;
    }
}

function deleteFileByName(filename) {
    deleteQuestionsByFilename(filename).then(() => {
        displayQuestions();
    });
}