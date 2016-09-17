# mcpm

[![Dependency status](https://img.shields.io/david/mcpm/mcpm.svg?style=flat)](https://david-dm.org/mcpm/mcpm)
[![Build Status](https://img.shields.io/travis/mcpm/mcpm.svg?style=flat&branch=master)](https://travis-ci.org/mcpm/mcpm)
[![Coverage](https://img.shields.io/codeclimate/coverage/github/mcpm/mcpm.svg)](https://codeclimate.com/github/mcpm/mcpm)
[![Code Climate](https://img.shields.io/codeclimate/github/mcpm/mcpm.svg)](https://codeclimate.com/github/mcpm/mcpm)

## Installation

[![npm version](https://img.shields.io/npm/v/mcpm.svg)](https://www.npmjs.com/package/mcpm)
[![npm downloads](https://img.shields.io/npm/dm/mcpm.svg)](https://www.npmjs.com/package/mcpm)

    npm install -g mcpm

## Usage

```Text
  Usage: mcpm [options] [command]


  Commands:

    install|i <packages...>  install one or more packages
    minecraft-version|mc     display currently selected Minecraft version

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -v, --verbose  increase verbosity

  Examples:

    Install a package from the ./foo directory
      $ mcpm install ./foo

    Install a package from the ./foo.zip archive
      $ mcpm install ./foo.zip

    Install a package from cache
      $ mcpm install foo@0.2.0

    Show the Minecraft version of the currently selected profile
      $ mcpm mc
```

## Contributing

#### Prerequisites

- Install [Node.js](https://nodejs.org/)
- Fork and checkout this repo
- Run `npm install` in this directory

#### Workflow

- Run `npm start` to start tests and re-run them on changes
- [Write tests first](https://en.wikipedia.org/wiki/Test-driven_development)
- Write code
- Run `npm check-style` to make sure you follow our style guide
- Make a Pull Request when ready

## Roadmap

See the [Roadmap](https://github.com/mcpm/mcpm/wiki/Roadmap) page in the [wiki](https://github.com/mcpm/mcpm/wiki).
