# Getting Started

## API Umbrella Setup

### For local setup 
1. Get an API Umbrella URL/API Umbrella key to be able to connect to the backend microservices
1. Copy the api-config.example.json to api-config.json and set the API_UMBRELLA_URL/API_UMBRELLA_KEY setting

### For Deployments
- the API_UMBRELLA_URL/API_UMBRELLA_KEY environment variable should be setup in the docker deployment yaml file



### server
```bash
# development
npm run server
# production
npm run build:prod
npm run server:prod
```

Optional

```bash
cp config/webpack.dev.js config/webpack.local.js
npm run server:local
```

This configuration is ignored by git and can used to test webpack configurations

## Other commands

### build files
```bash
# development
npm run build:dev
# production
npm run build:prod
```

### hot module replacement
```bash
npm run server:dev:hmr
```

### watch and build files
```bash
npm run watch
```

### run tests
```bash
npm run test
```

### watch and run our tests
```bash
npm run watch:test
```

### run end-to-end tests
```bash
# make sure you have your server running in another terminal
npm run e2e
```

### run webdriver (for end-to-end)
```bash
npm run webdriver:update
npm run webdriver:start
```

### run Protractor's elementExplorer (for end-to-end)
```bash
npm run webdriver:start
# in another terminal
npm run e2e:live
```

# Configuration
Configuration files live in `config/` we are currently using webpack, karma, and protractor for different stages of your application

# Contributing
You can include more examples as components but they must introduce a new concept such as `Home` component (separate folders), and Todo (services). I'll accept pretty much everything so feel free to open a Pull-Request

# TypeScript
> To take full advantage of TypeScript with autocomplete you would have to install it globally and use an editor with the correct TypeScript plugins.

## Use latest TypeScript compiler
TypeScript 1.7.x includes everything you need. Make sure to upgrade, even if you installed TypeScript previously.

```
npm install --global typescript
```

