// ---------------------HELPER FUNCTIONS---------------------------------------------

/* global
    indexPrefix
    defineNamedRangeStringImport, styleScoringIndicatorHeader, importRangeFormula
*/

// eslint-disable-next-line no-unused-vars
function setScoringSheetHeader(activeRow, activeCol, sheet, companyShortName, thisSubStepLabel, blocks) {
  // -- // add Step Header to top-left cell // -- //
  // TODO: refactor to components

  if (blocks == 1) {
    sheet
      .getRange(activeRow, activeCol)
      .setValue(companyShortName)
      .setFontWeight('bold')
      .setBackground('#b7e1cd')
      .setFontSize(14)
    sheet.setColumnWidth(activeCol, 200)
    activeCol += 1
  }

  sheet.getRange(activeRow, activeCol).setValue(thisSubStepLabel).setFontWeight('bold').setFontSize(14)

  sheet.setFrozenRows(1)

  return activeRow + 1
}

// --- BEGIN setScoringCompanyHeader() --- //
function setScoringCompanyHeader(activeRow, activeCol, sheet, Indicator, indicatorCat, companyObj, blocks) {
  Logger.log(' - ' + 'in company header ' + Indicator.labelShort)

  let currentCell = sheet.getRange(activeRow, activeCol)
  let columnLabel

  // skip first Column for subsequent steps
  if (blocks === 1) {
    currentCell
      .setValue(Indicator.labelShort)
      .setBackground(indicatorCat.classColor)
      .setFontWeight('bold')
      .setVerticalAlignment('middle')
      .setHorizontalAlignment('center')
    activeCol += 1
  }

  // --- // Company Elements // --- //

  // group
  let thisColor = '#d9d9d9' // grey TODO: outsource to Config

  for (let g = 0; g < nrOfIndSubComps; g++) {
    currentCell = sheet.getRange(activeRow, activeCol)
    columnLabel = 'Group\n' + companyObj.label.current

    if (nrOfIndSubComps > 1) {
      columnLabel = columnLabel + '\n' + indicatorCat.components[g].labelLong
    }

    currentCell = styleScoringIndicatorHeader(currentCell, columnLabel, thisColor)

    activeCol += 1
  }

  // opcom
  for (let g = 0; g < nrOfIndSubComps; g++) {
    currentCell = sheet.getRange(activeRow, activeCol)
    columnLabel = 'OperatingCo\n'

    if (companyObj.hasOpCom == true) {
      columnLabel = columnLabel + companyObj.opComLabel
    } else {
      columnLabel = columnLabel + ' N/A '
    }

    if (nrOfIndSubComps > 1) {
      columnLabel = columnLabel + '\n' + indicatorCat.components[g].labelLong
    }

    currentCell = styleScoringIndicatorHeader(currentCell, columnLabel, thisColor)

    activeCol += 1
  }

  // --- // --- Services --- // --- //
  for (let s = 0; s < companyObj.numberOfServices; s++) {
    for (let g = 0; g < nrOfIndSubComps; g++) {
      currentCell = sheet.getRange(activeRow, activeCol)
      columnLabel = companyObj.services[s].label.current

      if (nrOfIndSubComps > 1) {
        columnLabel = columnLabel + '\n' + indicatorCat.components[g].labelLong
      }

      currentCell = styleScoringIndicatorHeader(currentCell, columnLabel, thisColor)

      activeCol += 1
    }
  }
  return activeRow + 1
}

