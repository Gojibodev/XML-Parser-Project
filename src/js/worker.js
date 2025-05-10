document.addEventListener("DOMContentLoaded", () => {
    setupSelectionElements();
    setupSelectAllButton();
    toggleSubitems();
});

function setupSelectionElements() {
    const selectionElements = document.querySelectorAll('.selection-elem');
    selectionElements.forEach(elem => {
        const label = elem.querySelector('label');
        if (label) {
            label.addEventListener('click', function (e) {
                e.preventDefault();
                elem.classList.toggle('expanded');
            });
        }
    });
}

function setupSelectAllButton() {
    const selectAllBtn = document.getElementById('select-all');
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', function () {
            const checkboxes = document.querySelectorAll('#selection-container input[type="checkbox"]');
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);

            checkboxes.forEach(checkbox => {
                if (checkbox.checked !== !allChecked) {
                    checkbox.checked = !allChecked;
                    const event = new Event('change', { bubbles: true, cancelable: true });
                    checkbox.dispatchEvent(event);
                }
            });
        });
    }
}

function toggleSubitems() {
    const toggleButtons = document.querySelectorAll('.toggle-subitems');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const subitems = btn.nextElementSibling;
            const expander = btn.querySelector('.expander');

            if (subitems.style.display === 'none' || subitems.style.display === '') {
                subitems.style.display = 'block';
                if (expander) expander.textContent = 'Show Less';
            } else {
                subitems.style.display = 'none';
                if (expander) expander.textContent = 'Show More';
            }
        });
    });
}