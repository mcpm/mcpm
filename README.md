# mcpm

[![Dependency status](https://img.shields.io/david/mcpm/mcpm.svg?style=flat)](https://david-dm.org/mcpm/mcpm)
[![devDependency Status](https://img.shields.io/david/dev/mcpm/mcpm.svg?style=flat)](https://david-dm.org/mcpm/mcpm#info=devDependencies)
[![Build Status](https://img.shields.io/travis/mcpm/mcpm.svg?style=flat&branch=master)](https://travis-ci.org/mcpm/mcpm)
[![Coverage Status](https://img.shields.io/coveralls/mcpm/mcpm.svg)](https://coveralls.io/github/mcpm/mcpm?branch=master)
[![Code Climate](https://img.shields.io/codeclimate/github/mcpm/mcpm.svg)](https://codeclimate.com/github/mcpm/mcpm)

## Installation

    npm install mcpm

## Usage

```Text
  Usage: mcpm [options] [command]


  Commands:

    install|i <packages...>  install one or more packages
    minecraft-version|mc     display currently selected Minecraft version

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -v, --verbose  Increase verbosity

  Examples:

    Install a package from the ./foo directory
      $ mcpm install ./foo

    Install a package from the ./foo.zip archive
      $ mcpm install ./foo.zip

    Show the Minecraft version of the currently selected profile
      $ mcpm mc
```

## Testing

    npm test

## Roadmap

See the [Roadmap](https://github.com/mcpm/mcpm/wiki/Roadmap) page in the [wiki](https://github.com/mcpm/mcpm/wiki).
