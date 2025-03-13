document.getElementById('fileinput').addEventListener('change', handleFileSelect, false);

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
    if (type === 'category') {
        let cat = new CategoryDTO();
        cat.info = values.info;
        cat.category = values.category;
    } else if (type === "matching") {
        let matching = new QuestionDTO(); 
        fillBasisDto(matching, values);
        matching.type = type;
        matching.correctfeedback = values.correctfeedback;
        matching.incorrectfeedback = values.incorrectfeedback;
        matching.partiallycorrectfeedback = values.partiallycorrectfeedback;
        matching.shuffleanswers = values.shuffleanswers;
        matching.subquestions = values.subquestion;
    } else if (type === "multichoice") {
        let multichoice = new MultichoiceDTO();
        fillBasisDto(multichoice, values);
        multichoice.correctfeedback = values.correctfeedback;
        multichoice.incorrectfeedback = values.incorrectfeedback;
        multichoice.partiallycorrectfeedback = values.partiallycorrectfeedback;
        multichoice.shuffleanswers = values.shuffleanswers;
        multichoice.single = values.single;
        multichoice.answernumbering = values.answernumbering;
        multichoice.showstandardinstruction = values.showstandardinstruction;
        multichoice.answer = values.answer;
    } else if (type === "truefalse") {
        let truefalse = new TrueFalseDTO();
        fillBasisDto(truefalse, values);
        truefalse.answer = values.answer;
    } else {
        throw("Unbekannter Question Type gefunden: " + type);
    }
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

function addToEditor(xmlObj){
    editor.setValue(editor.getValue() + xmlObj.outerHTML);
}