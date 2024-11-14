## Instructions
## Read before you clone!!!
Clone the repository and create a new branch off the main branch to have the latest update in your branch.
After adding your changes, push your branch as an upstream with:
`git push --set-upstream origin <your branch name>`
then create a new pull request to be reviewed and approved by the parent account.

Remeber to change your local clone to the staging branch and pull the latest update of the staging branch so you have the latest code before you make new changes.


## branching convention
When creating a new branch, please follow this convention <your-initials>/<sprint-name>/<title-of-your-user-story> 
For Instance: oh/orion/implement-bookmarking-feature

Don't for get to change to the main branch in your local clone and pull the new code updates on the project



=======
## After making Changes!!!
after you've pushed you changes to to your branch, make a pull request to the staging branch not the production(main) branch.


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

