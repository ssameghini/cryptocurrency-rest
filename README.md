# Cryptocurrency - REST API

> A simple REST API for a technical challenge. It allows storing and retrieving several cryptocurrency current values and their fluctuations, with a MySQL database, PM2 monitoring an Express App and a ReactJS UI for the client.

The current repository has :

- the API built with NodeJS/Express in the `/backend` folder.

- a Dockerfile for correctly building the API image.

- the React App ready to run and build in the `/crypto-app` folder, with its corresponding Dockerfile.

- the database models scripted in `/mysql/schemas.sql`.

---

## Building the Cryptocurrency application

For completely building the application you will need only a command line and [docker](https://www.docker.com/).
Follow the next steps; every time you see a `command` beggining with a $, type the command in the CLI.

<br/>

1. Git clone this repo:

`$ git clone https://github.com/ssameghini/cryptocurrency-rest.git`

2. Locate your CLI path on the root of the project:

`$ cd cryptocurrency-rest/`

3. Set the network for the containers:

`$ docker network create crypto-network`

4. Set and run a MySQL container:

```bash
$ docker run -d \
    --name crypto-mysql \
     --network crypto-network --network-alias mysql \
     -v crypto-mysql-data:/var/lib/mysql \
     -e MYSQL_ROOT_PASSWORD=secret \
     -e MYSQL_DATABASE=crypto_rest \
     mysql:latest
```

> `--network` connects MySQL with the network we've created.
> `MYSQL_ROOT_PASSWORD` will be the password for the API to connect to MySQL
> `MYSQL_DATABASE` will be the name of the database. For the purposes of the example, leave it that way (to avoid potential inconsistences); otherwise, you can provide the name you want and keep it the same through the next references.

5. Build API from Dockerfile:

`$ docker build -t crypto-api .`

> For this command to work, you need to be on root of the project. `docker build` searches for a **Dockerfile** on that directory.
> Inspect that Dockerfile for more information on how it builds the image. It needs to be in the same directory than the '/backend' folder, from where it builds the image.
> `-t crypto-api` sets the tag from where the image will be selected when run into a container.

6. Run API container:

```bash
$ docker run -dp 5000:5000 \
    --name crypto-api \
    --network crypto-network \
    -e PORT=5000 \
    -e MYSQL_HOST=mysql \
    -e MYSQL_USER=root \
    -e MYSQL_PASSWORD=secret \
    -e MYSQL_DB=crypto_rest \
    -e DATABASE_URL="mysql://root:secret@mysql/crypto_rest" \
    crypto-api
```

> `5000:5000` matches the container's port with the host's port.
> `--name` sets the container name for easier manipulation from the CLI.
> `--network` connects the API with the network and therefore with the database we previously created.
> The environmental variables 'MYSQL-*' provide the API with information to access to MySQL.

7. Run several requests against `http://localhost:5000` to test the API

  - `http://localhost:5000/currencies`

  - `http://localhost:5000/rates`

  - `http://localhost:5000/rates/:symbol`

  - `http://localhost:5000/rates` - POST `{ id_currency: number, value: number }`

> _:symbol_ is a placeholder for one of the available currencies in the database. By default, these include:

- 'BTC': bitcoin

- 'ETH': etherum

- 'ADA': cardano

> The client provides more functionality regarding getting and posting information...

### And if you want to create the React application as well...

8. Change your current directory:

`$ cd crypto-app/`

9. Build the App from Dockerfile:

```bash
$ cd /crypto-app \
    docker build -t crypto-app .
```

10. Run the App:

```bash
$ docker run \
    --name crypto-app \
    -dp 3000:3000 \
    crypto-app
```

> You should be able to access the page at 'http://localhost:3000'
