
// TODO MOVE TO SCRIPT ------>>>>> fk
document.addEventListener("DOMContentLoaded", function () {
    const uploadDiv = document.getElementById("upload-div");
    const fileInput = document.getElementById("file-input");
    const uploadText = document.getElementById("upload-text");
    const browseBtn = document.getElementById("browse-btn");
    // console.log("elements:", elements);
    // Click to open file dialog
    browseBtn.addEventListener("click", () => fileInput.click());

    // Drag Over Event
    uploadDiv.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadDiv.classList.add("dragover");
        uploadText.innerText = "Drop the file here!";
    });

    // Drag Leave Event
    uploadDiv.addEventListener("dragleave", () => {
        uploadDiv.classList.remove("dragover");
        uploadText.innerHTML = `Drag & Drop your file here or <span id="browse-btn">Browse</span>`;
    });

    // Drop Event
    uploadDiv.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadDiv.classList.remove("dragover");

        let file = e.dataTransfer.files[0];
        if (file && file.type === "text/xml") {
            fileInput.files = e.dataTransfer.files;
            uploadText.innerText = `Uploaded: ${file.name}`;
            handleFileUpload(file);
        } else {
            uploadText.innerText = "Invalid file type! Please upload an XML file.";
        }
    });

    // Handle normal file selection
    fileInput.addEventListener("change", (e) => {
        let file = e.target.files[0];
        if (file) {
            uploadText.innerText = `Uploaded: ${file.name}`;
            handleFileUpload(file);
        }
    });

    function handleFileUpload(file) {
        let reader = new FileReader();
        reader.onload = function (event) {
            console.log("XML File Loaded:", event.target.result);
            populateXMLPreview(event.target.result);
        };
        reader.readAsText(file);
    }
});

function toggleSubitems() {
    const toggleSubitemsbtns = document.querySelectorAll('.toggle-subitems');
    toggleSubitemsbtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const subitems = btn.nextElementSibling;
            const expander = btn.querySelector('.expander');
            console.log("btn pressed", subitems, expander);
            if (subitems.style.display === 'none' || subitems.style.display === '') {
                subitems.style.display = 'block';
                expander.textContent = 'Show Less';
            } else {
                subitems.style.display = 'none';
                expander.textContent = 'Show More';
            }
        });
    });
}
    // const subitems = document.getElementById('subitems');
    // const expander = document.querySelector('.expander');
    // if (subitems.style.display === 'none' || subitems.style.display === '') {
    //     subitems.style.display = 'block';
    //     expander.textContent = 'Show Less';
    // } else {
    //     subitems.style.display = 'none';
    //     expander.textContent = 'Show More';
    // }