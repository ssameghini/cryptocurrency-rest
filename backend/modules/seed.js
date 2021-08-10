async function seed(prisma) {
    const bitcoin = await prisma.currency.upsert({
        where: { symbol: 'BTC' },
        update: {},
        create:  {
            description: 'bitcoin',
            symbol: 'BTC',
            currencyRates: {
                create: [
                    {
                        value: 11924.231233,
                        created_at: "2020-08-09T18:45:23Z"
                    },
                    {
                        value: 12102.432153,
                        created_at: "2020-08-11T18:45:23Z"
                    },
                    {
                        value: 12335.432153,
                        created_at: "2020-08-12T18:45:23Z"
                    },
                    {
                        value: 13112.432153,
                        created_at: "2020-08-13T18:45:23Z"
                    },
                    {
                        value: 11802.432153,
                        created_at: "2020-08-14T18:45:23Z"
                    },
                ]
            }
        }
    });

    const etherum = await prisma.currency.upsert({
        where: { symbol: 'ETH' },
        update: {},
        create:  {
            description: 'etherum',
            symbol: 'ETH',
            currencyRates: {
                create: [
                    {
                        value: 308.313553,
                        created_at: "2020-08-09T18:45:23Z"
                    },
                    {
                        value: 309.432153,
                        created_at: "2020-08-10T18:45:23Z"
                    },
                    {
                        value: 312.345235,
                        created_at: "2020-08-11T18:45:23Z"
                    },
                    {
                        value: 308.145893,
                        created_at: "2020-08-12T18:45:23Z"
                    },
                    {
                        value: 305.312545,
                        created_at: "2020-08-13T18:45:23Z"
                    },
                ]
            }
        }
    });

    const cardano = await prisma.currency.upsert({
        where: { symbol: 'ADA' },
        update: {},
        create:  {
            description: 'cardano',
            symbol: 'ADA',
            currencyRates: {
                create: [
                    {
                        value: 0.0990881,
                        created_at: "2020-08-09T18:45:23Z"
                    },
                    {
                        value: 0.1290881,
                        created_at: "2020-08-11T18:45:23Z"
                    },
                    {
                        value: 0.1452356,
                        created_at: "2020-08-12T18:45:23Z"
                    },
                    {
                        value: 0.1793423,
                        created_at: "2020-08-14T18:45:23Z"
                    },
                    {
                        value: 0.2455422,
                        created_at: "2020-08-15T18:45:23Z"
                    },
                ]
            }
        }
    });
}

module.exports = seed;