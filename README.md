# FunRetro io solution by Gabriel Pereira

What I have changed:

## Project structure

Updated the project structure to:

--exported \
-- src/ \
---- index.js \
---- utils/ \
------ helpers.js

The `exported` folder is the default output of exported files.
The `src` folder is where the main code is located.
The `utils` folder holds the helper functions file

## Format for third argument

Added the `format` as third argument of the execution scriot. The `format` argument currently accepts: `csv` (default), `pdf`, and `txt`.

## Code splitting

Also, one last modification from the original source code was the code splitting. I've created a `helpers.js` file to concentrate all helper functions, the only code that stayed in the `index.js` is the code related to the `run()` method. It could even be better organized, segregating the `get` methods in one file and other files for each purposes.

## RunCSV algorithm

For the `runCSV()` function, I've created an algorithm that doesn't require more loops then the original ones (n²). This was not the most easy to ready alternative, but I focused in the performance of this algorithm.
