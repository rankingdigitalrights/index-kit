//"use strict"
function populateDCSheetByCategory(
  SS,
  thisIndCat,
  CompanyObj,
  ResearchStepsObj,
  companyNumberOfServices,
  serviceColWidth,
  hasOpCom,
  doCollapseAll,
  includeRGuidanceLink = false,
  collapseRGuidance = false,
  useIndicatorSubset = false
) {
  // for each indicator
  // - create a new Sheet
  // - name the Sheet
  // -

  let thisIndCatLength = thisIndCat.indicators.length

  // iterates over each indicator in the current type
  // for each indicator = distinct Sheet do

  let lastRow

  for (let i = 0; i < thisIndCatLength; i++) {
    let thisInd = thisIndCat.indicators[i]
    Logger.log('indicator :' + thisInd.labelShort)
    let thisIndScoringScope = thisInd.scoringScope
    Logger.log('Scoring Scope: ' + thisInd.labelShort + ' ' + thisIndScoringScope)

    let sheet = insertSheetIfNotExist(SS, thisInd.labelShort, false)

    if (sheet === null) {
      continue
    } // skips this i if sheet already exists

    // checks how many company group/opcom columns to hide for this Indicator
    // (based on Scoring Scope)

    let bridgeCompColumnsNr = 2 // default:: no company columns
    let bridgeOpCom

    if (thisInd.scoringScope == 'full') {
      if (hasOpCom) {
        bridgeCompColumnsNr = 0
      } else {
        // if (companyNumberOfServices > 1) {
        bridgeCompColumnsNr = 1
        // }
      }
    }

    // general formatting of sheet
    // TODO: think about where to refactor to
    sheet.setColumnWidth(1, serviceColWidth)

    let numberOfColumns = companyNumberOfServices + 2 + 1

    let thisColWidth = serviceColWidth

    // if (CompanyObj.services.length == 1) {
    //     thisColWidth = serviceColWidth * 1.33
    // }

    sheet.setColumnWidths(2, numberOfColumns - 1, thisColWidth)

    // start sheet in first top left cell
    let activeRow = 1
    let activeCol = 1

    // adds up indicator guidance
    activeRow = addIndicatorGuidance(
      sheet,
      thisInd,
      activeRow,
      activeCol,
      hasOpCom,
      numberOfColumns,
      bridgeCompColumnsNr,
      companyNumberOfServices,
      includeRGuidanceLink,
      collapseRGuidance
    )

    // --- // Begin Main Step-Wise Procedure // --- //

    let dataStartRow = activeRow

    let mainStepsLength = ResearchStepsObj.researchSteps.length

    // for each main step
    for (let mainStepNr = 0; mainStepNr < mainStepsLength; mainStepNr++) {
      let thisMainStep = ResearchStepsObj.researchSteps[mainStepNr]
      let thisMainStepColor = thisMainStep.stepColor
      // setting up all the substeps for all the indicators

      Logger.log('main step : ' + thisMainStep.step)
      let subStepsLength = thisMainStep.substeps.length

      activeRow = addMainStepHeader(
        sheet,
        thisIndCat,
        CompanyObj,
        activeRow,
        SS,
        companyNumberOfServices,
        thisMainStep.step,
        thisMainStepColor
      ) // sets up header

      let beginStep = activeRow
      let endStep = activeRow

      // --- // Begin sub-Step-Wise Procedure // --- //

      // for each substep
      for (let subStepNr = 0; subStepNr < subStepsLength; subStepNr++) {
        let currentStep = thisMainStep.substeps[subStepNr]
        Logger.log('substep : ' + currentStep.labelShort)

        let currentStepClength = currentStep.components.length

        // step-wise evaluate components of current research Step, execute the according building function and return the active row, which is then picked up by next building function

        // stores first row of a step to use later in naming a step
        let firstRow = activeRow + 1

        // Begin step component procedure
        for (let stepCNr = 0; stepCNr < currentStepClength; stepCNr++) {
          let thisStepComponent = currentStep.components[stepCNr].type

          Logger.log('step.component : ' + currentStep.labelShort + ' : ' + thisStepComponent)

          // create the type of substep component that is specified in the json

          switch (thisStepComponent) {
            case 'header':
              activeRow = addSubStepHeader(
                sheet,
                thisInd,
                CompanyObj,
                activeRow,
                SS,
                currentStep,
                stepCNr,
                thisIndCat,
                companyNumberOfServices
              )
              break

            case 'elementResults':
              activeRow = addEvaluationDropdown(
                sheet,
                thisInd,
                CompanyObj,
                activeRow,
                SS,
                currentStep,
                stepCNr,
                thisIndCat,
                companyNumberOfServices
              )
              break

            case 'binaryReview':
              activeRow = addBinaryEvaluation(
                sheet,
                thisInd,
                CompanyObj,
                activeRow,
                SS,
                currentStep,
                stepCNr,
                thisIndCat,
                companyNumberOfServices
              )
              break

            case 'elementComments':
              activeRow = addComments(
                sheet,
                thisInd,
                CompanyObj,
                activeRow,
                SS,
                currentStep,
                stepCNr,
                thisIndCat,
                companyNumberOfServices
              )
              break

            case 'sources':
              activeRow = addSources(
                sheet,
                thisInd,
                CompanyObj,
                activeRow,
                SS,
                currentStep,
                stepCNr,
                thisIndCat,
                companyNumberOfServices
              )
              break

            case 'extraQuestion':
              activeRow = addExtraInstruction(currentStep, stepCNr, activeRow, activeCol, sheet)
              break

            case 'comparison':
              activeRow = addComparisonYonY(
                sheet,
                thisInd,
                CompanyObj,
                activeRow,
                currentStep,
                stepCNr,
                thisIndCat,
                companyNumberOfServices
              )
              break

            default:
              sheet.appendRow(['!!!You missed a component!!!'])
              break
          }
        } // END substep component procedure

        // if there are no more substeps, we store the final row and name the step
        // if (stepCNr == currentStepClength - 1) {

        lastRow = activeRow

        let maxCol = 1 + (companyNumberOfServices + 2) // calculates the max column

        // we don't want the researchers' names as part of the range
        // so move firstRow by 1
        let range = sheet.getRange(firstRow + 1, 2, lastRow - firstRow - 1, maxCol - 1)

        // cell name formula; output defined in 44_rangeNamingHelper.js
        let stepNamedRange = defineNamedRangeStringImport(
          indexPrefix,
          'DC',
          currentStep.subStepID,
          thisIndCat.indicators[i].labelShort,
          CompanyObj.id,
          '',
          'Step'
        )

        SS.setNamedRange(stepNamedRange, range) // names an entire step

        // GROUPING for substep
        let substepRange = range.shiftRowGroupDepth(1)

        // COLLAPSE substep GROUP per researchSteps substep setting
        if (!doCollapseAll) {
          if (currentStep.doCollapse) {
            substepRange.collapseGroups()
          }
        }
        endStep = activeRow
        // }

        endStep = activeRow
      } // --- // END Sub-Step-Wise Procedure // --- //

      if (mainStepNr < mainStepsLength - 1) {
        sheet
          .getRange(activeRow, activeCol, 1, numberOfColumns)
          .setBorder(null, null, true, null, null, null, 'black', null)
      }

      activeRow += 1

      // group whole step and make main step header row the anchor
      let rangeStep = sheet.getRange(beginStep + 1, 1, endStep - beginStep - 1, numberOfColumns)
      Logger.log('grouping whole step for range :' + rangeStep.getA1Notation())
      rangeStep.shiftRowGroupDepth(1)
    } // --- // END Main-Step-Wise Procedure // --- //

    // set font for whole data range
    let sheetRange = sheet
      .getRange(dataStartRow, 1, lastRow, numberOfColumns)
      .setFontFamily('Roboto')
      .setFontSize(10)
      .setWrap(true)
      .setVerticalAlignment('top')

    let condRuleNames = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Your Name')
      .setFontColor('#ea4335')
      .setBold(true)
      .setRanges([sheetRange])
      .build()

    let condRuleValues = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('not selected')
      // .setFontColor('#ea4335')
      .setBackground('#f4cccc')
      .setRanges([sheetRange])
      .build()

    let rules = sheet.getConditionalFormatRules()
    rules.push(condRuleNames)
    rules.push(condRuleValues)
    sheet.setConditionalFormatRules(rules)

    // collapse all groups
    if (doCollapseAll) {
      sheet.collapseAllRowGroups()
    }

    // hides opCom column(s) if opCom == false
    // TODO: make dynamic

    if (thisIndScoringScope == 'full') {
      if (!hasOpCom) {
        sheet.hideColumns(3)
      }
    } else {
      sheet.hideColumns(2, bridgeCompColumnsNr)
    }

    // color Indicator Sheet (Tab) in Class Color when done
    sheet.setTabColor(thisIndCat.classColor)
  } // End of Indicator Sheet
} // End of populating process
