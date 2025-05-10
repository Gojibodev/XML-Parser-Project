export function setupUploadHandlers(fileInputId, browseBtnId, uploadTextId, uploadListId, handleXmlFilesFn, deleteXmlFileFn) {
    const fileInput = document.getElementById(fileInputId);
    const browseBtn = document.getElementById(browseBtnId);
    const uploadText = document.getElementById(uploadTextId);
    const uploadList = document.getElementById(uploadListId);
    const uploadDiv = document.getElementById('upload-div');

    if (!fileInput || !browseBtn || !uploadText || !uploadList || !uploadDiv) {
        console.warn("Upload-Handler konnte nicht initialisiert werden: fehlende Elemente.");
        return;
    }

    // Öffnen über "Browse"
    browseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput.click();
    });

    // File input
    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        handleXmlFilesFn(files);
        showUploadedFiles(files);
        event.target.value = '';
    });

    // Drag & Drop Verhalten
    uploadDiv.addEventListener('dragover', e => {
        e.preventDefault();
        uploadDiv.classList.add('dragging');
    });

    uploadDiv.addEventListener('dragleave', e => {
        e.preventDefault();
        uploadDiv.classList.remove('dragging');
    });

    uploadDiv.addEventListener('drop', e => {
        e.preventDefault();
        uploadDiv.classList.remove('dragging');

        const files = e.dataTransfer.files;
        if (!files || files.length === 0) return;

        handleXmlFilesFn(files);
        showUploadedFiles(files);
    });

    function showUploadedFiles(fileList) {
        const existingNames = new Set([...uploadList.querySelectorAll('li')].map(li => li.dataset.filename));

        Array.from(fileList).forEach(file => {
            if (existingNames.has(file.name)) return;

            const li = document.createElement('li');
            li.dataset.filename = file.name;
            li.style.color = '#ccc';
            li.style.fontSize = '0.9em';
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.style.justifyContent = 'space-between';
            li.style.marginBottom = '4px';
            li.style.gap = '8px';

            const nameSpan = document.createElement('span');
            nameSpan.textContent = file.name;

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '&times;';
            deleteBtn.title = 'Datei entfernen';
            deleteBtn.classList.add('delete-file-btn');

            deleteBtn.addEventListener('click', () => {
                if (typeof deleteXmlFileFn === 'function') {
                    if (confirm(`Möchtest du die Datei "${file.name}" und alle zugehörigen Fragen löschen?`)) {
                        deleteXmlFileFn(file.name);
                        li.remove();
                    }
                } else {
                    console.warn("deleteXmlFileFn ist keine Funktion!");
                }
            });

            li.appendChild(nameSpan);
            li.appendChild(deleteBtn);
            uploadList.appendChild(li);
        });
    }
}