function styleScoringIndicatorHeader(currentCell, label, colorHex) {
  currentCell.setValue(label)
  currentCell.setWrap(true)
  currentCell.setBackground(colorHex)
  currentCell.setVerticalAlignment('top')
  currentCell.setHorizontalAlignment('center')
  return currentCell
}

// functions to convert column numbers to letters and vice versa
// for easier translation of column number to column letter in formulas
function columnToLetter(column) {
  var temp,
    letter = ''
  while (column > 0) {
    temp = (column - 1) % 26
    letter = String.fromCharCode(temp + 65) + letter
    column = (column - temp - 1) / 26
  }
  return letter
}

function letterToColumn(letter) {
  var column = 0,
    length = letter.length
  for (var i = 0; i < length; i++) {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1)
  }
  return column
}

function textUnderline(cell) {
  var style = SpreadsheetApp.newTextStyle().setUnderline(true).build()
  cell.setTextStyle(style)
  return cell
}

function subsetIndicatorsObject(IndicatorsObj, labelsArray) {
  // filter out categories in question
  let results = indicatorsObj.indicatorCategories.filter((category) => {
    return category.indicators.some((indicator) => labelsArray.includes(indicator.labelShort))
  })

  // make deep nested copy of greedy results Object
  // crazy: https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
  let newCopy = JSON.parse(JSON.stringify(results))

  let findings = {
    indicatorCategories: [],
  }

  // prepare final results Object with empty indicators[]
  results.map((category, index) => {
    newCopy[index].indicators = Array.from([])
    findings.indicatorCategories.push(newCopy[index])
  })

  // category-wise, push only target indicators
  results.map((category, index) => {
    let catIndex = index
    let found = category.indicators.filter((indicator) => {
      return labelsArray.includes(indicator.labelShort)
    })
    // found.forEach(indicator => findings[catIndex].indicators.push(indicator))
    // more elegant:
    findings.indicatorCategories[catIndex].indicators = found
  })

  // verbose feedback
  // console.log(" ------ FILTER SUCCESS ------")
  // console.log(" ------ Returned Indicators Subset:")
  // console.log(findings)

  // findings.indicatorCategories.forEach(category => {
  //     console.log(" ------ RESULTS: ------ ")
  //     console.log("Category: " + category.labelLong)
  //     console.log("Found Indicators: ")
  //     console.log(category.indicators)
  // })

  return findings
}
