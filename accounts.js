let userdb = [
    newUser = {
        name: 'eternal',
        password: 'qa2foooc',
        balance: 300000,
        properties: [

        ]
    }
]

function addUser(name, password){
    let newUser = {
        name: name,
        password: password,
        balance: 300000,
        properties: [

        ]
    }
usersdb.push(newUser);
}

function checkUsername(){
    let username = document.getElementById('newUsername').value;
    let found = '';
    let signedIn = false;
    for(let i = 0; i < userdb.length; i++){
        if(userdb[i].name === username){ found = true }
        else { found = false };
    }
    if(found === true){ alert('That username has already been taken.')}
    else {window.location.replace("./index.html");}
}
