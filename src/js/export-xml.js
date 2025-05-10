import { getQuestions } from './db.js';

export function setupExportButton() {
    const exportBtn = document.getElementById('export-btn');
    if (!exportBtn) return;

    exportBtn.addEventListener('click', async () => {
        try {
            const questions = await getQuestions();
            const selectedQuestions = questions.filter(q => q.selected !== false && q.originalXml);

            if (selectedQuestions.length === 0) {
                alert("Keine Fragen zum Export ausgewählt.");
                return;
            }

            const xmlContent = `<quiz>\n\n${selectedQuestions.map(q => q.originalXml.trim()).join('\n\n')}\n\n</quiz>`;
            const blob = new Blob([xmlContent], { type: 'application/xml' });

            const filenameInput = document.querySelector('#export-container input[type="text"]');
            const filename = (filenameInput?.value.trim() || 'export') + '.xml';

            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
            URL.revokeObjectURL(a.href);
        } catch (err) {
            console.error("Fehler beim Exportieren:", err);
        }
    });
}