// generic : imports both,element level evaluation results and comments
// eslint-disable-next-line no-unused-vars
function importElementBlock(
  activeRow,
  activeCol,
  sheet,
  StepComp,
  thisSubStepID,
  Indicator,
  CompanyObj,
  companyHasOpCom,
  indicatorCat,
  blocks,
  integrateOutputs
) {
  let stepCompID = StepComp.id
  let firstRow = activeRow
  let firstCol = activeCol + 1

  let compCellName, tempCol, formula, currentCell, rowLabel
  let urlDC = CompanyObj.urlCurrentDataCollectionSheet
  let component = '' // TODO: remove

  Logger.log('Element Data Type: ' + stepCompID)

  Logger.log(' - ' + 'in ' + StepComp.type + ' ' + Indicator.labelShort)

  // for each element
  for (let elemNr = 0; elemNr < Indicator.elements.length; elemNr++) {
    tempCol = activeCol
    currentCell = sheet.getRange(activeRow, tempCol)

    // row label / first Column
    // skip first Column for subsequent steps
    if (blocks === 1) {
      rowLabel = StepComp.label + Indicator.elements[elemNr].labelShort
      currentCell.setValue(rowLabel.toString())
      currentCell.setWrap(true)
      tempCol += 1
    }

    // result cells
    // for Group + Indicator Subcomponents
    currentCell = sheet.getRange(activeRow, tempCol)

    // setting up formula that compares values
    compCellName = defineNamedRangeStringImport(
      indexPrefix,
      'DC',
      thisSubStepID,
      Indicator.elements[elemNr].labelShort,
      component,
      CompanyObj.id,
      'group',
      stepCompID
    )

    // adding formula
    formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
    currentCell.setFormula(formula)
    tempCol += 1

    // for opCom + Indicator Subcomponents

    if (companyHasOpCom) {
      // setting up formula that compares values
      compCellName = defineNamedRangeStringImport(
        indexPrefix,
        'DC',
        thisSubStepID,
        Indicator.elements[elemNr].labelShort,
        component,
        CompanyObj.id,
        'opCom',
        stepCompID
      )
    } else {
      currentCell.setValue('N/A').setHorizontalAlignment('center')
    }

    formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
    currentCell.setFormula(formula)
    tempCol += 1

    // for n Services + Indicator Subcomponents
    for (let s = 0; s < CompanyObj.services.length; s++) {
      currentCell = sheet.getRange(activeRow, tempCol)

      // setting up formula that compares values
      compCellName = defineNamedRangeStringImport(
        indexPrefix,
        'DC',
        thisSubStepID,
        Indicator.elements[elemNr].labelShort,
        component,
        CompanyObj.id,
        CompanyObj.services[s].id,
        stepCompID
      )

      formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
      currentCell.setFormula(formula)

      tempCol += 1
    }

    activeRow += 1
  }

  sheet
    .getRange(firstRow, firstCol, activeRow - firstRow, tempCol - firstCol)
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP)

  return activeRow
}

// --- // Begin Sources // --- //

