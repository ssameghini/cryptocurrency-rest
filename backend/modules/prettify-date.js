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

module.exports = prettifyDate;