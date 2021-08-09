/* Modules */
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { PrismaClient } = require('@prisma/client');

/* Initial setting */
const port = process.env.PORT || 5000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({
    origin: '*',
}));

/* Date converting */
const prettifyDate = (date, format = null) => {
    if (!format) {
        const dateString = date.toISOString();
        const dateArray = dateString.split('T');
        const time = dateArray[1].slice(0, -5);
        return `${dateArray[0]} ${time}`;
    } else if (format) {
        const dateString = date.toISOString();
        let dateArray = dateString.split('T');
        const time = dateArray[1].slice(0, -5);
        dateArray = dateArray[0].split('-');
        const year = dateArray[0].slice(2, 4);
        const month = +dateArray[1];
        const day = +dateArray[2];
        return `${year}/${month}/${day} ${time}`;
    }
};

/* Retrieve currency object from its ID */
const currencyRetriever = async (symbol) => {
    symbol = symbol.toUpperCase();
    // Find the currency for its ID
    const currency = await prisma.currency.findUnique({
        where: {
            symbol: symbol,
        },
        select: {
            id: true,
        },
    });
    return currency;
}

/* Routing */
app.get('/', (req, res) => {
    res.redirect(301, '/currencies');
});

app.get('/currencies', async (req, res) => {
    const currencies = await prisma.currency.findMany();
    currencies.length > 0 ?
        res.json(currencies) :
        res.send(`We're sorry! We didn't find any currencies in our database yet. Feel free to populate it with POST on /currencies.`);
});

app.get('/rates', async (req, res) => {
    const lastRates = await prisma.rate.findMany({
        orderBy: [
            {
                id_currency: 'asc',
            },
            {
                created_at: 'desc',
            },
        ],
        distinct: ['id_currency'],
        take: 3, // This value should actually equal to the number of currencies listed in the DB.
        include: {
            currency: true
        },
    });
    // Remove 'T' and miliseconds from created_at Date
    lastRates.forEach(rate => {
        rate.created_at = prettifyDate(rate.created_at);
    });
    res.json(lastRates);
});

app.get('/rates/fluctuations', async (req, res) => {
    const lastRates = await prisma.rate.findMany({
        orderBy: [
            {
                id_currency: 'asc',
            },
            {
                created_at: 'asc',
            },
        ],
        include: { currency: true },
    });
    // Remove 'T' and miliseconds from created_at Date
    lastRates.forEach(rate => {
        rate.created_at = prettifyDate(rate.created_at, true);
    });
    res.json(lastRates);
});

app.get('/rates/fluctuations/:symbol', async (req, res) => {
    let {symbol} = req.params;
    const currency = await currencyRetriever(symbol);
    const currencyFluctuations = await prisma.rate.findMany({
        where: {
            id_currency: currency.id,
        },
        orderBy: [
            {
                created_at: 'asc',
            },
        ],
        include: { currency: true },
    });
    // Remove 'T' and miliseconds from created_at Date
    currencyFluctuations.forEach(rate => {
        rate.created_at = prettifyDate(rate.created_at, true);
    });
    res.json(currencyFluctuations);
});

app.get('/rates/:symbol', async (req, res) => {
    let {symbol} = req.params;
    const currency = await currencyRetriever(symbol);
    if (!currency) { res.send(`The symbol you provided doesn't match any of our listed currencies.`) }
    // Find all its rates, sort them from latest to oldest, and take the first
    const lastRate = await prisma.rate.findMany({
        include: { currency: true },
        where: {
            id_currency: currency.id,
        },
        orderBy: { created_at: 'desc' },
        take: 1,
    });
    // Remove 'T' and miliseconds from created_at Date
    lastRate[0].created_at = prettifyDate(lastRate[0].created_at);
    res.json(lastRate);
});

app.post('/currencies', async (req, res) => {
    let { description, symbol } = req.body;
    description = description.toLowerCase();
    const createdCurrency = await prisma.currency.create({
        data: {
            description,
            symbol,
        },
    });
    res.json(createdCurrency);
});

app.post('/rates', async (req, res) => {
    const { id_currency, value } = req.body;
    const date = new Date().toISOString();
    const createdRate = await prisma.rate.create({
        data: {
            id_currency,
            value,
            created_at: date,
        },
    });
    // Remove 'T' and miliseconds from created_at Date
    createdRate.created_at = prettifyDate(createdRate.created_at);
    res.json(createdRate);
});

app.post('/delete', async (req, res) => {
    let { symbol } = req.body;
    symbol = symbol.toUpperCase();
    const deletedCurrency = await prisma.currency.delete({
        where: {
            symbol,
        }
    });
    res.json(deletedCurrency);
});

/* Serve API */
app.listen(port, () => {
    console.log(`The server is listening on port ${port}`);
});