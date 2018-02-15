<center> <h1>Rin</h1>

[![Build Status](https://travis-ci.org/indmind/rin.svg?branch=master)](https://travis-ci.org/indmind/rin)

a simple Multi-Purpose Bot

## Installation

Install all depencies

`$ npm install`

## Build

`$ npm run build`

it's just simple transpile es6 using babel

## Development

`$ npm run dev` 

default vendor is using `src/vendor/cli.js`

for discord or telegram add `VENDOR` env

`$ TOKEN=your_token VENDOR=discord/telegram npm start`

to create subcommand create a file in `src/command` folder, create a class that have a method called `handle` and export it

for helper, create a method in Rin class `src/core/rin.js`

always run `$ npm run fix` if you want to create a PR

## Test

`$ npm test`

create a unit test in `test/command` folder for subcommand testing and `test/__data__` for mock data, testing are test src folder, so we don't need to rebuild

## Contributing

I am very happy if you want to contribute!

</center>
