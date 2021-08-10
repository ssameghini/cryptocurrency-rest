const currencyRetriever = async (symbol, prisma) => {
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

module.exports = currencyRetriever;