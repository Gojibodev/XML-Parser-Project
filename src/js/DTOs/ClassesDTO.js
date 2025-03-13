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
        this.tags = [];
    }
}

class AnswerDTO {
    constructor(text, feedback) {
        this.text = text;
        this.feedback = feedback;
    }
}

class CategoryDTO {
    constructor() {
        this.type = "category";
        this.category = "";
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

class SubquestionDTO {
    constructor(text, answer) {
        this.text = text;
        this.answer = answer;
    }
}

class SubquestionsDTO {
    constructor(text) {
        this.text = text;
    }
}

class TagDTO {
    constructor(text) {
        this.text = text;
    }
}

class TrueFalseDTO {
    constructor() {
        this.type = "truefalse";
        this.answer = [];
    }
}