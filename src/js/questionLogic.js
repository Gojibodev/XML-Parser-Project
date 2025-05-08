export function fillBasisDto(basisobj, value) {
    basisobj.name = value.name;
    basisobj.questionText = value.questiontext;
    basisobj.generalfeedback = value.generalfeedback;
    basisobj.defaultgrade = value.defaultgrade;
    basisobj.penalty = value.penalty;
    basisobj.hidden = value.hidden;
    basisobj.idnumber = value.idnumber;
    basisobj.tags = value.tags;
}

export function getQuestionObj(type, values) {
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
        throw("Unbekannter Question Type: " + type);
    }

    return questionObj;
}