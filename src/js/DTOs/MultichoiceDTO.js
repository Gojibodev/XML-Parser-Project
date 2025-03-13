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