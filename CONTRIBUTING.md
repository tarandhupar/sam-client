
<ul>
  <li>
    <a href="rules-of-engagement">Rules of engagement</a>
    <ul>
      <li><a href="#changing">Changing the rules</a></li>
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

<h3 id="changing">Changing the rules</h3>

1. Create an issue describing the perceived issue or deficiency in the process. And, at least, one proposed solution. (See [Issue 60](https://csp-github.sam.gov/GSA-IAE/sam-front-end/issues/60) for an example.)
1. A discussion must take place and a suggested course of action determined. In keeping with the [Advice Process](http://www.reinventingorganizationswiki.com/Decision_Making) value from the [front-end team values](http://gsaiae.confluence.micropaas.io:8090/display/UX/SAM.gov+Front+End), the more people the desired change impacts, the more opportunity for discussion and awareness should be used.
1. Implement the change and close the Issue as appropriate.

Note: If JIRA tickets are created in conjunction with the proposed solution, please add a link to the JIRA ticket in the Issue *or* related pull requests (per the pull requests section).


<h3 id="branching">Branching</h3>

Gitflow Workflow branch names:

`develop` is used to deploy to the `comp` enviroment.
`master` is used to deploy to all other environments.

1. Do not work in `develop` or `master` directly.
1. Do not merge feature branches into `master`.
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
  1. `api-kit`: a service for making API calls to the various microservices. (Depends on Angular 2)
  2. `ui-kit`: stores user interface components used on more than one page. (Depends on Angular 2)
  3. `sam-ui-kit`: similar to the `ui-kit`; however, is dependent on the `api-kit` to make the components function properly. (Depends on Angular 2)
  4. `samwds`: images, JavaScript, fonts, and stylesheets which compile into a package that can be used to generate a front-end, independent of framework. (Framework agnostic)
  5. `app`: pages, page-specific UI components, and so on.
3. `api-config.json` or `api-config.example.json`: we use a single API key within the marketplace for local development; therefore, the API key is set, and all you should need to do is rename this file to `api-config.json`.

<h3>sam-api-kit</h3>

The SAM API Kit houses Angular 2 services that allow a developer using the kit to make calls to the SAM.gov APIs and services.

{ add folder structure }

<h3>ui-kit</h3>

The UI Kit houses reusable components, which should be generic enough to be used outside of the SAM.gov application.

{ add folder structure }

<h3>sam-ui-kit</h3>

The SAM UI Kit houses components. Unlike the base SAM UI Kit, the SAM UI Kit depends on the SAM API Kit for its components to function as expected.

Note: This is currently called `app-components` and is in the `app` folder.

{ add folder structure, if different than ui-kit }

<h3>samwds</h3>

The SAMWDS houses images, fonts, stylesheets, and possibly JavaScript, which are compiled into the main assets directory used to complete the front-end. Effectively separating structure (the UI Kits) from the style and enhancements.

{ add folder structure }

<h2 id="where-things-go">Where things go</h2>

1. Page components: `/src/app/{business object or business epic}` - When possible, use the business object (ex. opportunity) to isolate pages, routes, and user interface components specific to that business object.
1. Pipes:
  - If the pipe is for a specific business object or business epic, place them in a `pipes` subfolder.
  - If the pipe is used by two or more business object/epic areas, place them in<br>`/src/app/app-pipes`
1. User interface components:
  - If the component is for a specific business object or business epic, place them in a folder with the generic component name (ex. `search-result`).
  - If the component is used by two or more business object/epic areas, place them in<br>`/src/ui-kit`
  - If the component requires the `sam-api-kit`, place them in <br>`/src/app/app-components`




