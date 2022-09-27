/**
 * The following code creates a 26x26 table to be used as a spreadsheet
 * Each cell is populated with two input texts, representing the expression
 * to be computed and the value computed (if any)
 */

const colsNumber = 26;
const spreadsheetTable = document.getElementById("spreadsheet");
const upperCaseLatters = [...Array(colsNumber).keys()].map(key => String.fromCharCode(key + 65));

// helper function to create elements by tag
const createElement = tagName => document.createElement(tagName);

// creates two input text elements to represent the expression to be computed
// and the computed value
// id is set only for 
const createChildreenElems = (valInputId) => {
  const [expInput, valInput] = ["input", "input"].map(createElement);
  expInput.type = valInput.type = "text";
  expInput.value = valInput.value = "";
  [expInput.hidden, valInput.hidden] = [true, false];
  valInput.setAttribute("id", valInputId);
  return [expInput, valInput];
}

// create header
// concat an empty element to match the spreadsheet layout
const headerRow = createElement("tr");
const headerCells = [""].concat(upperCaseLatters)
  .map(letter => {
    cell = document.createElement("th");
    cell.textContent = letter;
    return cell;
  });
// populate row with cells
headerRow.append(...headerCells);

// create body
const bodyRows = [...upperCaseLatters.keys()]
  .map(_ => createElement("tr"))
  .map((row, indexRow) => {
    const rowCells =
      [""].concat(upperCaseLatters).map((letter, index) => {
        let cell = createElement("td");
        if (index === 0) { // ex: 1, 2, 3,...
          cell.textContent = indexRow + 1;
        } else {
          const [expInput, valInput] =
            createChildreenElems(`${letter}${indexRow + 1}`);
          cell.append(expInput, valInput);
          buildEnterExitStreams(cell, expInput, valInput);
          buildBussinessLogicStream(expInput, valInput);
        }
        return cell;
      });

    // populate row with cells
    row.append(...rowCells);
    return row;
  });

spreadsheetTable.append(headerRow, ...bodyRows);