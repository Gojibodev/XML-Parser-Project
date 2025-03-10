var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "xml",
    theme: "dracula", // Change theme if needed
    lineNumbers: true,
    autoCloseTags: true
});