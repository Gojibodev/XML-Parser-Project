import { initDB, saveToDB, getQuestions, updateQuestion } from './db.js';
import { getQuestionObj, fillBasisDto } from './questionLogic.js';

const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', handleFileSelectImport, false);

initDB(displayQuestions);

function handleFileSelectImport(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(e.target.result, "text/xml");
            populateXMLPreview(xmlDoc);
        };
        reader.readAsText(file);
    }
}

function populateXMLPreview(xmlDoc) {
    const elements = xmlDoc.getElementsByTagName('question');

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const questionType = element.getAttribute('type');
        const questionContent = extractQuestionContent(element);
        const obj = getQuestionObj(questionType, questionContent);
        obj.originalXml = element.outerHTML;
        obj.selected = true;

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
                       <label for="select-${index}">${question.name || `Frage ${index + 1}`}</label><br>`;

        div.innerHTML = input + `<div class="subitems"><p><strong>Fragetext:</strong> ${question.questionText || 'Keine Frage vorhanden'}</p></div>`;
        selectionContainer.appendChild(div);
    });

    // Checkbox-Handler + XML aktualisieren
    setTimeout(() => {
        const checkboxes = document.querySelectorAll('#selection-container input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', async () => {
                const index = parseInt(checkbox.value);
                const isSelected = checkbox.checked;
                const questions = await getQuestions();
                questions[index].selected = isSelected;
                await updateQuestion(questions[index]);
                updateXmlOutput();
            });
        });
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