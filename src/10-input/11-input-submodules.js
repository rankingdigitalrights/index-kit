// --- // Top-Level Headings // --- //

// Indicator Guidance for researchers
//"use strict"
function addIndicatorGuidance(
  sheet,
  thisIndicator,
  activeRow,
  activeCol,
  hasOpCom,
  numberOfColumns,
  bridgeCompColumnsNr,
  companyNumberOfServices,
  includeRGuidanceLink,
  collapseRGuidance
) {
  // TODO probably move all formatting params to JSON

  let row = activeRow
  let col = activeCol
  let cell

  let maxColHeadings = 2 + bridgeCompColumnsNr + 1
  if (companyNumberOfServices === 1 && !hasOpCom) {
    maxColHeadings -= 1
  }

  let indTitle = thisIndicator.labelShort + '. ' + thisIndicator.labelLong
  if (thisIndicator.description.length > 1) {
    indTitle = indTitle + ': ' + thisIndicator.description
  }

  // Indicator Heading
  cell = sheet
    .getRange(row, col)
    .setValue(indTitle)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('left')
    .setVerticalAlignment('middle')
    .setFontFamily('Oswald')
    .setWrap(true)

  sheet.setRowHeight(row, 40)
  sheet.getRange(row, col, 1, numberOfColumns).merge()
  sheet.getRange(row, col, 1, numberOfColumns).setBackground('lightgrey')
  sheet.setFrozenRows(1)

  row += 1

  let tempStartRow

  if (includeRGuidanceLink) {
    // General Instruction
    cell = sheet
      .getRange(row, col)
      .setValue('▶ Please read the indicator-specific guidance and discussions before starting the research!')
      .setFontWeight('bold')
      .setFontSize(9)
      .setHorizontalAlignment('left')
      .setVerticalAlignment('middle')
      .setFontFamily('Roboto Mono')
      .setWrap(true)
      .setFontColor('#ea4335')
    // .setFontColor("chocolate")

    sheet.setRowHeight(row, 40)
    sheet.getRange(row, col, 1, numberOfColumns).merge()
    sheet.getRange(row, col, 1, numberOfColumns).setBackground('WhiteSmoke')
    row += 1
    tempStartRow = row // for grouping
  } else {
    tempStartRow = row // for grouping
    row += 1
  }

  // Element Instructions
  cell = sheet
    .getRange(row, 1)
    .setValue('Elements:')
    .setFontWeight('bold')
    .setHorizontalAlignment('right')
    .setVerticalAlignment('top')
    .setFontFamily('Roboto Mono')

  col += 1

  thisIndicator.elements.forEach(function (element) {
    cell = sheet
      .getRange(row, col)
      .setValue(element.labelShort + ': ' + element.description)
      .setFontSize(10)
      .setFontFamily('Roboto')
      .setHorizontalAlignment('left')
    cell = sheet.getRange(row, col, 1, maxColHeadings).merge().setWrap(true)
    row += 1
  })

  if (includeRGuidanceLink) {
    row += 1
    let indicatorLink = 'https://rankingdigitalrights.org/2019-indicators/#' + thisIndicator.labelShort

    // TODO: Parameterize

    cell = sheet
      .getRange(row, 1)
      .setValue('Link to Research Guidance:')
      .setFontWeight('bold')
      .setHorizontalAlignment('right')
      .setFontFamily('Roboto Mono')

    cell = sheet.getRange(row, col, 1, maxColHeadings).merge().setWrap(true).setValue(indicatorLink)

    // let tempLastRow = row // for grouping
  } else {
    row -= 1
  }

  let rangeStep = sheet.getRange(tempStartRow, 1, row - tempStartRow + 1, numberOfColumns)
  rangeStep.shiftRowGroupDepth(1)

  if (collapseRGuidance) {
    rangeStep.collapseGroups()
  }

  row += 1

  sheet.getRange(tempStartRow, 1, row - tempStartRow + 1, numberOfColumns).setBackground('WhiteSmoke')

  sheet.getRange(row, activeCol, 1, numberOfColumns).setBorder(null, null, true, null, null, null, 'black', null)

  row += 1

  activeRow = row
  return activeRow
}

// Company + Services Header

