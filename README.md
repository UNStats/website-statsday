# Website for World Statistics Day 2015

[![Build Status](https://travis-ci.org/UNStats/website-statsday.svg?branch=master)](https://travis-ci.org/UNStats/website-statsday)

This repository contains the source code for the [World Statistics Day 2015](https://worldstatisticsday.org/) website. This website is a [Jekyll](http://jekyllrb.com/) site that runs on the [UNStats website-theme](https://github.com/UNStats/website-theme) plugin, which is based on [Octopress Ink](https://github.com/octopress/ink).

## Contributing

[Fork this repository](https://help.github.com/articles/fork-a-repo/) and execute

    bundle install

to install all dependencies locally. Execute

    [bundle exec] rake site:preview

to launch this site locallz at http://localhost:4000. Follow these contribution guidelines:

- [Create an issue](https://github.com/UNStats/website-statsday/issues) and describe what you plan to work on. Start coding only after you get the go-ahead.
- Create a separate branch for each issue.
- Anything on branch `master` is stable and production ready. Always branch off `master` to create a feature branch.
- Mention the issue your work on in your commit messages.
- Before [submitting a pull request](https://help.github.com/articles/using-pull-requests/), execute `[bundle exec] rake site:validate]`, clean up your commit history and rebase your feature branch on `master`.

## Deployment

There are 3 deployment options:

1. Push to `origin/development` triggers a [development build](https://github.com/UNStats/website-theme#development-build) on [Travis CI](https://travis-ci.org/UNStats/website-sdgs) that is automatically pushed to the development environment.
1. Push to `origin/staging` triggers a [staging build](https://github.com/UNStats/website-theme#staging-build) on [Travis CI](https://travis-ci.org/UNStats/website-sdgs) that is automatically pushed to the staging environment.
1. Push to `origin/master` triggers a [production build](https://github.com/UNStats/website-theme#production-build) on [Travis CI](https://travis-ci.org/UNStats/website-sdgs) that is automatically pushed to `origin/gh-pages` and then automatically published on [GitHub Pages](https://pages.github.com/).

Pushing to branches in forked repositories will not trigger a deploy.
