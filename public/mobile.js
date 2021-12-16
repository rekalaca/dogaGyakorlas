document.getElementById('phoneList').onclick = phoneList;

async function phoneList(){
    const response = await fetch("phones");
    const phones = await response.json();

    let phoneTable='<table id="myphoneTable"><tr><th>Gyártó</th><th>Típus</th><th>Ár (HUF)</th></tr>';
    for( const phone of phones){
        phoneTable += `<tr><td>${phone.marka}</td><td>${phone.tipus}</td><td>${phone.ar}</td></tr>`;
    }
    phoneTable += '</table>';
    document.getElementById('phoneRaktar').innerHTML = phoneTable;
}
document.getElementById("newPhone").onsubmit = async function (event) {
    event.preventDefault();
    const marka = event.target.elements.marka.value;
    const tipus = event.target.elements.tipus.value;
    const ar = event.target.elements.ar.value;

    const res = await fetch("/phones", {
        method: 'POST',
        headers: {
            "content-type" : "application/json",
        },
        body: JSON.stringify({
            marka,
            tipus,
            ar
        }),
    });
    phoneList();
    
};