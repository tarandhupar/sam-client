
<ul>
  <li>
    <a href="rules-of-engagement">Rules of engagement</a>
    <ul>
      <li><a href="#branching">Branching</a></li>
      <li><a href="#pull-requests">Pull requests</a></li>
      <li><a href="#merging">Merging</a></li>
      <li><a href="#testing">Testing</a></li>
    </ul>
  </li>
  <li><a href="#where-things-are">Where things are</a></li>
  <li><a href="#where-things-go">Where things go</a></li>
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

<h3 id="testing">Testing</h3>

1. We write both unit and end to end tests for this project.
1. We develop components using a behavior driven development pattern to view the components from a user's perspective.
1. We strive to achieve [...] code coverage.

<h2 id="where-things-are">Where things are</h2>

1. `config`: application configuration files (webpack, for example).
2. `src`: all the code required for running the app.
  1. `api-kit`: a service for making API calls to the various microservices.
  2. `ui-kit`: stores user interface components used on more than one page.
  3. `assets`: ???
  4. `app`: pages, page-specific UI components, and so on.
3. `api-config.json` or `api-config.example.json`: we use a single API key within the marketplace for local development; therefore, the API key is set, and all you should need to do is rename this file to `api-config.json`.

<h2 id="where-things-go">Where things go</h2>

1. Page components: `/src/app/{business object or business epic}` - When possible, use the business object (ex. opportunity) to isolate pages, routes, and user interface components specific to that business object.
1. Pipes:
  - If the pipe is for a specific business object or business epic, place them in a `pipes` subfolder.
  - If the pipe is used by two or more business object/epic areas, place them in<br>`/src/app/app-pipes`
1. User interface components:
  - If the component is for a specific business object or business epic, place them in a folder with the generic component name (ex. `search-result`).
  - If the component is used by two or more business object/epic areas, place them in<br>`/src/ui-kit`
  - 
  

