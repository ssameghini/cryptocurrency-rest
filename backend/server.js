/* Modules */
require('dotenv').config();
const express = require('express');

/* Initial configuration */
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

/* Date converting */
const convertDate = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDay();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return  (`${year}-${month}-${day} ${hour}:${minutes}:${seconds}`);
};

const rates = [
    {
        id_currency: 1,
        value: 11943,
        createdAt: new Date('2021-08-05T20:17:24')
    },
    {
        id_currency: 2,
        value: 23456,
        createdAt: new Date('2021-08-05T20:17:11')
    },
    {
        id_currency: 3,
        value: 32156,
        createdAt: new Date('2021-08-05T20:13:45')
    },
    {
        id_currency: 2,
        value: 22564,
        createdAt: new Date('2021-08-05T20:19:34')
    },
    {
        id_currency: 3,
        value: 30876,
        createdAt: new Date('2021-08-05T20:18:21')
    },
    {
        id_currency: 1,
        value: 13536,
        createdAt: new Date('2021-08-05T20:17:15')
    },
    {
        id_currency: 2,
        value: 24654,
        createdAt: new Date('2021-08-05T20:20:11')
    }
];


/* Routing */
app.get('/', (req, res) => {
    res.redirect(301, '/currencies');
});

app.get('/currencies', (req, res) => {
    res.send('This is the currencies endpoint! Bitcoin, Etherum, Cardano.');
});

app.get('/rates', (req, res) => {
    let lastValues = [];
    for (let index = 1; index <= currencies.length; index++) {
        const lastValue = rates
            .filter(value => value.id_currency === index)
            .sort((a, b) => b.createdAt - a.createdAt)
            .shift();
        lastValues.push(lastValue);
    };
    res.json(lastValues);
});

app.get('/rates/:symbol', (req, res) => {
    let symbol = req.params.symbol;
    symbol = symbol.toUpperCase();
    const currency = currencies.find(el => el.symbol === symbol);
    if (currency) {
        const lastUpdate = rates
            .filter(value => value.id_currency === currency.id)
            .sort((a, b) => b.createdAt - a.createdAt)
            .shift();
        res.json(lastUpdate);
    } else {
        res.send('The symbol you provided does not match any of our listed currencies.');
    }
});

app.post('/rates', (req, res) => {
    const valueInput = req.body;
    if (valueInput.id_currency && valueInput.value) {
        const currency = currencies.find(el => el.id === valueInput.id_currency);
        !currency && res.send('Please provide a valid currency id');
        const date = new Date();
        valueUpdate = {
            id_currency: valueInput.id_currency,
            value: valueInput.value,
            createdAt: convertDate(date), // This should only be a raw new Date(), parsed in a GET response
            currency
        };
        res.json(valueUpdate);
    } else {
        res.status(400).send('Please provide a valid object, with id_currency and value properties.');
    }
});

/* Serve API */
app.listen(port, () => {
    console.log(`The server is listening on port ${port}`)
});