# generator-jhipster-obfuscation-at-rest
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JHipster module, JHipster module for creating data obfuscation at rest with JPA support

# Introduction

This is a [JHipster](http://jhipster.github.io/) module, that is meant to be used in a JHipster application.

If you need to obfuscate the data before to store it then you are looking for this jhipster module!

When secret or sensitive data are stored on a database in clear text unauthorized people can potentially look at them and use this information inappropriately. You can obfuscate the fields of your entity using this jhipster module

*This field obfuscation is applicable only with JPA as persistence layer*

> **PAY ATTENTION**
> The used algorithms are very simple, if you want to improve the security you could re-implements the converters

# Prerequisites

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://jhipster.github.io/installation.html)

# Installation

## With Yarn

To install this module:

```bash
yarn global add generator-jhipster-obfuscation-at-rest
```

To update this module:

```bash
yarn global upgrade generator-jhipster-obfuscation-at-rest
```

## With NPM

To install this module:

```bash
npm install -g generator-jhipster-obfuscation-at-rest
```

To update this module:

```bash
npm update -g generator-jhipster-obfuscation-at-rest
```

# Usage

To run the module on a JHipster generated application:
```bash
yo jhipster-obfuscation-at-rest
```

The module will prompting about obfuscation during the JHipster generation entity
```bash
jhipster entity YourEntity
```
After, the entity generation will start the *post run module hooks*.
Suppose that *YourEntity* will have two String fields name and code:
```bash
Running post run module hooks

Running JHipster obfuscation-at-rest Generator! v0.3.0
        Supported types ["String", "LocalDate", "Integer"]

? Do you want to enable the obfuscation for this entity(EntityExample)? Yes
? Which fields do you want to obfuscate?
 ( ) Name
>(*) Code
```
You can select all the fields (if is supported type) to apply the obfuscation.

# License

Apache-2.0 ©


[npm-image]: https://img.shields.io/npm/v/generator-jhipster-obfuscation-at-rest.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-obfuscation-at-rest
[travis-image]: https://travis-ci.org/rsistbloc/generator-jhipster-obfuscation-at-rest.svg?branch=master
[travis-url]: https://travis-ci.org/rsistbloc/generator-jhipster-obfuscation-at-rest
[daviddm-image]: https://david-dm.org/rsistbloc/generator-jhipster-obfuscation-at-rest.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/rsistbloc/generator-jhipster-obfuscation-at-rest
