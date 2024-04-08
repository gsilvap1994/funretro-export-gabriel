const fs = require("fs");
const path = require("path");
const { exit } = require("process");

const { jsPDF } = require("jspdf");

async function getBoardTitle(page) {
  const boardTitle = await page.$eval(".board-name", (node) =>
    node.innerText.trim()
  );

  return boardTitle;
}

async function getColumns(page) {
  const columns = await page.$$(".easy-card-list");

  return columns;
}

async function getColumnTitle(columns, columnIndex) {
  const columnTitle = await columns[columnIndex].$eval(
    ".column-header",
    (node) => node.innerText.trim()
  );

  return columnTitle;
}

async function getMessages(columns, columnIndex) {
  const messages = await columns[columnIndex].$$(".easy-board-front");

  return messages;
}

async function getMessageText(messages, index) {
  const messageText = await messages[index].$eval(
    ".easy-card-main .easy-card-main-content .text",
    (node) => node.innerText.trim()
  );

  return messageText;
}

async function getVotes(messages, index) {
  const votes = await messages[index].$eval(
    ".easy-card-votes-container .easy-badge-votes",
    (node) => node.innerText.trim()
  );

  return votes;
}

function parseHashMapToCSV(hashMap, columnsLength) {
  let csvToExport = "";
  for (let i = 0; i <= columnsLength; i++) {
    if (i === 0) {
      csvToExport = hashMap[i];
    } else {
      if (hashMap[i]) {
        csvToExport += "\n" + hashMap[i];
      }
    }
  }

  return csvToExport;
}

// added 'format' for file format
async function writeToFile(folderPath, fileData, boardTitle, format) {
  // spread parsed text from board title because the boardTitle will be used as file name.
  const resolvedPath = path.resolve(
    `${folderPath}/${boardTitle}.${format}` ||
      `./exported/${boardTitle}.${format}`
  );

  // txt and csv can be created using fs.writefile
  if (format !== "pdf") {
    fs.writeFile(resolvedPath, fileData, (error) => {
      if (error) {
        throw error;
      } else {
        console.log(`Successfully written to file at: ${resolvedPath}`);
        exit();
      }
    });
  }

  // pdf needs a library (jspdf)
  if (format === "pdf") {
    const doc = new jsPDF();

    doc.setFontSize(10);
    doc.text(fileData, 10, 10, {
      maxWidth: 200,
    });
    try {
      doc.save(resolvedPath);
      console.log(`Successfully written to file at: ${resolvedPath}`);
      exit();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = {
  getBoardTitle,
  getColumns,
  getColumnTitle,
  getMessages,
  getMessageText,
  getVotes,
  parseHashMapToCSV,
  writeToFile,
};