function importElementRow(
  activeRow,
  activeCol,
  sheet,
  StepComp,
  thisSubStepID,
  Indicator,
  CompanyObj,
  companyHasOpCom,
  nrOfIndSubComps,
  indicatorCat,
  blocks,
  integrateOutputs,
  isPilotMode
) {
  let stepCompID = StepComp.id

  let currentSubStepID = thisSubStepID
  // TODO - PILOT: adjusting substep number for Researcher Name import
  if (isPilotMode) {
    currentSubStepID = StepComp.importNameFrom
  }

  Logger.log(' - ' + 'in ' + stepCompID + ' ' + Indicator.labelShort)

  if (stepCompID == 'elementResults') {
    stepCompID = false
  }

  let urlDC = CompanyObj.urlCurrentDataCollectionSheet

  let tempCol = activeCol
  let currentCell = sheet.getRange(activeRow, activeCol)

  // row label / first Column
  // skip first Column for subsequent steps
  if (blocks === 1) {
    let rowLabel = StepComp.label
    currentCell.setValue(rowLabel)
    currentCell.setWrap(true)
    tempCol += 1
  }

  let component = ''

  // result cells
  // for Group + Indicator Subcomponents
  for (let k = 0; k < nrOfIndSubComps; k++) {
    currentCell = sheet.getRange(activeRow, tempCol)

    if (nrOfIndSubComps != 1) {
      component = indicatorCat.components[k].labelShort
    }

    // setting up formula that compares values
    let compCellName = defineNamedRangeStringImport(
      indexPrefix,
      'DC',
      currentSubStepID,
      Indicator.labelShort,
      component,
      CompanyObj.id,
      'group',
      stepCompID
    )

    // adding formula
    let formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
    currentCell.setFormula(formula)
    tempCol += 1
  }

  // for opCom + Indicator Subcomponents
  for (let k = 0; k < nrOfIndSubComps; k++) {
    currentCell = sheet.getRange(activeRow, tempCol)

    if (nrOfIndSubComps != 1) {
      component = indicatorCat.components[k].labelShort
    }

    if (companyHasOpCom) {
      // setting up formula that compares values
      let compCellName = defineNamedRangeStringImport(
        indexPrefix,
        'DC',
        currentSubStepID,
        Indicator.labelShort,
        component,
        CompanyObj.id,
        'opCom',
        stepCompID
      )

      let formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
      currentCell.setFormula(formula)
    } else {
      currentCell.setValue(' ⨯ ').setHorizontalAlignment('center')
    }
    tempCol += 1
  }

  // for n Services + Indicator Subcomponents
  for (let g = 0; g < CompanyObj.services.length; g++) {
    for (k = 0; k < nrOfIndSubComps; k++) {
      currentCell = sheet.getRange(activeRow, tempCol)

      if (nrOfIndSubComps != 1) {
        component = indicatorCat.components[k].labelShort
      }

      // setting up formula that compares values
      let compCellName = defineNamedRangeStringImport(
        indexPrefix,
        'DC',
        currentSubStepID,
        Indicator.labelShort,
        component,
        CompanyObj.id,
        CompanyObj.services[g].id,
        stepCompID
      )

      let formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
      currentCell.setFormula(formula)

      tempCol += 1
    }
  }

  activeRow += 1

  return activeRow
}

// --- // end Sources // --- //

// --- // Core function: SCORING // --- //

