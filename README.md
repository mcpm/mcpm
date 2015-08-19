# mcpm

[![Dependency status](https://img.shields.io/david/mcpm/mcpm.svg?style=flat)](https://david-dm.org/mcpm/mcpm)
[![Build Status](https://img.shields.io/travis/mcpm/mcpm.svg?style=flat&branch=master)](https://travis-ci.org/mcpm/mcpm)
[![Coverage Status](https://img.shields.io/coveralls/mcpm/mcpm.svg)](https://coveralls.io/github/mcpm/mcpm?branch=master)

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

- [io.js](https://iojs.org)
- `$ npm install -g gulp` ([gulp](http://gulpjs.com/) is an automation tool)
- Fork [this repo](https://github.com/mcpm/mcpm)
- Check out it locally
- `$ npm install`

#### Workflow

- [Write tests](https://en.wikipedia.org/wiki/Test-driven_development)
- `$ gulp test`
- Write code
- `$ gulp test`

#### Make a pull request

- Push changes to your fork (don't push to `master`, create a separate branch)
- Make a pull request on GitHub

## Roadmap

See the [Roadmap](https://github.com/mcpm/mcpm/wiki/Roadmap) page in the [wiki](https://github.com/mcpm/mcpm/wiki).
