<ul>
  <li>
    <a href="rules-of-engagement">Rules of engagement</a>
    <ul>
      <li><a href="#branching">Branching</a></li>
      <li><a href="#pull-requests">Pull requests</a></li>
      <li><a href="#merging">Merging</a></li>
    </ul>
  </li>

</ul>

<h2 id="rules-of-engagement">Rules of engangement (operations)</h2>

Those working in the project have decided on the following guidelines with regard to working with the project in GitHub.

<h3 id="branching">Branching</h3>

Gitflow Workflow branch names:

`comp` is equivalent to `develop`.
`minc`, `prodlike` have no Gitflow equivalent.
`master` is equivalent to `master`. 

1. Do not work in `comp` or `development` (or any other default branch directly).
1. Branch names should consist of the ticket ID being worked and a brief description. Ex. `sam-201-header-component`. Note: Per the first guideline, large tickets can be broken down, either by creating more tickets under the main ticket; or, by modifying the tail of the branch name to enable multiple concurent pull requests.

<h3 id="pull-requests">Pull requests</h3>

1. We have templates for [Pull Requests](https://csp-github.sam.gov/GSA-IAE/sam-front-end/blob/comp/.github/PULL_REQUEST_TEMPLATE.md) and [Issues](https://csp-github.sam.gov/GSA-IAE/sam-front-end/blob/comp/.github/ISSUE_TEMPLATE.md), please use them when applicable. Note: Sometimes GitHub will not automatically use the templates as it is supposed to.
1. Pull requests should contain small changes to the codebase to minimize merge conflicts and large integrations.
1. The Pull Request template contains a checklist for reviewers to use to determine if a pull request should be merged.
1. Pull requests are reviewed by someone from a different vendor than the submitter.
  - All vendors do *not* need to review pull requests.
  - Excpeption: Level 1 or 2 defects can be reviewed by someone from the same vendor.

<h3 id="merging">Merging</h3>

1. Discovered merge conflicts within a pull request should be corrected by the submitter of the pull request.
1. No code freezes will be instituted; if a pull request cannot be merged or the functionality cannot be demonstrated at the Sprint review, the work will rollover to the next release (or Sprint).


# Getting Started

## API Umbrella Setup

### For local setup 
1. Get an API Umbrella URL/API Umbrella key to be able to connect to the backend microservices
1. Copy the api-config.example.json to api-config.json and set the API_UMBRELLA_URL/API_UMBRELLA_KEY setting

### For Deployments
- the API_UMBRELLA_URL/API_UMBRELLA_KEY environment variable should be setup in the docker deployment yaml file

## Other commands

### build files


### hot module replacement

### watch and build files

### run tests


### watch and run our tests


### run end-to-end tests


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

