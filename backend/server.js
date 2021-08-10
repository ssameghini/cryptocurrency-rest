/* Modules */
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { PrismaClient } = require('@prisma/client');

/* Routes configuration */
const router = require('./modules/routes');

/* Seeding the database with initial data */
const seed = require('./modules/seed');

/* Initial setting */
const port = process.env.PORT || 5000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({
    origin: '*',
}));

/* Initialize seeds */
seed(prisma)
    .catch((e) =>{
        console.error(e);
        process.exit(1);
    });

/* Initialize routes with the Express app and the Prisma Client */
router(app, prisma);

/* Redirect all invalid routes to '/' */
app.use((req, res) => { res.redirect('/')});

/* Serve API */
app.listen(port, () => {
    console.log(`The server is listening on port ${port}`);
});