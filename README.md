English | [简体中文](./README_zh-CN.md)

# umi

[![codecov](https://codecov.io/gh/umijs/umi/branch/master/graph/badge.svg)](https://codecov.io/gh/umijs/umi)
[![NPM version](https://img.shields.io/npm/v/umi.svg?style=flat)](https://npmjs.org/package/umi)
[![CircleCI](https://circleci.com/gh/umijs/umi/tree/master.svg?style=svg)](https://circleci.com/gh/umijs/umi/tree/master)
[![Build Status](https://chenshuai2144.visualstudio.com/umi/_apis/build/status/umijs.umi?branchName=master)](https://chenshuai2144.visualstudio.com/umi/_build/latest?definitionId=1&branchName=master)
[![GitHub Actions status](https://github.com/umijs/umi/workflows/Node%20CI/badge.svg)](https://github.com/umijs/umi)
[![NPM downloads](http://img.shields.io/npm/dm/umi.svg?style=flat)](https://npmjs.org/package/umi)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

🌋 Pluggable enterprise-level react application framework.

> Please consider following this project's author, [sorrycc](https://github.com/sorrycc), and consider starring the project to show your ❤️ and support.

---

## Features

- 📦 **Out of box**, with built-in support for react, react-router, jest, webpack, rollup, etc.
- 🏈 **Next.js like and [full featured](https://umijs.org/guide/router.html) routing conventions**, which also supports configured routing
- 🎉 **Plugin system**, covering every lifecycle from source code to production
- 🚀 **High performance**, including PWA support, route-level code splitting, etc.
- 💈 **Support for static export**, Suitable for environments without server
- 🚄 **Fast dev startup**, including [dll](https://umijs.org/plugin/umi-plugin-react.html#dll) support with config etc.
- 🐠 **Polyfill solution**, add JS and CSS polyfill with [targets](https://umijs.org/config/#targets) config, lowest to IE9
- 🍁 **Support TypeScript**, including d.ts definition and `umi test`
- 🌴 **Deep integration with [dva](https://dvajs.com/)**, including duck directory support, automatic loading of model, code splitting, etc
- ⛄️ **Support MPA**, based on [umi-plugin-mpa](https://github.com/umijs/umi-plugin-mpa)
- 💄 **Visual Assist Programming**, using [Umi UI](https://umijs.org/guide/umi-ui.html) to improve development efficiency.
- 🌈 **Support SSR**, [usage](https://umijs.org/guide/ssr.html).

[And more.](https://www.npmjs.com/search?q=umi-plugin)

## Getting Started

```bash
# Install deps
$ yarn global add umi # OR npm install -g umi

# Create application
$ mkdir myapp && cd myapp

# Create page
$ umi generate page index

# Start dev server
$ umi dev

# Build and deploy
$ umi build
```

[Getting started with a 10 minutes video](https://youtu.be/vkAUGUlYm24)

## Examples

- [Ant Design Pro](https://github.com/ant-design/ant-design-pro)
- [Antd Admin](https://github.com/zuiidea/antd-admin)

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)]. <a href="https://github.com/umijs/umi/graphs/contributors"><img src="https://opencollective.com/umi/contributors.svg?width=890&button=false" /></a>

## Community

| Github Issue                                            | 钉钉群                                                                                                                         | 微信群                                                                                      |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| [umijs/umi/issues](https://github.com/umijs/umi/issues) | <img src="https://img.alicdn.com/tfs/TB1KxCae9f2gK0jSZFPXXXsopXa-1125-1485.jpg" width="60" /> | <img src="https://img.alicdn.com/tfs/TB1pd1ce8r0gK0jSZFnXXbRRXXa-430-430.jpg" width="60" /> |

## License

[MIT](https://github.com/umijs/umi/blob/master/LICENSE)
