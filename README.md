# FunRetro.io export

[![License][license-badge]][license-url]

> CLI tool to easily export [FunRetro.io](https://funretro.io/) retrospective boards using Playwright

## Installing / Getting started

It's required to have [npm](https://www.npmjs.com/get-npm) installed locally to follow the instructions.

```shell
git clone https://github.com/julykaz/funretro-export.git
cd funretro-export
npm install
```

## Issues

If you encounter the following error

```
Error: browserType.launch: Browser is not supported on current platform
Note: use DEBUG=pw:api environment variable and rerun to capture Playwright logs.
```

then execute this command:

```
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true npm i -D playwright
```

## Licensing

MIT License

[license-badge]: https://img.shields.io/github/license/robertoachar/docker-express-mongodb.svg
[license-url]: https://opensource.org/licenses/MIT

## FunRetro io solution by Gabriel Pereira

What I have changed:

### Initialization

There are two modifications for the initial script:

- The second argument is now the export `PATH` that the exported file will be placed. It cannot be a file like it was before (e.g. `../exported-file.txt` won't work, you should change it for `./` or `./exported`);
- A third argument was added for the exported file format. The accepted keys are: `'txt'`, `'csv'`, and `'pdf'`.

```shell
npm start -- "http://funretro.io/board..." "./exported" "txt"
```

### Project structure

Updated the project structure to:

--exported \
-- src/ \
---- index.js \
---- utils/ \
------ helpers.js

The `exported` folder is the default output of exported files.
The `src` folder is where the main code is located.
The `utils` folder holds the helper functions file

### Format for third argument

Added the `format` as third argument of the execution scriot. The `format` argument currently accepts: `csv` (default), `pdf`, and `txt`.

### Code splitting

Also, one last modification from the original source code was the code splitting. I've created a `helpers.js` file to concentrate all helper functions, the only code that stayed in the `index.js` is the code related to the `run()` method. It could even be better organized, segregating the `get` methods in one file and other files for each purposes.

### RunCSV algorithm

For the `runCSV()` function, I've created an algorithm that doesn't require more loops then the original ones (n²). This was not the most easy to ready alternative, but I focused in the performance of this algorithm.
