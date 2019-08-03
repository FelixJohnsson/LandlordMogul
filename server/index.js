const express = require('express');
const app = express();
const port = 3000
const cors = require('cors');
const faker = require('faker/locale/en');
const uuid = require('uuid/v4')
const monk = require('monk');

const db = monk('localhost/database');
const residents = db.get('residents');
const buildings = db.get('buildings');

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

app.put('/addBuilding', (req, res) => {

    buildings.findOne({id: req.body.id}).then(e => {
        res.status(400);
    })

    
    if (req.body.type === 'apartment'){

        let size = req.body.m2 * req.body.height;
        let numberOfApartments = Math.floor(Math.sqrt((size /1.8)/10) * 2.4);
        console.log(numberOfApartments)
        
        let apartmentBuilding = {
            id: req.body.id,
            value: value,
            numberOfApartments: req.body.numberOfApartments,
            rentCost: req.body.rentCost,
            residents: {

            }
        }
        buildings.insert(apartmentBuilding).then(() => {
            res.json(apartmentBuilding);
        })
        apartmentBuilding = {};
    }
    
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))