function addMainStepHeader(
  sheet,
  currentClass,
  CompanyObj,
  activeRow,
  SS,
  companyNumberOfServices,
  thisMainStepNr,
  mainStepColor
) {
  let activeCol = 1

  let rowRange = (activeRow + ':' + activeRow).toString()
  sheet.getRange(rowRange).setHorizontalAlignment('center') // aligns header row

  // -----------------------SETTING UP THE HEADER ROW------------------------
  // first cell: Main Step Label
  sheet
    .getRange(activeRow, activeCol)
    .setValue('Step: ' + thisMainStepNr)
    .setBackground(mainStepColor)
    .setFontFamily('Roboto Mono')
    .setFontWeight('bold')
    .setFontSize(12)
    // .setHorizontalAlignment("left")
    .setVerticalAlignment('top')
  activeCol += 1

  // Company (group) column(s)
  for (let i = 0; i < 1; i++) {
    let cell = sheet
      .getRange(activeRow, activeCol)
      .setValue(CompanyObj.groupLabel)
      .setBackground('#fff2cc')
      .setFontWeight('bold')
      .setVerticalAlignment('top')

    activeCol += 1
  }

  // setting up OpComCompany regardless of whether it has one
  // will just hide the column if it doesn't exist

  for (let i = 0; i < 1; i++) {
    let cell = sheet
      .getRange(activeRow, activeCol)
      .setValue(CompanyObj.opComLabel)
      .setBackground('#fff2cc')
      .setFontWeight('bold')
      .setVerticalAlignment('top')

    // hiding refactored to main process; set N/A if no OpCom
    if (CompanyObj.hasOpCom == false) {
      cell.setValue('Operating Company (N/A)')
    }

    activeCol += 1
  }

  // for remaining columns (services)
  for (let i = 0; i < companyNumberOfServices; i++) {
    let cell = sheet
      .getRange(activeRow, activeCol)
      .setValue(CompanyObj.services[i].label.current)
      .setBackground('#b7e1cd')
      .setFontWeight('bold')
      .setVerticalAlignment('top')

    activeCol += 1
  }

  if (centralConfig.freezeHead) {
    sheet.setFrozenRows(activeRow) // freezes rows; define in config.json
  }

  return activeRow
}

// function just creates a single row in which in the first column a label is added
function addExtraInstruction(currentStep, stepCNr, activeRow, activeCol, sheet) {
  let cell = sheet
    .getRange(activeRow, activeCol)
    // cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3) // setting background color
    .setValue(currentStep.components[stepCNr].label)
    .setBackground(currentStep.subStepColor)
    .setFontWeight('bold')
  return activeRow + 1
}

// TODO - obsolete description - a step header is a row in which in the first column the name and description of the step is listed
// and in the remaining columns a placeholderText is added
function addSubStepHeader(
  sheet,
  currentIndicator,
  CompanyObj,
  activeRow,
  SS,
  currentStep,
  stepCNr,
  currentClass,
  companyNumberOfServices
) {
  activeRow = activeRow + 1

  // sets up labels in the first column
  let cell = sheet.getRange(activeRow, 1)
  let text = currentStep.label
  cell.setValue(text).setBackground(currentStep.subStepColor).setFontWeight('bold')
  // cell = textUnderline(cell)

  // TODO
  // activeRow = addMainStepHeader(sheet, currentClass, CompanyObj, activeRow, SS, companyNumberOfServices) // sets up header

  let thisFiller = currentStep.components[stepCNr].placeholderText
  let thisFirstCol = 2
  let thisLastCol = companyNumberOfServices + 2
  // for remaining company, opCom, and services columns it adds the placeholderText
  let thisRange = sheet.getRange(activeRow, thisFirstCol, 1, thisLastCol)
  thisRange.setValue(thisFiller)
  thisRange.setFontStyle('italic')

  let cellName
  let thisCell

  let activeCol = thisFirstCol

  let stepCompType = currentStep.components[stepCNr].id

  for (let serviceNr = 1; serviceNr < companyNumberOfServices + 3; serviceNr++) {
    // TODO: fix cell reference for OpCom

    if (serviceNr === 1) {
      // main company
      thisCell = sheet.getRange(activeRow, 1 + serviceNr)

      // cell name formula; output defined in 44_rangeNamingHelper.js
      cellName = defineNamedRangeStringImport(
        indexPrefix,
        'DC',
        currentStep.subStepID,
        currentIndicator.labelShort,
        CompanyObj.id,
        'group',
        stepCompType
      )

      SS.setNamedRange(cellName, thisCell)
      activeCol += 1
    } else if (serviceNr === 2) {
      // opCom
      thisCell = sheet.getRange(activeRow, 2)

      // cell name formula; output defined in 44_rangeNamingHelper.js
      cellName = defineNamedRangeStringImport(
        indexPrefix,
        'DC',
        currentStep.subStepID,
        currentIndicator.labelShort,
        CompanyObj.id,
        'opCom',
        stepCompType
      )

      SS.setNamedRange(cellName, thisCell)
      activeCol += 1
    } else {
      // services
      thisCell = sheet.getRange(activeRow, activeCol)

      // cell name formula; output defined in 44_rangeNamingHelper.js

      let g = serviceNr - 3 // helper for Services

      cellName = defineNamedRangeStringImport(
        indexPrefix,
        'DC',
        currentStep.subStepID,
        currentIndicator.labelShort,
        CompanyObj.id,
        CompanyObj.services[g].id,
        stepCompType
      )

      SS.setNamedRange(cellName, thisCell)
      activeCol += 1
    }
  }

  return activeRow + 1
}

