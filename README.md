# Cryptocurrency - REST API

> A simple REST API for a technical challenge. It allows storing and retrieving several cryptocurrency current values and their fluctuations, with a MySQL database, PM2 monitoring an Express App and a ReactJS UI for the client.

The current repository has :

- the API built with NodeJS/Express in the `/backend` folder.

- a Dockerfile for correctly building the API image.

- the React App ready to run and build in the `/crypto-app` folder, with its corresponding Dockerfile.

- the database models scripted in `/mysql/schemas.sql`.

For the application to fully run, you might need an account on [PM2](https://pm2.io/) and some keys from there to synchronize your API with the web monitor. Check the [Docs](./Docs.md) for more information on how to get that done.

---

## Building the Cryptocurrency application

For completely building the application you will need only a command line and [docker](https://www.docker.com/).
Follow these steps.

<br/>

1. Git clone this repo:

    - `$ git clone https://github.com/ssameghini/cryptocurrency-rest.git`

<br/>

2. Locate your CLI path on the root of the project:

    - `$ cd cryptocurrency-rest/`

<br/>

3. Set the network for the containers:

    - `$ docker network create crypto-network`

<br/>

4. Set and run a MySQL container:

<br/>

    ```bash
    docker run -d \
        --name crypto-mysql \
        --network crypto-network --network-alias mysql \
        -v crypto-mysql-data:/var/lib/mysql \
        -e MYSQL_ROOT_PASSWORD=secret \
        -e MYSQL_DATABASE=crypto_rest \
        mysql:latest
    ```

    - Or if you are using PowerShell:

    ```powershell
    docker run -d `
        --name crypto-mysql `
        --network crypto-network --network-alias mysql `
        -v crypto-mysql-data:/var/lib/mysql `
        -e MYSQL_ROOT_PASSWORD=secret `
        -e MYSQL_DATABASE=crypto_rest `
        mysql:latest
    ```

> `--network` connects MySQL with the network we've created.
> `MYSQL_ROOT_PASSWORD` will be the password for the API to connect to MySQL
> `MYSQL_DATABASE` will be the name of the database. For the purposes of the example, leave it that way (to avoid potential inconsistences); otherwise, you can provide the name you want and keep it the same through the next references.

<br/>

5. Build API from Dockerfile:

    - **Important**

    - For this command to work, you need to be on root of the project. `docker build` searches for a **Dockerfile** on that directory.

    - You will need a [PM2](https://pm2.io/) account and keys to provide to the Dockerfile, in order for it to start properly. Check the [Docs](./Docs.md) for a guide.

    - `$ docker build -t crypto-api .`

> Inspect that Dockerfile for more information on how it builds the image. It needs to be in the same directory than the '/backend' folder, from where it builds the image.
> `-t crypto-api` sets the tag from where the image will be selected when run into a container.

<br/>

6. Run API container:

    ```bash
    docker run -dp 80:5000 \
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

    ```powershell
    docker run -dp 80:5000 `
        --name crypto-api `
        --network crypto-network `
        -e PORT=5000 `
        -e MYSQL_HOST=mysql `
        -e MYSQL_USER=root `
        -e MYSQL_PASSWORD=secret `
        -e MYSQL_DB=crypto_rest `
        -e DATABASE_URL="mysql://root:secret@mysql/crypto_rest" `
        crypto-api
    ```

> `80:5000` matches the container's port with the host's default port.
> `--name` sets the container name for easier manipulation from the CLI.
> `--network` connects the API with the network and therefore with the database we previously created.
> The environmental variables 'MYSQL-*' provide the API with information to access to MySQL.

<br/>

7. Run several requests against `http://localhost` to test the API

    - `http://localhost/currencies`

    - `http://localhost/rates`

    - `http://localhost/rates/:symbol`

    - `http://localhost/rates` - POST `{ id_currency: number, value: number }`

> _:symbol_ is a placeholder for one of the available currencies in the database. By default, these include:

    - 'BTC': bitcoin

    - 'ETH': etherum

    - 'ADA': cardano

> The client provides more functionality regarding getting and posting information...

<br/>

### And if you want to create the React application as well...

8. Change your current directory:

    - `$ cd crypto-app/`

<br/>

9. Build the App from Dockerfile:

    ```bash
    cd /crypto-app \
        docker build -t crypto-app .
    ```

    ```powershell
    cd /crypto-app `
        docker build -t crypto-app .
    ```

<br/>

10. Run the App:

    ```bash
    docker run \
        --name crypto-app \
        -dp 3000:3000 \
        crypto-app
    ```

    ```powershell
    docker run `
        --name crypto-app `
        -dp 3000:3000 `
        crypto-app
    ```

### ¡You should be able to access the page at 'http://localhost:3000'!
