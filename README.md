The following explains how to get set up locally. For instructions regarding branching, merging, and so on; please see the [CONTRIBUTING](https://csp-github.sam.gov/joshuabruce/sam-front-end/blob/comp/CONTRIBUTING.md) documentation.

<ul>
  <li><a href="#pipeline-workaround">!!!***Pipeline 2.0 workaround***!!!</a></li>
  <li>
    <a href="#getting-started">Getting started</a>
    <ul>    
      <li><a href="#check-node">Check NodeJS and NPM</a></li>
      <li><a href="#submodules">Using Git Submodules</a></li>
      <li><a href="#installing-globals">Installing required globals</a></li>
      <li><a href="#serving-locally">Serving app locally</a></li>
      <li><a href="#submitting-prs">Submitting pull requests</a></li>      
    </ul>
  </li>
  <li>
    <a href="#coding-standards">Coding Standards</a>
    <ul>
      <li><a href="#design">Design</a></li>
      <li><a href="naming-conventions">Naming conventions</a></li>
      <li><a href="#doc-blocks">Doc-blocks</a></li>
    </ul>
  </li>
  <li>
    <a href="#helpful-commands">Helpful commands</a>
    <ul>
      <li><a href="#build-files">Build files</a></li>
      <li><a href="#hot-module-replacement">Hot module replacement</a></li>
      <li><a href="#watch-and-build-files">Watch and build files</a></li>
      <li><a href="#run-tests">Run tests</a></li>
      <li><a href="#end-to-end">End to end</a></li>
    </ul>
  </li>
</ul>

<h2 id="pipeline-workaround">Pipeline 2.0 workaround</h2>

When the repository was converted to Pipeline 2.0 we discovered multiple use cases based on the way we were initially operating that would no longer work well within the new GitHub workflow given the Jenkins process. The following is the workaround determined by the front-end technical lead, other contributors, and the CSP team working on the pipeline.

1. Create a branch with your epic name and push this branch to `origin`. (ex. Admin, Application Content, and so on.)
1. Clone the repository locally and create feature branches from the "epic branch".
1. Submit Pull Requests to the epic branch (this allows you to operate without the Jenkins build process).
1. At the end of each business day, at least, merge the "epic branch" into `develop` and perform the integrate-merge-deploy process within the 5 or 10 minutes timeout window.

This process should also overcome limitations and issues discovered with other workarounds.

1. You should no longer need to add or remove empty lines to or from other files in order to force the Jenkins build to occur. This can cause "false" merge conflicts, albeit in files that do not change often.
1. You can update Pull Requests as you were accustomed without being inundated with comments from Jenkins or possibly hitting the "proceed or abort" buttons at the wrong time (allows more streamlined code reviews and reduces the signal to noise ratio).

This process introduces the following limitations:

1. We are, for all intents and purposes, creating a `comp` branch similar to the legacy pipeline. Each "epic branch" becomes *that* concept. Therefore, it can feel like it slows the overall process down.

If you have questions, comments, concerns, and so on regarding this workaround, please go here: [https://csp-github.sam.gov/GSA-IAE/sam-front-end/issues/67](https://csp-github.sam.gov/GSA-IAE/sam-front-end/issues/67)

<h2 id="getting-started">Getting started</h2>

<h3 id="check-node">Check NodeJS and NPM</h3>

To run the app locally, you will need NodeJS and the Node Package Manager (NPM).

Confirm NPM is available:

`$ npm -v`

If you do not see a version number, [install Node.js](https://nodejs.org/en/download/).

Note: Ensure you are running the latest versions of both. If not, please [update NodeJS and NPM](https://docs.npmjs.com/getting-started/installing-node).

> If you have `nvm` installed, which is highly recommended (`brew install nvm`) you can do a `nvm install --lts && nvm use` in `$` to run with the latest Node LTS. You can also have this `zsh` done for you [automatically](https://github.com/creationix/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file) 

<h3 id="submodules">Using Git Submodules</h3>

Git submodules allows nesting of git repositories. We're currently pulling in sam-ui-elements as the ui-kit.

<h4>First time setup</h4>

Please make sure you're on the CSP develop branch when starting this. Add the following to your local ~/.gitconfig file (this is not tied to the repo). This is a redirect needed to access the submodules locally and keep the builds working

```
[url "https://csp-github.sam.gov/"]
    insteadOf = git@csp-github.sam.gov:
```

Initialize the submodule(s)

`git submodule update --init`

If you get an SSL certificate issue, please run this workaround:

`git config http.sslVerify false`

<h4>Updating submodule during development</h4>

When you're jumping between feature branches and need to update your submodule files to the currently tracked commit

`git submodule update`

When your feature needs to update the git submodule to a latest tracked commit, use the following command

`git submodule update --remote`

<h4>Resolving Merge Conflicts</h4>

If you're merging a feature branch and get a conflict on the submodule, run

`git mergetool`

In order to bring up a prompt to make selection between the local or remote submodule commit. Its recommended to pick the later commit when doing this selection.

<h3 id="installing-globals">Installing required globals</h3>

All should be prepended with `$ npm install --global`:

1. [`webpack`](https://www.npmjs.com/package/webpack)
1. [`webpack-dev-server`](https://www.npmjs.com/package/webpack-dev-server)
1. [`karma`](https://www.npmjs.com/package/karma)
1. [`protractor`](https://www.npmjs.com/package/protractor)
1. [`typescript`](https://www.npmjs.com/package/typescript)
  - To take full advantage of TypeScript with autocomplete you would have to install it globally and use an editor with the correct TypeScript plugins.
  - TypeScript 1.7.x includes everything you need. Make sure to upgrade, even if you installed TypeScript previously.

<h3 id="serving-locally">Serving the app locally</h3>

1. Fork this repo into your GitHub account. Read more about forking a repo here on GitHub:
[https://help.github.com/articles/fork-a-repo/](https://help.github.com/articles/fork-a-repo/)
1. `$ npm install` or `$ npm update` to make sure you have the latest version of all the packages used in the app.
1. `$ npm run server` to start the local server (development)
  - `$ npm run build:prod`
  - `$ npm run server:prod`

> After you have installed all dependencies you can now run the app. Run `npm run server` to start a local server using `webpack-dev-server` which will watch, build (in-memory), and reload for you. The port will be displayed to you as `http://0.0.0.0:3000` (or if you prefer IPv6, if you're using `express` server, then it's `http://[::1]:3000/`).

<h3 id="submitting-prs">Submitting a pull request</h3>

1. Fork this repo.
1. Create a branch per the guidelines in the README.
1. Ensure that your contribution works via `npm run test`, if applicable.
1. Submit your pull request against the `comp` branch using the PULL REQUEST TEMPLATE.

Have questions or need help with setup? Open an issue here [https://csp-github.sam.gov/GSA-IAE/sam-front-end/issues](https://csp-github.sam.gov/GSA-IAE/sam-front-end/issues).

<h2 id="coding-standards">Coding standards</h2>

|Name                |Style                          |Example           |
|:-------------------|:-----------------------------:|:----------------:|
|Class names         |TitleCased                     |Select = {}       |
|Function definitions|camelCased                     |isRequired(config)|
|Variable names      |camelCased and self documenting|isRequired = true; <br> NOT i = true;|
|Configuration JSON member names|camelCased and self documenting|srOnly: true <br> NOT sr-only: true <br> NOT s: true|
|Tabs & spaces       |Follow the provided linter and provided .editorconfig|n/a |

<h3 id="design">Design</h3>

Each module is written in a [self-documenting](https://en.wikipedia.org/wiki/Self-documenting_code) fashion as much as possible. This means sometimes extracting the logic of a conditional to a method to increase human readability.


```
if (this.hasSelected(config)) {
  
}

hasSelected = function(config) {
  return (config.selected !== undefined && config.selected.length > 0);
}
```

Instead of:

```
if (config.selected !== undefined && config.selected.length > 0) {
  
}
```

<h3 id="naming-conventions">Naming conventions</h3>

- Injectable services end with Service (e.g. `SearchService`)
- Pipes end with Pipe (e.g. `CapitalizePipe`)
- Components end with Component (e.g. `AssistanceListingResultComponent`)
- Components with an associated route and module end in Page (e.g. `SearchPage`)
- Exported components in the ui-kit will be prefixed with "Sam". Their class names follow the CamelCase standard referenced above (e.g. `SamSelectComponent`). Their selectors, however, will be prefixed and ["kebab-cased"](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles) (e.g. `<sam-select>`).

<h3 id="doc-blocks">Doc-blocks</h2>

[typedoc verbiage...??]

<h2 id="helpful-commands">Helpful commands</h2>
 
<h3 id="build-files">Build files</h3>

```bash
# development
npm run build:dev
# production
npm run build:prod
```

<h3 id="hot-module-replacement">Hot module replacement</h3>

```bash
npm run server:dev:hmr
```

<h3 id="watch-and-build-files">Watch and build files</h3>

```bash
npm run watch
```

<h3 id="run-tests">Run tests</h3>

**Base tests**

```bash
npm run test
```

**Tests + watch**

```bash
npm run watch:test
```

<h3 id="end-to-end">End to end</h3>

**End-to-end tests**

```bash
# make sure you have your server running in another terminal
npm run e2e
```

**run webdriver**

```bash
npm run webdriver:update
npm run webdriver:start
```

**run Protractor's elementExplorer**

```bash
npm run webdriver:start
# in another terminal
npm run e2e:live 
```

