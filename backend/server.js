/* Modules */
require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');

/* Initial setting */
const port = process.env.PORT || 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

/* Date converting */
const prettifyDate = date => {
    const dateString = date.toISOString();
    const dateArray = dateString.split('T');
    const time = dateArray[1].slice(0, -5);
    return `${dateArray[0]} ${time}`;
};

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

app.get('/rates/:symbol', async (req, res) => {
    let symbol = req.params.symbol;
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

app.post('/rates', async (req, res) => {
    const { id_currency, value } = req.body;
    // The POST request doesn't provide a created_at yet (Frontend feature)
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

/* Serve API */
app.listen(port, () => {
    console.log(`The server is listening on port ${port}`);
});