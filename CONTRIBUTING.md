<ul>
  <li>
    <a href="#guidelines">Guidelines</a>
    <ul>
      <li><a href="#submitting-prs">Submitting pull requests</a></li>
    </ul>
  </li>
  <li><a href="#design">Design</a></li>
  <li><a href="#coding-standards">Coding Standards</a></li>
  <li><a href="#doc-blocks">Doc-blocks</a></li>
  <li><a href="#test-coverage">Test coverage</a></li>
</ul>

<h2 id="guidelines">Guidelines</h2>

1. Pull requests should contain small changes to the codebase to minimize merge conflicts and large integrations.
1. Discovered merge conflicts within a pull request should be corrected by the submitter of the pull request.
1. No code freezes will be instituted; if a pull request cannot be merged or the functionality cannot be demonstrated at the Sprint review, the work will rollover to the next release (or Sprint).
1. Pull requests are reviewed and approved using the [GitHub review process](https://help.github.com/articles/about-pull-request-reviews/). Note: Reviewers should only use the "comment" or "request changes" options.
1. Branch names should consist of the ticket ID being worked and a brief description. Ex. `SGA-201-header-component`. Note: Per the first guideline, large tickets can be broken down, either by creating more tickets under the main ticket; or, by modifying the tail of the branch name to enable multiple concurent pull requests.
1. We have templates for [Pull Requests](https://csp-github.sam.gov/GSA-IAE/sam-front-end/blob/comp/.github/PULL_REQUEST_TEMPLATE.md) and [Issues](https://csp-github.sam.gov/GSA-IAE/sam-front-end/blob/comp/.github/ISSUE_TEMPLATE.md), please use them when applicable. Note: Sometimes GitHub will not automatically use the templates as it is supposed to.
1. The Pull Request template contains a checklist for reviewers to use to determine if a pull request should be merged.

Gitflow Workflow branch names:

`comp` is equivalent to `develop`.
`minc`, `prodlike` have no Gitflow equivalent.
`master` is equivalent to `master`. 

<h3 id="submitting-prs">Submitting a pull request</h3>

Here are a few guidelines to follow when submitting a pull request:

1. Create a GitHub account or sign in to your existing account.
1. Fork this repo into your GitHub account. Read more about forking a repo here on GitHub:
[https://help.github.com/articles/fork-a-repo/](https://help.github.com/articles/fork-a-repo/)
1. Create a branch per the guidelines above.
1. Ensure that your contribution works via `npm`, if applicable.
1. Submit your pull request against the `comp` branch.

Have questions or need help with setup? Open an issue here [https://csp-github.sam.gov/GSA-IAE/sam-front-end/issues](https://csp-github.sam.gov/GSA-IAE/sam-front-end/issues).

<h2 id="design">Design</h2>

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

<h2 id="coding-standards">Coding standards</h2>

|Name                |Style                          |Example           |
|:-------------------|:-----------------------------:|:----------------:|
|Class names         |TitleCased                     |Select = {}       |
|Function definitions|camelCased                     |isRequired(config)|
|Variable names      |camelCased and self documenting|isRequired = true; <br> NOT i = true;|
|Configuration JSON member names|camelCased and self documenting|srOnly: true <br> NOT sr-only: true <br> NOT s: true|
|Tabs & spaces       |Follow the provided linter and provided .editorconfig|n/a |

<h2 id="doc-blocks">Doc-blocks</h2>

...

<h2 id="test-coverage">Test coverage</h2>

...