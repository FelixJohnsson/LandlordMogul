const express = require('express');
const app = express();
const port = 3000
const cors = require('cors');
const faker = require('faker/locale/en');
const uuid = require('uuid/v4')
const monk = require('monk');

const db = monk('localhost/residents');
const residents = db.get('Residents');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        msg: 'Hello'
    })
})
app.post('/addResident', (req, res) => {
    const newResident = {
        id: uuid(),
        familyId: uuid(),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        gender: req.body.gender,
        occupation: faker.name.jobTitle(),
        work: faker.company.companyName(),
        income: Math.floor(Math.random() * 5000 + 2000)
    }
    residents.insert(newResident).then(e => {
        res.json(e);
    })
})

app.put('/getResident', (req, res) => {
    residents.findOne({id: req.body.characterID}).then(e => {
        res.json(e);
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))