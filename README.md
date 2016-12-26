# vimeauto-server

This README outlines the details of collaborating on this Node application.

This application allows users to interact with the vimeo api. This is the
back end of the vime(auto) application front end.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)

## Installation

* `git clone https://github.com/Cishkash/vimeauto-server.git` this repository
* `cd vimeauto-server`
* `npm install`

## Preparation

* You will want to set up an `.env` file with your api credentials before you get
  started here like:

```
  module.exports = {
    clientId: ABC123###,
    clientSecret: ABC123###
  }
```
* The application will fetch your access_token and set that token at the
  `app.locals.token` allowing each route access the `access_token`.

## Running / Development

* `npm start`
