[![Linter](https://github.com/AzazKamaz/baambook/actions/workflows/linter.yml/badge.svg?branch=master)](https://github.com/AzazKamaz/baambook/actions/workflows/linter.yml)

# baambook

The **baambook** is an application to share QR codes to other people using live sharing sessions. You can start session and scan any QR code to share it with people who joined you using URL.

It is available online at https://baambook.azazkamaz.me

## Contents

- [baambook](#baambook)
  - [Contents](#contents)
  - [Installation & Run](#installation--run)
  - [Testing & Linting](#testing--linting)
  - [Artifact](#artifact)
  - [Authors](#authors)
  - [License](#license)

## Installation & Run

Project can be easily started using [Docker Compose](https://docs.docker.com/compose/):
1. Ensure that Docker Compose is installed: [guide](https://docs.docker.com/compose/install/)
2. Start `docker-compose up` in project directory
3. Baambook is available on http://localhost:4000/

## Testing & Linting

[![Linter](https://github.com/AzazKamaz/baambook/actions/workflows/linter.yml/badge.svg)](https://github.com/AzazKamaz/baambook/actions/workflows/linter.yml)

- Linter: results are avalable in [GitHub Actions Workflow](https://github.com/AzazKamaz/baambook/actions/workflows/linter.yml)
- Testing: after reading [Yegor Bugenko's article "The TDD That Works for Me"](https://www.yegor256.com/2017/03/24/tdd-that-works.html), we concluded that it is not necessary for us to do tests until something is broken. Therefore, since everything works, there are no tests

## Artifact

You can see artifact using the [link](https://github.com/AzazKamaz/baambook/wiki/Artifact).

## Authors

- Alexander Krotov
- Igor Belov
- Mark Nicholson
- Kseniya Kudasheva

## License

**baambook** is available under the private license. See the LICENSE file for more info.
