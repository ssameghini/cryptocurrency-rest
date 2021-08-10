# Configuring PM2 for the Express API

The Dockerfile in this directory builds the Node/Express API that runs under PM2, so any analitycs and metrics involved in the interactions made with the API get registered in (PM2+ Monit)[https://app.pm2.io/].

<br/>

For that to work correctly, you have to provide a PUBLIC and a SECRET key to the Dockerfile, in the ENV variables **ENV** _PM2_PUBLIC_KEY_  and **ENV** _PM2_SECRET_KEY_.

> Screen captue placeholder

## So...

1. Signup at [PM2](https://id.keymetrics.io/api/oauth/register).

2. Once you have your account validated and [logged in](https://id.keymetrics.io/), create a default bucket.

Image

3. Once created, you will be showed a set of options for configuring your app in different environments. Select 'Docker' and copy **only** the two lines with the public and secret keys to the corresponding Dockerfile ENV declarations.

Image

4. Save, and you are ready to continue with the [Guide](./Readme.md).
