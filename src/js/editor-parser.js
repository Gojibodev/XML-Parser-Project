export const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "xml",
    theme: "dracula",
    lineNumbers: true,
    autoCloseTags: true
});