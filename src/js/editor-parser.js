document.getElementById('fileinput').addEventListener('change', handleFileSelect, false);

var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "xml",
    theme: "dracula", // Change theme if needed
    lineNumbers: true,
    autoCloseTags: true
});

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
    const  XMLcontainer = editor.getTextArea();
    XMLcontainer.innerHTML = ''; // Clear existing content
    let xmlContent = "";
    const elements = xmlDoc.getElementsByTagName('*');
    console.log(elements); 
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        xmlContent += element.outerHTML;
    }
    editor.setValue(xmlContent);
}
function addToEditor(xmlObj){
    editor.setValue(editor.getValue() + xmlObj.outerHTML);
}