// addEvaluationDropdown creates a dropdown list in each column for each subindicator
// used for [Results]
function addEvaluationDropdown(
  sheet,
  currentIndicator,
  CompanyObj,
  activeRow,
  SS,
  currentStep,
  stepCNr,
  currentClass,
  companyNumberOfServices
) {
  let rule = SpreadsheetApp.newDataValidation().requireValueInList(currentStep.components[stepCNr].dropdown).build()

  let stepCompType = currentStep.components[stepCNr].id

  // row labels
  for (let elemNr = 0; elemNr < currentIndicator.elements.length; elemNr++) {
    let activeCol = 1

    let thisElement = currentIndicator.elements[elemNr]

    let noteString = thisElement.labelShort + ': ' + thisElement.description

    // setting up the labels
    let cell = sheet
      .getRange(activeRow + elemNr, activeCol)
      .setValue(currentStep.components[stepCNr].label + thisElement.labelShort)
      .setBackground(currentStep.subStepColor)
      .setNote(noteString)
    activeCol += 1

    for (let serviceNr = 1; serviceNr < companyNumberOfServices + 3; serviceNr++) {
      // creates column(s) for overall company
      if (serviceNr === 1) {
        let thisCell = sheet.getRange(activeRow + elemNr, activeCol)

        // cell name formula; output defined in 44_rangeNamingHelper.js
        let cellName = defineNamedRangeStringImport(
          indexPrefix,
          'DC',
          currentStep.subStepID,
          thisElement.labelShort,
          CompanyObj.id,
          'group',
          stepCompType
        )

        SS.setNamedRange(cellName, thisCell) // names cells
        thisCell.setDataValidation(rule) // creates dropdown list
        thisCell
          .setValue('not selected') // sets default for drop down list
          .setFontWeight('bold') // bolds the answers
        activeCol += 1
      }

      // setting up opCom column(s)
      else if (serviceNr === 2) {
        let thisCell = sheet.getRange(activeRow + elemNr, activeCol)

        // cell name formula; output defined in 44_rangeNamingHelper.js
        let cellName = defineNamedRangeStringImport(
          indexPrefix,
          'DC',
          currentStep.subStepID,
          thisElement.labelShort,
          CompanyObj.id,
          'opCom',
          stepCompType
        )

        SS.setNamedRange(cellName, thisCell) // names cells
        thisCell
          .setDataValidation(rule) // creates dropdown list
          .setFontWeight('bold') // bolds the answers
        if (CompanyObj.hasOpCom === false) {
          thisCell.setValue('N/A') // if no OpCom, pre-select N/A
        } else {
          thisCell.setValue('not selected') // sets default for drop down list
        }

        activeCol += 1
      }

      // creating all the service columns
      else {
        let thisCell = sheet.getRange(activeRow + elemNr, activeCol)

        // cell name formula; output defined in 44_rangeNamingHelper.js

        let g = serviceNr - 3 // helper for Services

        let cellName = defineNamedRangeStringImport(
          indexPrefix,
          'DC',
          currentStep.subStepID,
          thisElement.labelShort,
          CompanyObj.id,
          CompanyObj.services[g].id,
          stepCompType
        )

        SS.setNamedRange(cellName, thisCell) // names cells
        thisCell
          .setDataValidation(rule) // creates dropdown list
          .setValue('not selected') // sets default for drop down list
          .setFontWeight('bold') // bolds the answers
        activeCol += 1
      }
    }
  }

  activeRow = activeRow + currentIndicator.elements.length
  return activeRow
}

