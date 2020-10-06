let charsText, codesText, selectBlock, charsBlock;

function codesCursor () {
    if (document.getElementById("charsText").value === "")
        return
    let cas = document.querySelectorAll("#codesText span");
    cas.forEach((sp) => {
        sp.style.borderRight = "";
        sp.style.backgroundColor = "";
    });
    if (charsText.selectionStart === charsText.selectionEnd) {
        let codesBefore = [...charsText.value.slice(0, charsText.selectionStart)].length;
        cas[codesBefore - 1].style.borderRight = "solid 2px rgba(0,127,0,1)";
    }
    else {
        let codesTotal = [...charsText.value].length;
        let codesBefore = [...charsText.value.slice(0, charsText.selectionStart)].length;
        let codesAfter = [...charsText.value.slice(charsText.selectionEnd)].length;
        for (let i = codesBefore, l = codesTotal-codesAfter; i<l; i++)
            cas[i].style.backgroundColor = "rgba(0,127,0,1)";
    }
}

function moveCursor (index) {
    charsText.focus();
    charsText.selectionStart = charsText.selectionEnd = [...charsText.value].slice(0, index+1).join("").length;
    codesCursor();
}

function codesRender () {
    codesText.innerHTML = ""
    Array.from(charsText.value).map((ch, i) => {
        let span = document.createElement("span");
        span.textContent = ch.codePointAt(0).toString(16);
        span.addEventListener("click", () => {
            moveCursor(i);
        });
        codesText.appendChild(span);
    });
}

function insertChar (char) {
    let start = charsText.selectionStart;
    charsText.value = charsText.value.slice(0, start) + char 
                        + charsText.value.slice(charsText.selectionEnd);
    charsText.focus();
    charsText.selectionStart = start + 1;
    charsText.selectionEnd = start + 1;
    codesRender();
}

function renderChars () {
    charsBlock.innerHTML = "";
    let start = parseInt(selectBlock.options[selectBlock.selectedIndex].value, 16);
    let end = selectBlock.selectedIndex < selectBlock.options.length - 1
                ? parseInt(selectBlock.options[selectBlock.selectedIndex + 1].value, 16)
                : 0x10000
    while (start < end) {
        let row = document.createElement("tr");
        for (let i = 0; i < 16; i++) {
            let cell = document.createElement("td");
            let ch = String.fromCodePoint(start + i);
            cell.textContent = ch;
            cell.addEventListener("click", () => {
                insertChar(ch);
            });
            row.appendChild(cell);
        }
        charsBlock.appendChild(row);
        start += 16
    }
}

window.onload = () => {

    charsText = document.getElementById("charsText");
    codesText = document.getElementById("codesText");
    selectBlock = document.getElementById("selectBlock");
    charsBlock = document.getElementById("charsBlock");

    renderChars();
    charsText.value = ""; // Firefox pre-loads previous value on refresh, introducing bugs, so clear it

    charsText.addEventListener("click", codesCursor);
    charsText.addEventListener("input", () => {
        codesRender();
        codesCursor();
    });
    charsText.addEventListener("selectionchange", codesCursor);

    document.getElementById("nfc").addEventListener("click", () => {
        charsText.value = charsText.value.normalize("NFC")
        codesRender();
    });
    document.getElementById("nfd").addEventListener("click", () => {
        charsText.value = charsText.value.normalize("NFD")
        codesRender();
    });
    document.getElementById("nfkc").addEventListener("click", () => {
        charsText.value = charsText.value.normalize("NFKC")
        codesRender();
    });
    document.getElementById("nfkd").addEventListener("click", () => {
        charsText.value = charsText.value.normalize("NFKD")
        codesRender();
    });
    document.getElementById("insertCodeButton").addEventListener("click", () => {
        let val = document.getElementById("insertCode").value.trim();
        if (val.startsWith("U+"))
            val = val.slice(2);
        let cp = parseInt(val, 16);
        if (isNaN(cp))
            insertChar("�")
        else
            insertChar(String.fromCodePoint(cp));
    });
    document.getElementById("search").addEventListener("input", () => {
        let option = Array.from(selectBlock.options)
                        .find(option => option.textContent.toLowerCase().startsWith(document.getElementById("search").value.toLowerCase()));
        if (option !== undefined)
            option.selected = "selected";
        renderChars();
    })
    selectBlock.addEventListener("change", () => {
        renderChars();
    });
}