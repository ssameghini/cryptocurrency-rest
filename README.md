# cryptocurrency-rest

A simple REST API for a technical challenge. It allows storing and retrieving several cryptocurrency current values and their fluctuations, with a MySQL database, a PM2 monitoring and a ReactJS UI.

## Instructions

1. Set network:
`$ docker network create crypto-network`

2. Set MySQL container:

```bash
$ docker run -d \
    --name crypto-mysql \
     --network crypto-network --network-alias mysql \
     -v crypto-mysql-data:/var/lib/mysql \
     -e MYSQL_ROOT_PASSWORD=secret \
     -e MYSQL_DATABASE=crypto_rest \
     mysql:latest
```

3. Build backend from Dockerfile:

`$ docker build -t crypto-api .`

4. Run backend container:

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

5. Run requests against `http://localhost:5000`

  - /currencies

  - /rates

  - /rates/:symbol

  - POST /rates `{ id_currency: string, value: number }`

6. Build client from Dockerfile:

```bash
$ cd /crypto-app \
    docker build -t crypto-app .
```

7. Run client:

`$ docker run --name crypto-app -dp 3000:3000 crypto-app`