// this function creates a cell for comments for each subindicator and names the ranges

function addComments(
  sheet,
  currentIndicator,
  CompanyObj,
  activeRow,
  SS,
  currentStep,
  stepCNr,
  currentClass,
  companyNumberOfServices
) {
  let stepCompType = currentStep.components[stepCNr].id

  // for (let i = 0; i < currentIndicator.elements.length; i++) {
  //     sheet.setRowHeight(activeRow + i, 50)
  // } // increases height of row

  // loops through subindicators
  for (let elemNr = 0; elemNr < currentIndicator.elements.length; elemNr++) {
    let activeCol = 1

    // adding the labels
    let cell = sheet.getRange(activeRow + elemNr, activeCol)
    cell.setValue(
      currentStep.components[stepCNr].label +
        currentIndicator.elements[elemNr].labelShort +
        currentStep.components[stepCNr].label2
    )
    cell.setBackground(currentStep.subStepColor) // colors cell
    activeCol += 1

    for (let serviceNr = 1; serviceNr < companyNumberOfServices + 3; serviceNr++) {
      // setting up the columns for the overall company
      if (serviceNr === 1) {
        let thisCell = sheet.getRange(activeRow + elemNr, activeCol)

        // cell name formula; output defined in 44_rangeNamingHelper.js
        let cellName = defineNamedRangeStringImport(
          indexPrefix,
          'DC',
          currentStep.subStepID,
          currentIndicator.elements[elemNr].labelShort,
          CompanyObj.id,
          'group',
          stepCompType
        )

        SS.setNamedRange(cellName, thisCell)
        activeCol += 1
      }

      // setting up opCom column(s)
      else if (serviceNr === 2) {
        let thisCell = sheet.getRange(activeRow + elemNr, activeCol)

        // cell name formula; output defined in 44_rangeNamingHelper.js
        let cellName = defineNamedRangeStringImport(
          indexPrefix,
          'DC',
          currentStep.subStepID,
          currentIndicator.elements[elemNr].labelShort,
          CompanyObj.id,
          'opCom',
          stepCompType
        )

        SS.setNamedRange(cellName, thisCell)
        activeCol += 1
      }

      // setting up columns for all the services
      else {
        thisCell = sheet.getRange(activeRow + elemNr, activeCol)

        // cell name formula; output defined in 44_rangeNamingHelper.js

        let g = serviceNr - 3 // helper for Services

        let cellName = defineNamedRangeStringImport(
          indexPrefix,
          'DC',
          currentStep.subStepID,
          currentIndicator.elements[elemNr].labelShort,
          CompanyObj.id,
          CompanyObj.services[g].id,
          stepCompType
        )

        SS.setNamedRange(cellName, thisCell)
        activeCol += 1
      }
    }
  }

  activeRow = activeRow + currentIndicator.elements.length
  return activeRow
}

// this function adds an element drop down list to a single row