function addElementScores(
  SS,
  sheetModeID,
  activeRow,
  activeCol,
  sheet,
  currentStepLabelShort,
  currentStepComponent,
  Indicator,
  CompanyObj,
  companyHasOpCom,
  nrOfIndSubComps,
  indicatorCat,
  blocks,
  hasFullScores
) {
  Logger.log(' - ' + 'in element scoring for ' + ' ' + Indicator.labelShort)

  // for cell reference between score and imported result

  let verticalDim
  if (hasFullScores) {
    verticalDim = 2
  } else {
    verticalDim = 1
  }

  let scoringSuffix = 'SE'
  // for each indicator.Element

  for (let elemNr = 0; elemNr < Indicator.elements.length; elemNr++) {
    let tempCol = activeCol
    let currentCell = sheet.getRange(activeRow, tempCol)

    // row label / first Column
    // skip first Column for subsequent steps
    if (blocks === 1) {
      let rowLabel = 'Points for ' + Indicator.elements[elemNr].labelShort
      currentCell.setValue(rowLabel.toString())
      currentCell.setWrap(true)
      tempCol += 1
    }

    let up = Indicator.elements.length * verticalDim + verticalDim

    // for each Indicator Sub Component (G: FC, PC)
    for (let k = 0; k < nrOfIndSubComps; k++) {
      // add score
      currentCell = sheet.getRange(activeRow, tempCol)
      // Formula by calculating offset --> Refactor to generic method(currentCell,)
      // Logger.log("let up: " + up)
      let range = sheet.getRange(activeRow - up, tempCol)
      // currentCell.setValue(range.getA1Notation())
      let elementScore = elementScoreFormula(range)
      currentCell.setFormula(elementScore)
      currentCell.setNumberFormat('0.##')

      // cell name formula; output defined in 44_rangeNamingHelper.js
      let component = ''
      if (nrOfIndSubComps != 1) {
        component = indicatorCat.components[k].labelShort
      }
      let cellName = defineNamedRangeStringImport(
        indexPrefix,
        sheetModeID,
        currentStepLabelShort,
        Indicator.elements[elemNr].labelShort,
        component,
        CompanyObj.id,
        'group',
        scoringSuffix
      )
      SS.setNamedRange(cellName, currentCell)
      tempCol += 1
    }

    // atomic opCom scores
    for (let k = 0; k < nrOfIndSubComps; k++) {
      currentCell = sheet.getRange(activeRow, tempCol)

      if (companyHasOpCom) {
        // Formula by calculating offset --> Refactor

        range = sheet.getRange(activeRow - up, tempCol)
        // currentCell.setValue(range.getA1Notation())
        elementScore = elementScoreFormula(range)
        currentCell.setFormula(elementScore)
        currentCell.setNumberFormat('0.##')
        // cell name formula; output defined in 44_rangeNamingHelper.js
        component = ''
        if (nrOfIndSubComps != 1) {
          component = indicatorCat.components[k].labelShort
        }
        cellName = defineNamedRangeStringImport(
          indexPrefix,
          sheetModeID,
          currentStepLabelShort,
          Indicator.elements[elemNr].labelShort,
          component,
          CompanyObj.id,
          'opCom',
          scoringSuffix
        )
        SS.setNamedRange(cellName, currentCell)
      } else {
        currentCell.setValue(' ⨯ ').setHorizontalAlignment('center')
      }

      tempCol += 1
    }

    // looping through the service scores

    for (let g = 0; g < CompanyObj.services.length; g++) {
      for (let k = 0; k < nrOfIndSubComps; k++) {
        currentCell = sheet.getRange(activeRow, tempCol)
        // Formula by calculating offset --> Refactor

        range = sheet.getRange(activeRow - up, tempCol)
        // currentCell.setValue(range.getA1Notation())
        // let elementScore = '=LEN(' + range.getA1Notation() + ')'
        elementScore = elementScoreFormula(range)
        currentCell.setFormula(elementScore)
        currentCell.setNumberFormat('0.##')
        // cell name formula; output defined in 44_rangeNamingHelper.js
        component = ''
        if (nrOfIndSubComps != 1) {
          component = indicatorCat.components[k].labelShort
        }
        cellName = defineNamedRangeStringImport(
          indexPrefix,
          sheetModeID,
          currentStepLabelShort,
          Indicator.elements[elemNr].labelShort,
          component,
          CompanyObj.id,
          CompanyObj.services[g].id,
          scoringSuffix
        )
        SS.setNamedRange(cellName, currentCell)
        tempCol += 1
      }
    }

    activeRow += 1
  }

  return activeRow + 1
}

// --- // Level Scoring // --- //

