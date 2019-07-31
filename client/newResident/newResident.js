const API_URL = 'http://localhost:3000/addResident';

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

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(userResident),
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.json())
    .then((e)=> {
        document.getElementById('inputFields').style.display = 'none';
        document.getElementById('residentOutput').style.display = "block"
        document.getElementById('nameOutput').innerHTML = e.firstname + ' ' + e.lastname;
        document.getElementById('ageOutput').innerHTML = e.age;
        document.getElementById('genderOutput').innerHTML = e.gender;
        document.getElementById('income').innerHTML = e.income;
        document.getElementById('occupation').innerHTML = e.occupation;
        document.getElementById('workplace').innerHTML = e.work;
    }) 
}