function addBinaryEvaluation(
  sheet,
  currentIndicator,
  CompanyObj,
  activeRow,
  SS,
  currentStep,
  stepCNr,
  currentClass,
  companyNumberOfServices
) {
  let rule = SpreadsheetApp.newDataValidation().requireValueInList(currentStep.components[stepCNr].dropdown).build()
  let thisStepComponent = currentStep.components[stepCNr]
  let stepCompType = currentStep.components[stepCNr].id
  let activeCol = 1

  // sets up the labels
  let cell = sheet
    .getRange(activeRow, activeCol)
    .setValue(thisStepComponent.label)
    .setBackground(currentStep.subStepColor)
  if (thisStepComponent.type === 'binaryReview') {
    cell.setFontWeight('bold').setFontStyle('italic').setHorizontalAlignment('center')
  }
  activeCol += 1

  for (let serviceNr = 1; serviceNr < companyNumberOfServices + 3; serviceNr++) {
    // names the cells into which answers will be put
    if (serviceNr === 1) {
      // overall company
      let thisCell = sheet.getRange(activeRow, activeCol)

      // cell name formula; output defined in 44_rangeNamingHelper.js
      let cellName = defineNamedRangeStringImport(
        indexPrefix,
        'DC',
        currentStep.subStepID,
        currentIndicator.labelShort,
        CompanyObj.id,
        'group',
        stepCompType
      )

      SS.setNamedRange(cellName, thisCell) // names cells
      thisCell
        .setDataValidation(rule) // creates dropdown list
        .setValue('not selected') // sets default for drop down list
        .setFontWeight('bold') // bolds the answers
      activeCol += 1
    }

    // setting up the opCom row
    else if (serviceNr === 2) {
      let thisCell = sheet.getRange(activeRow, activeCol)

      // cell name formula; output defined in 44_rangeNamingHelper.js
      let cellName = defineNamedRangeStringImport(
        indexPrefix,
        'DC',
        currentStep.subStepID,
        currentIndicator.labelShort,
        CompanyObj.id,
        'opCom',
        stepCompType
      )

      SS.setNamedRange(cellName, thisCell) // names cells
      thisCell
        .setDataValidation(rule) // creates dropdown list
        .setValue('not selected') // sets default for drop down list
        .setFontWeight('bold') // bolds the answers
      activeCol += 1
    }

    // taking care of all the service columns
    else {
      let thisCell = sheet.getRange(activeRow, activeCol)

      // cell name formula; output defined in 44_rangeNamingHelper.js

      let g = serviceNr - 3

      let cellName = defineNamedRangeStringImport(
        indexPrefix,
        'DC',
        currentStep.subStepID,
        currentIndicator.labelShort,
        CompanyObj.id,
        CompanyObj.services[g].id,
        stepCompType
      )

      SS.setNamedRange(cellName, thisCell) // names cells
      thisCell
        .setDataValidation(rule) // creates dropdown list
        .setValue('not selected') // sets default for drop down list
        .setFontWeight('bold') // bolds the answers
      activeCol += 1
    }
  }

  return activeRow + 1
}

// ## TODO Component Level functions ## //

function addComparisonYonY(
  sheet,
  currentIndicator,
  CompanyObj,
  activeRow,
  currentStep,
  stepCNr,
  currentClass,
  companyNumberOfServices
) {
  // sets up column with discription
  for (let elemNr = 0; elemNr < currentIndicator.elements.length; elemNr++) {
    let activeCol = 1
    // serviceNr = column / service
    // ~ serviceNr = 0 -> Labels
    // ~ serviceNr = 1 Group
    // ~ serviceNr = 2 OpCom

    // sets up labels in the first column of the row
    let cell = sheet
      .getRange(activeRow + elemNr, activeCol)
      .setValue(currentStep.components[stepCNr].label + currentIndicator.elements[elemNr].labelShort)
      .setBackground(currentStep.subStepColor)
    activeCol += 1

    for (let serviceNr = 1; serviceNr < companyNumberOfServices + 3; serviceNr++) {
      // address hard 3 with company JSON

      // setting up company column(s)
      if (serviceNr === 1) {
        let thisCell = sheet.getRange(activeRow + elemNr, activeCol)

        let compCellName = defineNamedRangeStringImport(
          indexPrefix,
          'DC',
          currentStep.components[stepCNr].comparisonLabelShort,
          currentIndicator.elements[elemNr].labelShort,
          CompanyObj.id,
          'group'
        )

        // sets up formula that compares values
        let value = currentIndicator.y2yCompColumn + (serviceNr - 1) // calculates which column
        let col = columnToLetter(value)
        // TODO
        let formula =
          '=IF(' +
          compCellName +
          '=' +
          "'" +
          importedOutcomeTabName +
          "'" +
          '!' +
          '$' +
          col +
          '$' +
          (currentIndicator.y2yCompRow + elemNr) +
          ',"Yes","No")'

        thisCell.setFormula(formula.toString())

        activeCol += 1
      } // close serviceNr===1 if statement

      // setting up opCom column(s)
      else if (serviceNr === 2) {
        // loops through the number of components
        // sets cell
        let thisCell = sheet.getRange(activeRow + elemNr, activeCol)

        // creating the name of cell it will be compared to
        let compCellName = defineNamedRangeStringImport(
          indexPrefix,
          'DC',
          currentStep.components[stepCNr].comparisonLabelShort,
          currentIndicator.elements[elemNr].labelShort,
          CompanyObj.id,
          'opCom'
        )

        // creating formula that compares the two cells
        let value = currentIndicator.y2yCompColumn + (serviceNr - 1)
        // finds comparisson column
        let col = columnToLetter(value)
        // TODO
        let formula =
          '=IF(' +
          compCellName +
          '=' +
          "'" +
          importedOutcomeTabName +
          "'" +
          '!' +
          '$' +
          col +
          '$' +
          (currentIndicator.y2yCompRow + elemNr) +
          ',"Yes","No")'

        thisCell.setFormula(formula.toString())

        activeCol += 1
      } // close serviceNr===2 if statement

      // setting up services column(s9
      else {
        // setting cell
        let thisCell = sheet.getRange(activeRow + elemNr, activeCol)

        // finding the name of cell that it will be compared too
        let g = serviceNr - 3

        let compCellName = defineNamedRangeStringImport(
          indexPrefix,
          'DC',
          currentStep.components[stepCNr].comparisonLabelShort,
          currentIndicator.elements[elemNr].labelShort,
          CompanyObj.id,
          CompanyObj.services[g].id
        )

        // creating formula that will be placed in cell
        let value = currentIndicator.y2yCompColumn + (serviceNr - 1) + k // calculates which column
        let col = columnToLetter(value)
        // TODO
        let formula =
          '=IF(' +
          compCellName +
          '=' +
          "'" +
          importedOutcomeTabName +
          "'" +
          '!' +
          '$' +
          col +
          '$' +
          (currentIndicator.y2yCompRow + elemNr) +
          ',"Yes","No")'

        thisCell.setFormula(formula.toString())

        activeCol += 1
      }
    }
  }

  // adding the conditional formating so that the cell turns red if the answer is no
  let colMax = columnToLetter(2 + (companyNumberOfServices + 2))
  let rowMax = activeRow + currentIndicator.elements.length

  let range = sheet.getRange(activeRow, 2, currentIndicator.elements.length, 2 + (companyNumberOfServices + 2))

  let rule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('No')
    .setBackground('#fa7661')
    .setRanges([range])
    .build()
  let rules = sheet.getConditionalFormatRules()
  rules.push(rule)
  sheet.setConditionalFormatRules(rules)

  activeRow = activeRow + currentIndicator.elements.length
  return activeRow
}