function addLevelScores(
  SS,
  sheetModeID,
  activeRow,
  activeCol,
  sheet,
  currentStepLabelShort,
  currentStepComponent,
  Indicator,
  CompanyObj,
  companyHasOpCom,
  nrOfIndSubComps,
  indicatorCat,
  indyLevelScoresCompany,
  indyLevelScoresServices,
  blocks
) {
  Logger.log(' - ' + 'in level scoring for ' + ' ' + Indicator.labelShort)
  // --- adding the level averages --- //

  let scoringSuffix = 'SL'

  let currentCell = sheet.getRange(activeRow, activeCol)

  let tempCol = activeCol

  // row label / first Column
  // skip first Column for subsequent steps
  if (blocks === 1) {
    currentCell.setValue('Level Scores')
    currentCell.setFontWeight('bold')
    tempCol += 1
  }

  // --- Level Average Scores --- //

  // Company Components //

  // Group AVERAGE

  for (let k = 0; k < nrOfIndSubComps; k++) {
    currentCell = sheet.getRange(activeRow, tempCol)
    let serviceCells = []

    for (let elemNr = 0; elemNr < Indicator.elements.length; elemNr++) {
      // finding the cell names that are used in calculating a company specific average

      let component = ''
      if (nrOfIndSubComps != 1) {
        component = indicatorCat.components[k].labelShort
      }
      let cellName = defineNamedRangeStringImport(
        indexPrefix,
        sheetModeID,
        currentStepLabelShort,
        Indicator.elements[elemNr].labelShort,
        component,
        CompanyObj.id,
        'group',
        'SE'
      )
      serviceCells.push(cellName)
    }

    let levelFormula = levelScoreFormula(serviceCells)
    currentCell.setFormula(levelFormula)
    currentCell.setNumberFormat('0.##')
    // naming the group level cell score
    let component = ''
    if (nrOfIndSubComps != 1) {
      component = indicatorCat.components[k].labelShort
    }
    let cellName = defineNamedRangeStringImport(
      indexPrefix,
      sheetModeID,
      currentStepLabelShort,
      Indicator.labelShort,
      component,
      CompanyObj.id,
      'group',
      scoringSuffix
    )
    SS.setNamedRange(cellName, currentCell)
    indyLevelScoresCompany.push(cellName) // adding name to the formula
    tempCol += 1
  }

  // OpCom AVERAGE

  for (k = 0; k < nrOfIndSubComps; k++) {
    let currentCell = sheet.getRange(activeRow, tempCol)

    if (companyHasOpCom) {
      let serviceCells = []

      for (let elemNr = 0; elemNr < Indicator.elements.length; elemNr++) {
        // finding the cell names that are used in calculating a company specific average
        let component = ''
        if (nrOfIndSubComps != 1) {
          component = indicatorCat.components[k].labelShort
        }
        let cellName = defineNamedRangeStringImport(
          indexPrefix,
          sheetModeID,
          currentStepLabelShort,
          Indicator.elements[elemNr].labelShort,
          component,
          CompanyObj.id,
          'opCom',
          'SE'
        )
        if (companyHasOpCom == true) {
          serviceCells.push(cellName)
        }
      }

      let levelFormula = levelScoreFormula(serviceCells)
      currentCell.setFormula(levelFormula)
      currentCell.setNumberFormat('0.##')
      // naming the opCom level cell score
      let component = ''
      if (nrOfIndSubComps != 1) {
        component = indicatorCat.components[k].labelShort
      }

      let cellName = defineNamedRangeStringImport(
        indexPrefix,
        sheetModeID,
        currentStepLabelShort,
        Indicator.labelShort,
        component,
        CompanyObj.id,
        'opCom',
        scoringSuffix
      )
      SS.setNamedRange(cellName, currentCell)
      indyLevelScoresCompany.push(cellName)
    } else {
      currentCell.setValue(' N/A ').setHorizontalAlignment('center')
    }
    tempCol += 1
  }

  // --- SERVICES --- //
  // iterate over services
  for (let g = 0; g < CompanyObj.services.length; g++) {
    for (k = 0; k < nrOfIndSubComps; k++) {
      currentCell = sheet.getRange(activeRow, tempCol)
      let serviceCells = []
      for (let elemNr = 0; elemNr < Indicator.elements.length; elemNr++) {
        // finding the cell names that are used in calculating a company specific average
        let component = ''
        if (nrOfIndSubComps != 1) {
          component = indicatorCat.components[k].labelShort
        }
        let cellName = defineNamedRangeStringImport(
          indexPrefix,
          sheetModeID,
          currentStepLabelShort,
          Indicator.elements[elemNr].labelShort,
          component,
          CompanyObj.id,
          CompanyObj.services[g].id,
          'SE'
        )
        serviceCells.push(cellName)
      }

      let levelFormula = levelScoreFormula(serviceCells)
      currentCell.setFormula(levelFormula)
      currentCell.setNumberFormat('0.##')

      // naming the service level cell score
      let component = ''
      if (nrOfIndSubComps != 1) {
        component = indicatorCat.components[k].labelShort
      }

      let cellName = defineNamedRangeStringImport(
        indexPrefix,
        sheetModeID,
        currentStepLabelShort,
        Indicator.labelShort,
        component,
        CompanyObj.id,
        CompanyObj.services[g].id,
        scoringSuffix
      )

      SS.setNamedRange(cellName, currentCell)

      indyLevelScoresServices.push(cellName)

      tempCol += 1
    }
  }
  return activeRow + 1
}

