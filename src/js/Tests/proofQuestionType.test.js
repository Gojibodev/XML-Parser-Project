const { proofQuestionType, fillBasisDto } = require('./TestFiles/quiz.xml'); // Passe den Pfad an
const { CategoryDTO, QuestionDTO, MultichoiceDTO, TrueFalseDTO } = require('../yourDTOs'); // Falls nötig, DTOs importieren

describe('proofQuestionType', () => {
    test('Kategorie wird korrekt befüllt', () => {
        const values = { 
            info: "<text>Standardkategorie für Fragen, die im Kontext 'FA12_1_Projekt_2022_2023' freigegeben sind.</text>", 
            category: "<text>$course$/top/Standard für FA12_1_Projekt_2022_2023</text>" };
        let category = new CategoryDTO();
        
        proofQuestionType('category', values);
        
        expect(category.info).toBe(values.info);
        expect(category.category).toBe(values.category);
    });

    test('Matching wird korrekt befüllt', () => {
        const values = {
            name: "<text>Zuordnung Arbeiten mit Frameworks und ohne</text>",
            questiontext: `<text><![CDATA[<p dir="ltr" style="text-align: left;">Ordnen Sie folgende Begriffe zu!</p>]]></text>`,
            generalfeedback: `<text></text>`,
            defaultgrade: 1.0000000,
            penalty: 0.3333333,
            hidden: 0,
            idnumber: "",
            tags: "<tag><text>gln</text></tag>",
            correctfeedback: "<text>Die Antwort ist richtig.</text>",
            incorrectfeedback: "<text>Die Antwort ist falsch.</text>",
            partiallycorrectfeedback: "<text>Die Antwort ist teilweise richtig.</text>",
            shuffleanswers: "<shuffleanswers>true</shuffleanswers>",
            subquestion: `<text><![CDATA[<p dir="ltr" style="text-align: left;">Konsistenz<br></p>]]></text><answer><text>mit Framework</text></answer>`
        };
        
        let matching = new QuestionDTO();
        proofQuestionType('matching', values);
        
        expect(matching.name).toBe(values.name);
        expect(matching.questionText).toBe(values.questiontext);
        expect(matching.generalfeedback).toBe(values.generalfeedback);
        expect(matching.defaultgrade).toBe(values.defaultgrade);
        expect(matching.penalty).toBe(values.penalty);
        expect(matching.hidden).toBe(values.hidden);
        expect(matching.idnumber).toBe(values.idnumber);
        expect(matching.tags).toEqual(values.tags);
        expect(matching.correctfeedback).toBe(values.correctfeedback);
        expect(matching.incorrectfeedback).toBe(values.incorrectfeedback);
        expect(matching.partiallycorrectfeedback).toBe(values.partiallycorrectfeedback);
        expect(matching.shuffleanswers).toBe(values.shuffleanswers);
        expect(matching.subquestions).toEqual(values.subquestion);
    });

    test('Multichoice wird korrekt befüllt', () => {
        const values = {
            name: "<text>Aussagen zu PHP</text>",
            questiontext: `<text><![CDATA[<p dir="ltr" style="text-align: left;">Welche Aussagen über PHP sind richtig?</p><p dir="ltr" style="text-align: left;">PHP ist ...<br></p>]]></text>`,
            generalfeedback: "<text></text>",
            defaultgrade: 2.0000000,
            penalty: 0.3,
            hidden: 0,
            idnumber: 0,
            tags: "<tag><text>gln</text></tag>",
            correctfeedback: 'Gut gemacht!',
            incorrectfeedback: 'Leider falsch.',
            partiallycorrectfeedback: 'Nicht ganz!',
            shuffleanswers: true,
            single: false,
            answernumbering: 'ABC',
            showstandardinstruction: true,
            answer: ['Berlin', 'München', 'Hamburg']
        };

        let multichoice = new MultichoiceDTO();
        proofQuestionType('multichoice', values);

        expect(multichoice.name).toBe(values.name);
        expect(multichoice.questionText).toBe(values.questiontext);
        expect(multichoice.generalfeedback).toBe(values.generalfeedback);
        expect(multichoice.defaultgrade).toBe(values.defaultgrade);
        expect(multichoice.penalty).toBe(values.penalty);
        expect(multichoice.hidden).toBe(values.hidden);
        expect(multichoice.idnumber).toBe(values.idnumber);
        expect(multichoice.tags).toEqual(values.tags);
        expect(multichoice.correctfeedback).toBe(values.correctfeedback);
        expect(multichoice.incorrectfeedback).toBe(values.incorrectfeedback);
        expect(multichoice.partiallycorrectfeedback).toBe(values.partiallycorrectfeedback);
        expect(multichoice.shuffleanswers).toBe(values.shuffleanswers);
        expect(multichoice.single).toBe(values.single);
        expect(multichoice.answernumbering).toBe(values.answernumbering);
        expect(multichoice.showstandardinstruction).toBe(values.showstandardinstruction);
        expect(multichoice.answer).toEqual(values.answer);
    });

    test('True/False wird korrekt befüllt', () => {
        const values = {
            name: 'Frage 3',
            questiontext: 'Die Erde ist flach.',
            generalfeedback: 'Überlege nochmal gut!',
            defaultgrade: 1,
            penalty: 0.2,
            hidden: false,
            idnumber: 'Q3',
            tags: ['Wissenschaft'],
            answer: false
        };

        let truefalse = new TrueFalseDTO();
        proofQuestionType('truefalse', values);

        expect(truefalse.name).toBe(values.name);
        expect(truefalse.questionText).toBe(values.questiontext);
        expect(truefalse.generalfeedback).toBe(values.generalfeedback);
        expect(truefalse.defaultgrade).toBe(values.defaultgrade);
        expect(truefalse.penalty).toBe(values.penalty);
        expect(truefalse.hidden).toBe(values.hidden);
        expect(truefalse.idnumber).toBe(values.idnumber);
        expect(truefalse.tags).toEqual(values.tags);
        expect(truefalse.answer).toBe(values.answer);
    });

    test('Fehlerhafte Frage wirft Exception', () => {
        const values = { someKey: 'irgendwas' };

        expect(() => proofQuestionType('unknownType', values)).toThrow(
            'Unbekannter Question Type gefunden: unknownType'
        );
    });
});
