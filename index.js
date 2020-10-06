function codesCursor () {
    if (document.getElementById("charsText").value === "")
        return
    let ta = document.getElementById("charsText");
    let cas = document.querySelectorAll("#codesText span");
    cas.forEach((sp) => {
        sp.style.borderRight = "";
        sp.style.backgroundColor = "";
    });
    if (ta.selectionStart === ta.selectionEnd) {
        let codesBefore = [...ta.value.slice(0, ta.selectionStart)].length;
        cas[codesBefore - 1].style.borderRight = "solid 1px rgba(0,0,0,1)";
    }
    else {
        let codesTotal = [...ta.value].length;
        let codesBefore = [...ta.value.slice(0, ta.selectionStart)].length;
        let codesAfter = [...ta.value.slice(ta.selectionEnd)].length;
        for (let i = codesBefore, l = codesTotal-codesAfter; i<l; i++)
            cas[i].style.backgroundColor = "green";
    }
}

function codesRender () {
    document.getElementById("codesText").innerHTML 
        = Array.from(document.getElementById("charsText").value)
            .map(ch => "<span>"+ch.codePointAt(0).toString(16)+"</span>").join("");
}

window.onload = () => {

    document.getElementById("charsText").addEventListener("click", codesCursor);
    //document.getElementById("charsText").addEventListener("focus", codesCursor);
    document.getElementById("charsText").addEventListener("input", () => {
        codesRender();
        codesCursor();
    });
    document.getElementById("charsText").addEventListener("selectionchange", codesCursor);

    document.getElementById("nfc").addEventListener("click", () => {
        document.getElementById("charsText").value = document.getElementById("charsText").value.normalize("NFC")
        codesRender();
    })
    document.getElementById("nfd").addEventListener("click", () => {
        document.getElementById("charsText").value = document.getElementById("charsText").value.normalize("NFD")
        codesRender();
    })
    document.getElementById("nfkc").addEventListener("click", () => {
        document.getElementById("charsText").value = document.getElementById("charsText").value.normalize("NFKC")
        codesRender();
    })
    document.getElementById("nfkd").addEventListener("click", () => {
        document.getElementById("charsText").value = document.getElementById("charsText").value.normalize("NFKD")
        codesRender();
    })

}