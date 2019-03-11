
<h1 align="center">
  <p align="center">@qfin/logger</p>
  <p align="center" style="font-size: 0.5em">The most awesome isomorphic logger for NodeJs and Browsers 😎 ❤</p>
</h1><br />
<!-- This file is automatically generated. Please don't edit it directly:
if you find an error, edit the source files, and re-run
./build/generate-docs.js from the project root. -->

<p align="center">
    <a href="https://twitter.com/acdlite/status/974390255393505280"><img src="https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg" alt="Blazing Fast"></a>
    <a href="https://badge.fury.io/js/%40qfin%2Flogger"><img src="https://badge.fury.io/js/%40qfin%2Flogger.svg" alt="npm version" height="18"></a>
    <a href="https://circleci.com/gh/quantofin/logger"><img src="https://circleci.com/gh/quantofin/logger.svg?style=shield" alt="CircleCI Build Status"></a>
    <a href="https://codecov.io/gh/quantofin/logger">
    <img src="https://codecov.io/gh/quantofin/logger/branch/master/graph/badge.svg" />
    </a>
</p>
<p align="center">
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
    <a href="https://snyk.io/test/github/quantofin/logger?targetFile=package.json"><img src="https://snyk.io/test/github/quantofin/logger/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/quantofin/logger?targetFile=package.json" style="max-width:100%;"></a>
</p>
<p align="center">
    <a href="https://twitter.com/intent/follow?screen_name=quantofin"><img src="https://img.shields.io/twitter/follow/quantofin.svg?style=social&label=Follow%20@quantofin" alt="Follow on Twitter"></a>  
</p>

# 📦 Features

