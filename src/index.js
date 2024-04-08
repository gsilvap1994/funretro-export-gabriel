const { chromium } = require("playwright");

// utilities functions from another file
const {
  getBoardTitle,
  getColumnTitle,
  getColumns,
  getMessageText,
  getMessages,
  getVotes,
  parseHashMapToCSV,
  writeToFile,
} = require("./utils/helpers");

// added format as the third argument
const [url, folderPath, format] = process.argv.slice(2);

if (!url) {
  throw "Please provide a URL as the first argument.";
}

// Accepted formats are: pdf, csv and txt
if (format !== "pdf" && format !== "csv" && format !== "txt") {
  throw "The current accepted formats are: 'txt', 'pdf' and 'csv'";
}

// function for running the CSV export script
async function runCSV(page, boardTitle) {
  let parsedText = "";

  // the hashMap will be the object that holds the csv structure
  // the entries of the hashMap are the rows
  let hashMap = {};

  const columns = await getColumns(page);

  for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
    const columnTitle = await getColumnTitle(columns, columnIndex);

    // the first row is the column title row
    hashMap[0] = hashMap[0] ? `${hashMap[0]},${columnTitle}` : columnTitle;

    const messages = await getMessages(columns, columnIndex);

    // this counter is needed to put the next colum messages at the right rows
    let hashMapcounter = 1;

    for (let rowIndex = 0; rowIndex < messages.length; rowIndex++) {
      const messageText = await getMessageText(messages, rowIndex);
      const votes = await getVotes(messages, rowIndex);
      parsedText = `${messageText} (${votes})`;

      // Acceptance criteria: only export cards that have at least 1 vote
      if (+votes > 0) {
        // if there is already a message in this row, then we should add a comma and the new message
        // this represents a new column inside csv
        hashMap[hashMapcounter] = hashMap[hashMapcounter]
          ? `${hashMap[hashMapcounter]},${parsedText}`
          : parsedText;
        hashMapcounter++;
      } else {
        // if nothing had been added to this row, then we should add a comma
        // this way we guarantee that this column will be blank
        if (
          hashMap[hashMapcounter] &&
          // but also we need to only insert one comma at the end,
          hashMap[hashMapcounter].slice(-1) !== ","
        ) {
          hashMap[hashMapcounter] += ",";
        }
      }
    }
  }

  return {
    parsedText: parseHashMapToCSV(hashMap, columns.length),
    boardTitle: boardTitle.replace(/\s/g, ""),
  };
}

// function for running the txt export script
async function runTXT(page, boardTitle) {
  let parsedText = boardTitle + "\n\n";
  const columns = await getColumns(page);

  for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
    const columnTitle = await getColumnTitle(columns, columnIndex);
    const messages = await getMessages(columns, columnIndex);

    if (messages.length) {
      parsedText += columnTitle + "\n";
    }

    for (let rowIndex = 0; rowIndex < messages.length; rowIndex++) {
      const messageText = await getMessageText(messages, rowIndex);
      const votes = await getVotes(messages, rowIndex);

      // Acceptance criteria: only export cards that have at least 1 vote
      if (votes > 0) {
        parsedText += `- ${messageText} (${votes})` + "\n";
      }
    }

    if (messages.length) {
      parsedText += "\n";
    }
  }

  return {
    parsedText,
    boardTitle: boardTitle.replace(/\s/g, ""),
  };
}

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url);
  await page.waitForSelector(".easy-card-list");

  const boardTitle = await getBoardTitle(page);

  if (!boardTitle) {
    throw "Board title does not exist. Please check if provided URL is correct.";
  }

  // additionaly PDF: the text structure will be the same as .txt but with PDF format
  if (format === "txt" || format === "pdf") {
    // The runTXT also works for PDF because it is the same content
    return runTXT(page, boardTitle);
  }

  // the default format is .csv
  return runCSV(page, boardTitle);
}

run()
  .then(async (data) =>
    writeToFile(folderPath, data.parsedText, data.boardTitle, format)
  )
  .catch((error) => console.error(error));
