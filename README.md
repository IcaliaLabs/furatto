# [Furatto](https://github.com/IcaliaLabs/furatto)

Furatto is a lightweight & friendly front-end framework got get the job done, created and maintained by [Abraham Kuri](https://twitter.com/kurenn) from [Icalia Labs](http://twitter.com/icalialabs).


To get started, checkout:

#### [http://icalialabs.github.io/furatto/](http://icalialabs.github.io/furatto/)

## Table of contents
- [Quick start](#quick-start)
- [Bug tracker & feature request](#bug-tracker-&-feature-request)
- [Documentation](#documentation)
- [Compiling CSS and Javascript](#compiling-css-and-javascript)
- [Using Rails](#using-rails)
- [Contributing](#contributing)
- [Community](#community)
- [Using Furatto](#using-furatto)
- [Heroes](#heroes)
- [License](#license)

## Quick start

Using Furatto is extremely easy, we've provided three quick start options:

* [Download the latest release](http://icalialabs.github.io/furatto/).
* Clone the repo: `git clone git@github.com:IcaliaLabs/furatto.git`.
* Install via bower: `bower install furatto`.

We recommend you read the  [Getting started guide](http://icalialabs.github.io/furatto/docs/) for information about the contents, caveats and more.


## Bug tracker & feature request

Have a bug or a feature request? [Please open a new issue](https://github.com/IcaliaLabs/furatto/issues). Before opening any issue, please search for existing issues.

We recommend you to read the version [milestiones](https://github.com/IcaliaLabs/furatto/issues?milestone=2&state=open) if you feel like want to collaborate.


## Documentation

Furatto's documentation is built using [Jekyll](http://jekyllrb.com/) and publish thorugh Github pages at [http://icalialabs.github.io/furatto/](http://icalialabs.github.io/furatto/). You should be able to run them locally.

### Running documentation locally

1. You need to install [Jekyll](http://jekyllrb.com/)
2. From the root of the project `furatto/` run `jekyll serve --watch` from the command line, this way if you change any file jekyll will generate that for you.
3. Open <http://localhost:9001/furatto> and you are good to go.

Jekyll is a great way to work with static pages, we definitely recommend you take a look at the [documentation](http://jekyllrb.com/docs/home).

### Old documentation

We still provide support for version 1 and 2 as it is a big change from one to another, you can visit the old docs [V1](http://icalialabs.github.io/furatto/old_docs/v1/) and [V2](http://icalialabs.github.io/furatto/old_docs/v2/). 

We encourage you to migrate to version 3 as is a more stable, friendly and extendable version.

## Compiling CSS and JavaScript

Furatto V3 now uses [Grunt](http://gruntjs.com/) to compile all the Sass code and start working with the framework. Before getting started you need to add the necessary dependencies:

### Installing Grunt

From the command line:

1. Install `grunt-cli` globally with `npm install -g grunt-cli`.
2. Navigate to the root `/bootstrap` directory, then run `npm install`. npm will look at [package.json](https://github.com/icalialabs/furatto/blob/master/package.json) and automatically install the necessary local dependencies listed there.

If you need to install npm, or you are not quite sure what it is, here is a quick link for you to get started. [NPM](https://github.com/npm/npm)

### Available Grunt tasks

Some of the grunt tasks are:

#### Build - `grunt`
This task will build the whole framework, which means, sass compilation, coffeescript compilation, dist directory creation, compression of files and more.

### Workflow

We have a very useful workflow to work with Furatto and Grunt:

1. Run `jekyll serve --watch` from the command line on the root folder `furatto/`
2. In another terminal run `grunt watch`, which will be pending of any change on any coffeescript or sass file. It will compile everything up and deliver it to Jekyll, which by receiving the change will regenerate the necessary files.

We also include livereload to reload when the watch task is over, for more info refer to the our [Gruntfile](https://github.com/IcaliaLabs/furatto/blob/v3.0.0/Gruntfile.js)

## Using Rails?

A gem to integrate with Furatto is well maintain by [@kurenn](https://twitter.com/kurenn), this will help you start coding your front end right away. Here is the [gem](https://github.com/IcaliaLabs/furatto-rails)

## Contributing

Please submit all pull requests against a separate branch. Please follow the standard for naming the variables, mixins, etc.

In case you are wondering what to attack, we hnow have a milestone with the version to work, some fixes and refactors. Feel free to start one.

Thanks!

## Community

Keep track of new feautres, development issues and community news.

* Follow [@ifuratto](https://twitter.com/furattoicalia)
* Have a question about anything, email us at weare@icalialabs.com

## Using Furatto?

We will love to hear wheter you are using Furatto for testing, prototyping or online sites, checkout who is in already [here](https://github.com/IcaliaLabs/furatto/blob/master/USING_FURATTO.md)


## Authors

**Abraham Kuri**

+ [http://twitter.com/kurenn](http://twitter.com/kurenn)
+ [http://github.com/kurenn](http://github.com/kurenn)
+ [http://klout.com/#/kurenn](http://klout.com/#/kurenn)


## Copyright and license

Code and documentation copyright 2013-2014 Icalia Labs. Code released under [the MIT license](LICENSE).