// the sources step adds a single row in which the sources of each column can be listed

function addSources(
  sheet,
  currentIndicator,
  CompanyObj,
  activeRow,
  SS,
  currentStep,
  stepCNr,
  currentClass,
  companyNumberOfServices
) {
  let activeCol = 1

  let stepCompType = currentStep.components[stepCNr].id

  // adding label
  let cell = sheet
    .getRange(activeRow, activeCol)
    .setValue(currentStep.components[stepCNr].label)
    .setBackground(currentStep.subStepColor)
  activeCol += 1

  for (let serviceNr = 1; serviceNr < companyNumberOfServices + 3; serviceNr++) {
    // TODO: fix cell reference for OpCom

    if (serviceNr === 1) {
      // main company

      let thisCell = sheet.getRange(activeRow, 1 + serviceNr)

      // cell name formula; output defined in 44_rangeNamingHelper.js
      let cellName = defineNamedRangeStringImport(
        indexPrefix,
        'DC',
        currentStep.subStepID,
        currentIndicator.labelShort,
        CompanyObj.id,
        'group',
        stepCompType
      )

      SS.setNamedRange(cellName, thisCell)
      activeCol += 1
    } else if (serviceNr === 2) {
      // opCom
      let thisCell = sheet.getRange(activeRow, 2)

      // cell name formula; output defined in 44_rangeNamingHelper.js
      let cellName = defineNamedRangeStringImport(
        indexPrefix,
        'DC',
        currentStep.subStepID,
        currentIndicator.labelShort,
        CompanyObj.id,
        'opCom',
        stepCompType
      )

      SS.setNamedRange(cellName, thisCell)
      activeCol += 1
    } else {
      // services
      let thisCell = sheet.getRange(activeRow, activeCol)

      // cell name formula; output defined in 44_rangeNamingHelper.js

      let g = serviceNr - 3 // helper for Services
      let cellName = defineNamedRangeStringImport(
        indexPrefix,
        'DC',
        currentStep.subStepID,
        currentIndicator.labelShort,
        CompanyObj.id,
        CompanyObj.services[g].id,
        stepCompType
      )

      SS.setNamedRange(cellName, thisCell)
      activeCol += 1
    }
  }

  return activeRow + 1
}