- Support for [ES6 modules](http://exploringjs.com/es6/ch_modules.html)
- Is a fast JSON logger that supports pretty printing in development mode
- Has static methods, instance methods, child loggers, log file support etc.
- Supports both Browsers and NodeJs

# 💾 Install

**Latest Release:** @qfin/logger:0.0.16

```bash
npm install @qfin/logger
```

# ⚙ Module Documentation

>Documentation is available at [https://quantofin.github.io/logger/](https://quantofin.github.io/logger/)

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## Logger

The Logger class

Type: [Logger][1]

### Parameters

-   `options` **[object][2]?** Configuration options for the logger.
    -   `options.base` **[object][2]** An object with base properties that will be printed with every log line. (optional, default `null`)
    -   `options.name` **[string][3]** The name of the logger. It is a good practice to give names for easier identification of modules for example. (optional, default `undefined`)
    -   `options.level` **[string][3]** The log level. One of 'fatal', 'error', 'warn', 'info', 'debug', 'trace' or 'silent'. (optional, default `'info'`)
    -   `options.file` **[string][3]** The location of the log file. If not given, logs will be outputted to std out/err. (optional, default `undefined`)
    -   `options.prettyPrint` **[boolean][4]?** Whether to pretty print the logs or output json lines
    -   `options.redact` **([object][2] \| [array][5])?** The object props to redact from the output. As an array, the redact option specifies paths that should have their values redacted from any log output. Each path must be a string using a syntax which corresponds to JavaScript dot and bracket notation. If an object is supplied, three options can be specified: `paths`, `censor` and `remove`.
        -   `options.redact.paths` **[array][5]** Required. An array of paths.
        -   `options.redact.censor` **([string][3] \| [function][6] \| [undefined][7])** Censor option will overwrite keys which are to be redacted. (optional, default `'[Redacted]'`)
        -   `options.redact.remove` **[boolean][4]** Instead of censoring the value, remove both the key and the value. (optional, default `false`)
    -   `options.browser` **[object][2]** Config for browsers only. (optional, default `undefined`)
        -   `options.browser.write` **([function][6] \| [object][2])?** Instead of passing log messages to console.log they can be passed to a supplied function.
            If write is an object, it can have methods that correspond to the levels. When a message is logged at a given level, the corresponding method is called. If a method isn't present, the logging falls back to using the console.

### Examples

```javascript
import Logger from '@qfin/logger';

// this creates a parent logger with name (my-app)
const logger = new Logger({ name: 'my-app', level: 'info' });

logger.info('Hello world from my awesome app!');
logger.debug('This will not be printed');

// --- somewhere else in the codebase

import Logger from '@qfin/logger';

// this creates a child logger with name (db) and it takes the log-level of the parent logger
const dbLogger = new Logger({ name: 'db' });

dbLogger.info('Successfully connected to Database: ', `${db.host}:${db.port}/${db.name}`);

// --- static logger usage

import Logger from '@qfin/logger';

// If logger is already initialized, then the parent logger reference will be used in this static call
// otherwise, a default parent logger will be initialized and then that will be used for logging
Logger.log('This is a static logger log');
```

### log

Write a log with default or set level. The level can be set in the constructor parameter

#### Parameters

-   `arg0` **[object][2]?** See [Logger's log method for more info][Logger.log][8].
-   `args` **...any?** See [Logger's log method for more info][Logger.log][8].

### trace

Write a 'trace' level log, if the configured level allows for it.

#### Parameters

-   `arg0` **[object][2]?** See [Logger's log method for more info][Logger.log][8].
-   `args` **...any?** See [Logger's log method for more info][Logger.log][8].

### debug

Write a 'debug' level log, if the configured level allows for it.

#### Parameters

-   `arg0` **[object][2]?** See [Logger's log method for more info][Logger.log][8].
-   `args` **...any?** See [Logger's log method for more info][Logger.log][8].

### info

Write a 'info' level log, if the configured level allows for it.

#### Parameters

-   `arg0` **[object][2]?** See [Logger's log method for more info][Logger.log][8].
-   `args` **...any?** See [Logger's log method for more info][Logger.log][8].

### warn

Write a 'warn' level log, if the configured level allows for it.

#### Parameters

-   `arg0` **[object][2]?** See [Logger's log method for more info][Logger.log][8].
-   `args` **...any?** See [Logger's log method for more info][Logger.log][8].

### error

Write a 'error' level log, if the configured level allows for it.

#### Parameters

-   `arg0` **[object][2]?** See [Logger's log method for more info][Logger.log][8].
-   `args` **...any?** See [Logger's log method for more info][Logger.log][8].

### fatal

Write a 'fatal' level log, if the configured level allows for it.

#### Parameters

-   `arg0` **[object][2]?** See [Logger's log method for more info][Logger.log][8].
-   `args` **...any?** See [Logger's log method for more info][Logger.log][8].

### log

Static Method

Write a log with default or set level.

If the logger has already been initialized then the log level will be referred from the initialized logger,
otherwise a new logger will be initialized and its default properties will be set and used.

#### Parameters

-   `arg0` **[object][2]?** An object can optionally be supplied as the first parameter. Each enumerable key and value of the mergingObject is copied in to the JSON log line.
-   `args` **...any?** `args` are of type varargs and each of the args can take various forms as follows:-   A message string can optionally be supplied as the first parameter, or as the second parameter after supplying a mergingObject.
        By default, the contents of the message parameter will be merged into the JSON log line under the msg key.

    -   All arguments supplied after message are serialized and interpolated according to any supplied printf-style placeholders (%s, %d, %o|%O|%j) or else concatenated together with the message string to form the final output msg value for the JSON log line.

#### Examples

```javascript
logger.info({MIX: {IN: true}})
// {"level":30,"time":1531254555820,"MIX":{"IN":true},"v":1}

logger.info('hello world')
// {"level":30,"time":1531257112193,"msg":"hello world","v":1}

logger.info('hello', 'world')
// {"level":30,"time":1531257618044,"msg":"hello world","v":1}

logger.info('hello', {worldly: 1})
// {"level":30,"time":1531257797727,"msg":"hello {\"worldly\":1}","v":1}

logger.info('%o hello', {worldly: 1})
// {"level":30,"time":1531257826880,"msg":"{\"worldly\":1} hello","v":1}
```

### trace

Static Method

Write a 'trace' level log, if the configured level allows for it.

If the logger has already been initialized then the log level will be referred from the initialized logger,
otherwise a new logger will be initialized and its default properties will be set and used.

#### Parameters

-   `arg0` **[object][2]?** See [Logger's log method for more info][Logger.log][8].
-   `args` **...any?** See [Logger's log method for more info][Logger.log][8].

### debug

Static Method

Write a 'debug' level log, if the configured level allows for it.

If the logger has already been initialized then the log level will be referred from the initialized logger,
otherwise a new logger will be initialized and its default properties will be set and used.

#### Parameters

-   `arg0` **[object][2]?** See [Logger's log method for more info][Logger.log][8].
-   `args` **...any?** See [Logger's log method for more info][Logger.log][8].

### info

Static Method

Write a 'info' level log, if the configured level allows for it.

If the logger has already been initialized then the log level will be referred from the initialized logger,
otherwise a new logger will be initialized and its default properties will be set and used.

#### Parameters

-   `arg0` **[object][2]?** See [Logger's log method for more info][Logger.log][8].
-   `args` **...any?** See [Logger's log method for more info][Logger.log][8].

### warn

Static Method

Write a 'warn' level log, if the configured level allows for it.

If the logger has already been initialized then the log level will be referred from the initialized logger,
otherwise a new logger will be initialized and its default properties will be set and used.

#### Parameters

-   `arg0` **[object][2]?** See [Logger's log method for more info][Logger.log][8].
-   `args` **...any?** See [Logger's log method for more info][Logger.log][8].

### error

Static Method

Write a 'error' level log, if the configured level allows for it.

If the logger has already been initialized then the log level will be referred from the initialized logger,
otherwise a new logger will be initialized and its default properties will be set and used.

#### Parameters

-   `arg0` **[object][2]?** See [Logger's log method for more info][Logger.log][8].
-   `args` **...any?** See [Logger's log method for more info][Logger.log][8].

### fatal

Static Method

Write a 'fatal' level log, if the configured level allows for it.

If the logger has already been initialized then the log level will be referred from the initialized logger,
otherwise a new logger will be initialized and its default properties will be set and used.

#### Parameters

-   `arg0` **[object][2]?** See [Logger's log method for more info][Logger.log][8].
-   `args` **...any?** See [Logger's log method for more info][Logger.log][8].

[1]: #logger

[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[5]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[6]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[7]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined

[8]: #loggerlog
