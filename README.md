<h1 align="center">
  Rin
  <br>
  <sub><sup>a simple multi-burpose bot</sup></sub>
</h1>

<p align="center">
    <a href="https://travis-ci.org/indmind/rin">
        <img src="https://travis-ci.org/indmind/rin.svg?branch=master" alt="Build Status">
    </a>
    <a href="https://github.com/indmind/rin/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
    </a> 	
    <a href="https://www.npmjs.com/package/standard">
      <img src="https://img.shields.io/npm/v/npm.svg" alt="Npm Version">
    </a>
    <a href="https://nodejs.org/en/download/releases/">
      <img src="https://img.shields.io/node/v/passport.svg" alt="Node Version">
    </a>
    <a href="https://david-dm.org/indmind/rin">
        <img src="https://david-dm.org/indmind/rin/status.svg" alt="Dependencies Status"/>
    </a>
    <a href="https://github.com/prettier/prettier">
        <img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="Styled With Prettier"/>
    </a>
    <a href="http://makeapullrequest.com">
        <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"/>
    </a>
    <a href="https://github.com/facebook/jest">
        <img src="https://img.shields.io/badge/tested_with-jest-99424f.svg" alt="Tested with Jest">
    </a>
    <a href="https://codeclimate.com/github/indmind/rin/maintainability">
        <img src="https://api.codeclimate.com/v1/badges/b9c687b0fcce23320373/maintainability" alt="Maintainability">
    </a>
</p>

<h2>Installation</h2>

Install all dependencies using <a href="https://www.npmjs.com/">npm</a>

`$ npm install`

<h2>Build</h2>

`$ npm run build`

<h2 id="dev">Development</h2>

`cp .env.example .env`

add your token to `.env`

use cli.js (`process.arv`) as input

`$ STATUS=debug npm start calc 1 + 1`

for discord or telegram set `TELEGRAM_TOKEN` or `DISCORD_TOKEN` in `.env`

`$ npm run dev` auto reload (use telegram or discord based on given token)

build and start `main.js` from build

`$ npm start`

you can just add `DISCORD_TOKEN` without `TELEGRAM_TOKEN`

to create a command create a file in `src/commands` folder, create a class that have a method called `handle`, `ready`, and variable `this.INFO` with some data, you can see in other command file

<h3>Info</h3>

`this.INFO` use to define command (__required__), description (__required__), for (__optional__) and required (__optional__)
```js
import Rin from '../core/rin'

export default class Command{
    constuctor() {
        this.INFO = {
            command: 'something',
            description: 'make your life easier',
            for: 'discord' // or array ['discord', 'cli']
            required: [
                {
                    value: process.env.COMMAND_TOKEN,
                    toBe: Rin.notEmpty
                }
            ]
        }
    }
}
```

<h3>Ready</h3>

`ready` is called when `this.INFO.required` passed (__optional__)
```js
import Rin from '../core/rin'

export default class Command{
    constuctor() {
        this.INFO = {
            command: 'sapi',
            description: 'make me happy',
            required: [
                {
                    value: process.env.SAPI_TOKEN,
                    toBe: Rin.notEmpty
                }
            ]
        }

        this.SAPI = new SOMETHING_API()
    }
    
    ready() {
        this.SAPI.register(process.env.SAPI_TOKEN)
    }
}
```

<h3>Handle</h3>

`handle` is called when user type the command
```js
export default class Command{
    constuctor() {
        this.INFO = {
            command: 'kill',
            description: 'kill your ex'
        }
    }
    
    handle(message) {
        const exname = message.join(' ')

        return `${exname} has been killed`
    }
}
```

for helper, create a method in Rin class `src/core/rin.js`

always run `$ npm run lint` if you want to create a PR

<h2>Testing</h2>

`$ npm test`

create a unit test in `test/command` folder for subcommand testing and `test/__data__` for mock data, testing are test src folder, so we don't need to rebuild

<h2>Contributing</h2>

1. Fork this repository
2. Create a feature branch (_never edit your master branch_) `$ git checkout -b add-eat-command`
3. Create your features, see: [development](#dev) section
4. Push your changes `$ git push origin add-eat-command`
5. Create a pull request

I am very happy if you want to contribute!

<h2>License</h2>

This project is licensed under the terms of the MIT license.

Image License: I don't know
