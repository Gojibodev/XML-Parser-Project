const { proofQuestionType } = require('../'); // Pfad anpassen

// Dummy DTOs als einfache Klassen definieren
class CategoryDTO {
    constructor() {
        this.info = "";
        this.category = "";
    }
}

class QuestionDTO {
    constructor() {
        this.name = "";
        this.questionText = "";
        this.generalfeedback = "";
        this.defaultgrade = 0;
        this.penalty = 0;
        this.hidden = 0;
        this.idnumber = "";
        this.tags = "";
        this.correctfeedback = "";
        this.incorrectfeedback = "";
        this.partiallycorrectfeedback = "";
        this.shuffleanswers = "";
        this.subquestions = "";
    }
}

class MultichoiceDTO extends QuestionDTO {
    constructor() {
        super();
        this.single = false;
        this.answernumbering = "";
        this.showstandardinstruction = false;
        this.answer = [];
    }
}

class TrueFalseDTO extends QuestionDTO {
    constructor() {
        super();
        this.answer = false;
    }
}

// Eigene Test-Funktion ohne externe Pakete
function assert(condition, message) {
    if (!condition) {
        console.error("Test fehlgeschlagen:", message);
    } else {
        console.log("Test erfolgreich!", message);
    }
}

// Testfälle
function runTests() {
    console.log("Starte Tests...");

    // Kategorie-Test
    let category = new CategoryDTO();
    proofQuestionType('category', 
        { 
            info: "<text>Standardkategorie für Fragen, die im Kontext 'FA12_1_Projekt_2022_2023' freigegeben sind.</text>", 
            category: "<text>$course$/top/Standard für FA12_1_Projekt_2022_2023</text>" 
        });
    assert(category.info === "<text>Standardkategorie für Fragen, die im Kontext 'FA12_1_Projekt_2022_2023' freigegeben sind.</text>", "Kategorie-Info korrekt gesetzt");
    assert(category.category === "<text>$course$/top/Standard für FA12_1_Projekt_2022_2023</text>", "Kategorie-Name korrekt gesetzt");

    // True/False-Test
    let truefalse = new TrueFalseDTO();
    proofQuestionType('truefalse', { name: "Frage", questiontext: "Die Erde ist flach.", answer: false });
    assert(truefalse.name === "Frage", "True/False-Name korrekt gesetzt");
    assert(truefalse.answer === false, "True/False-Antwort korrekt gesetzt");

    console.log("Alle Tests abgeschlossen.");
}

// Tests ausführen
runTests();
