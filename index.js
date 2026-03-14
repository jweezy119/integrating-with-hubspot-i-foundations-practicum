const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

// 1. Homepage: Fetches your pets
app.get('/', async (req, res) => {
    const petsUrl = 'https://api.hubapi.com/crm/v3/objects/2-226760142?properties=name,pet_type,favorite_toy';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        const resp = await axios.get(petsUrl, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Pets | HubSpot Practicum', data });      
    } catch (error) {
        console.error(error);
    }
});

// 2. GET Form: Renders the updates.pug template
app.get('/update-cobj', async (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// 3. POST Form: Sends the new pet to HubSpot
app.post('/update-cobj', async (req, res) => {
    const newPet = {
        properties: {
            "name": req.body.name,
            "pet_type": req.body.pet_type,
            "favorite_toy": req.body.favorite_toy
        }
    }
    const createUrl = 'https://api.hubapi.com/crm/v3/objects/2-xxxxxxx';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try { 
        await axios.post(createUrl, newPet, { headers });
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));