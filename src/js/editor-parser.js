document.getElementById('fileinput').addEventListener('change', handleFileSelect, false);

var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "xml",
    theme: "dracula", // Change theme if needed
    lineNumbers: true,
    autoCloseTags: true
});

function handleFileSelect(event) {
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
    console.log(xmlDoc);
    console.log(editor);
    console.log(editor.getTextArea());
    const XMLcontainer = editor.getTextArea();
    XMLcontainer.innerHTML = '';
    let xmlContent = "";
    const elements = xmlDoc.getElementsByTagName('question');
    
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
    console.log("Checking question type:", type);
    console.log("Values:", values);

    if (type === 'category') {
        let cat = new CategoryDTO();
        cat.info = values.getElementsByTagName("");
        console.log("Processing category question...");
    } else if (type === "matching") {
        console.log("Processing matching question...");
    } else if (type === "multichoice") {
        console.log("Processing multichoice question...");
    } else if (type === "truefalse") {
        console.log("Processing true/false question...");
    } else {
        console.log("Unbekannter Question Type gefunden: " + type);
    }
}

class QuestionDTO {
    constructor() {
        this.type = "";
        this.name = "";
        this.questionText = "";
        this.generalfeedback = "";
        this.defaultgrade = 0;
        this.penalty = 0;
        this.hidden = 0;
        this.idnumber = 0;
        this.shuffleanswers = true;
        this.correctfeedback = "";
        this.partiallycorrectfeedback = "";
        this.incorrectfeedback = "";
        this.subquestions = [];
        this.tags = [];
    }
}

class CategoryDTO extends QuestionDTO {
    constructor() {
        super();
        this.type = "category";
        this.info = "";
    }
}

class MultichoiceDTO extends QuestionDTO {
    constructor() {
        super();
        this.type = "multichoice";
        this.single = false;
        this.answernumbering = "";
        this.showstandardinstruction = 0;
        this.answer = [];
    }
}

class TrueFalseDTO {
    constructor() {
        super();
        this.type = "truefalse";
        this.answer = [];
    }
}

class AnswerDTO {
    constructor(text, feedback) {
        this.text = text;
        this.feedback = feedback;
    }
}

class SubquestionsDTO {
    constructor(text) {
        this.text = text;
    }
}

class SubquestionDTO {
    constructor(text, answer) {
        this.text = text;
        this.answer = answer;
    }
}

class TagDTO {
    constructor(text) {
        this.text = text;
    }
}

function addToEditor(xmlObj){
    editor.setValue(editor.getValue() + xmlObj.outerHTML);
}