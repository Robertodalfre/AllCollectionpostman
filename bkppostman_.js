require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

// Carregando as variáveis de ambiente do arquivo .env
const apiKey = process.env.POSTMAN_API_KEY;
const savePath = process.env.SAVE_PATH;
const baseUrl = 'https://api.getpostman.com/collections';

axios.get(baseUrl, {
    headers: {
        'X-Api-Key': apiKey
    }
})
.then(response => {
    const collections = response.data.collections;
    collections.forEach(collection => {
        axios.get(`${baseUrl}/${collection.uid}`, {
            headers: {
                'X-Api-Key': apiKey
            }
        })
        .then(res => {
            const data = JSON.stringify(res.data, null, 2);
            fs.writeFileSync(`${savePath}${collection.name}.json`, data);
            console.log(`Collection ${collection.name} exported successfully!`);
        })
        .catch(err => console.error(`Error exporting ${collection.name}:`, err));
    });
})
.catch(err => console.error('Error fetching collections:', err));