function addCompositeScores(
  SS,
  sheetModeID,
  activeRow,
  activeCol,
  sheet,
  currentStepLabelShort,
  Indicator,
  CompanyObj,
  nrOfIndSubComps,
  indyLevelScoresCompany,
  indyLevelScoresServices,
  indyCompositeScores,
  blocks
) {
  Logger.log(' - ' + 'in composite scoring for ' + Indicator.labelShort)

  let scoringSuffix = 'SC'

  activeRow += 1

  let currentCell = sheet.getRange(activeRow, activeCol)

  let tempCol = activeCol

  // row label / first Column
  // skip first Column for subsequent steps
  if (blocks === 1) {
    currentCell.setValue('Composite Scores')
    currentCell.setFontWeight('bold')
    tempCol += 1
  }

  // --- Composite Company --- //

  let scoringComponent = 'A'
  currentCell = sheet.getRange(activeRow, tempCol)
  currentCell.setFormula(aggregateScoreFormula(indyLevelScoresCompany))

  let cellName = defineNamedRangeStringImport(
    indexPrefix,
    sheetModeID,
    currentStepLabelShort,
    Indicator.labelShort,
    scoringComponent,
    CompanyObj.id,
    '',
    scoringSuffix
  )
  SS.setNamedRange(cellName, currentCell)

  // apply scoring Logic
  currentCell = checkScoringLogic(Indicator, scoringComponent, currentCell, cellName, indyCompositeScores)

  Logger.log(' - ' + 'composite company score added for ' + Indicator.labelShort)

  // --- Composite Services --- //

  scoringComponent = 'B'

  let servicesCompositeCell = sheet.getRange(activeRow, tempCol + 2 * nrOfIndSubComps) // 2 := group + opCom cols

  servicesCompositeCell.setFormula(aggregateScoreFormula(indyLevelScoresServices))

  cellName = defineNamedRangeStringImport(
    indexPrefix,
    sheetModeID,
    currentStepLabelShort,
    Indicator.labelShort,
    scoringComponent,
    CompanyObj.id,
    '',
    scoringSuffix
  )

  SS.setNamedRange(cellName, servicesCompositeCell)
  // apply scoring Logic
  currentCell = checkScoringLogic(Indicator, scoringComponent, servicesCompositeCell, cellName, indyCompositeScores)

  Logger.log(' - ' + 'composite services score added for ' + Indicator.labelShort)

  return activeRow + 1
}

function addIndicatorScore(
  SS,
  sheetModeID,
  activeRow,
  activeCol,
  sheet,
  currentStepLabelShort,
  Indicator,
  CompanyObj,
  indyCompositeScores,
  blocks
) {
  Logger.log(' - ' + 'in indicator scoring for ' + ' ' + Indicator.labelShort)

  let scoringSuffix = 'SI'

  activeRow += 1

  let currentCell = sheet.getRange(activeRow, activeCol)

  let tempCol = activeCol

  // row label / first Column
  // skip first Column for subsequent steps
  if (blocks === 1) {
    currentCell.setValue('Indicator Score')
    currentCell.setFontWeight('bold')
    tempCol += 1
  }

  currentCell = sheet.getRange(activeRow, tempCol)

  Logger.log(' - ' + 'Indicator Scoring Ranges - indyCompositeScores[]:\n --- ' + indyCompositeScores)

  currentCell.setFormula(aggregateScoreFormula(indyCompositeScores))

  currentCell.setFontWeight('bold')
  currentCell.setNumberFormat('0.##')

  // naming the level cell score
  let component = ''

  let cellName = defineNamedRangeStringImport(
    indexPrefix,
    sheetModeID,
    currentStepLabelShort,
    Indicator.labelShort,
    component,
    CompanyObj.id,
    '',
    scoringSuffix
  )

  SS.setNamedRange(cellName, currentCell)

  // --- INDICATOR END --- //

  return activeRow + 1
}
