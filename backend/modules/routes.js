/* Date converting */
const prettifyDate = require('./prettify-date');

/* Retrieve currency object from its ID */
const currencyRetriever = require('./currency-retriever');

function router (app, prisma) {
    app.get('/', (req, res) => {
        res.redirect(301, '/currencies');
    });
    
    app.get('/currencies', async (req, res) => {
        const currencies = await prisma.currency.findMany();
        currencies && currencies.length > 0 ?
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
        const currency = await currencyRetriever(symbol, prisma);
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
        const currency = await currencyRetriever(symbol, prisma);
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
        res.json(lastRate[0]);
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
        const { id_currency, value, created_at } = req.body;
        console.log(created_at);
        const date = created_at || new Date();
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
}

module.exports = router;