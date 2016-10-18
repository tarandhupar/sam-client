

# Getting Started
## Dependencies
What you need to run this app:
* `node` and `npm` (`brew install node`)
* Ensure you're running the latest versions Node `v4.x.x`+ (or `v5.x.x`) and NPM `3.x.x`+

> If you have `nvm` installed, which is highly recommended (`brew install nvm`) you can do a `nvm install --lts && nvm use` in `$` to run with the latest Node LTS. You can also have this `zsh` done for you [automatically](https://github.com/creationix/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file) 

Once you have those, you should install these globals with `npm install --global`:
* `webpack` (`npm install --global webpack`)
* `webpack-dev-server` (`npm install --global webpack-dev-server`)
* `karma` (`npm install --global karma-cli`)
* `protractor` (`npm install --global protractor`)
* `typescript` (`npm install --global typescript`)

## Installing
* `fork` this repo
* `clone` your fork
* `npm install webpack-dev-server rimraf webpack -g` to install required global dependencies
* `npm install` to install all dependencies
* `npm run server` to start the dev server in another tab

## API Umbrella Setup

### For local setup 
1. Get an API Umbrella URL/API Umbrella key to be able to connect to the backend microservices
1. Clone the config/webpack.local-example.js to config/webpack.local.js file
1. Clone the .env-example to .env and set the API_UMBRELLA_URL/API_UMBRELLA_KEY setting

### For Deployments
- the API_UMBRELLA_URL/API_UMBRELLA_KEY environment variable should be setup in the docker deployment yaml file

## Running the app
After you have installed all dependencies you can now run the app. Run `npm run server` to start a local server using `webpack-dev-server` which will watch, build (in-memory), and reload for you. The port will be displayed to you as `http://0.0.0.0:3000` (or if you prefer IPv6, if you're using `express` server, then it's `http://[::1]:3000/`).

### server
```bash
# development
npm run server:local
# production
npm run build:prod
npm run server:prod
```

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

## Folder structure

```
/src
  /ui-kit                     // module containing reusable ui componet based on the samwds css
    /form-controls            // control element for building forms
      /select
        select.component.ts
        select.spec.ts
      /checkbox
      /wrapper
    /components               // reusable ui components
      /header
      /footer
  /api-kit                    // module for interfacing with sam.gov rests services
    /wrapper                  // wraps https requests with the necessary headers to call sam.gov services
      api.service.ts
    /search
      search.service.ts
    /fh
      fh.service.ts
    ...
  /app                         // module handles the routing and coordination of other modules
    /common
      /pipes
      /components
        /no-content
          no-conent.component.ts
      /services
    /search
      /assistance-listing (sub-component)
      /opportunity-listing
      search.routes.ts
      search.page.ts
      search.module.ts
    /home
      home.route.ts
      home.page.ts
      home.module.ts
    app.component.ts
```

## Naming conventions

- Injectable services end with Service (e.g. SearchService)
- Pipes end with Pipe (e.g. CapitalizePipe)
- Components end with Component (e.g. HomeComponent)
- Exported components in the ui-kit will be prefixed with Sam (e.g. SamSelectComponent) and their selectors will be prefixed as well (e.g. \<samSelect>)
- 


