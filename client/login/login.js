const API_URL = 'http://localhost:3000/getResident';


document.getElementById('newResident').addEventListener('click',() => {
    document.getElementById('inputFields').style.display = 'block';
})

function loginResident() {
    const characterID = document.getElementById('characterId').value;

    fetch(API_URL, {
        method: 'PUT',
        body: JSON.stringify({characterID}),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then(res => res.json())
    .then((e)=> {
        if (e === null){
            document.getElementById('error').innerHTML = 'Cannot find that character.'
        } else {
            sessionStorage.setItem("id", e.id);
            window.location.replace(`../game/game.html`);
        }
    }) 
}



document.getElementById('newResident').addEventListener('click',() => {
    document.getElementById('inputFields').style.display = 'block';

})
function newResident(){
    document.getElementById('newResident').style.display = 'none';
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const age = document.getElementById('age').value;
    const genderInput = document.getElementById('gender');
    const gender = genderInput.options[genderInput.selectedIndex].value;

    const userResident = {
        firstname: firstname,
        lastname: lastname,
        age: age,
        gender: gender,
    }


}


