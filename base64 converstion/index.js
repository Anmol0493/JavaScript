function txtToBase64(txt) {
    const base64 = btoa(txt);
    return base64;
};

const txt = "";

console.log(txtToBase64(txt));


function base64ToTxt(base64) {
    const txt = atob(base64)
    return txt;
}

const base64 = "";

console.log(base64ToTxt(base64));