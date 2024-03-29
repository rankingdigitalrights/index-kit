/* this function creates input sheets for specified companies in the designated
 output folder by calling createSpreadsheetInput() and adds the sheets to the control sheet by calling addFileIDtoControl()*/

//"use strict"

function mainInputSheets() {
  initiateGlobalConfig()
  filenameSuffix = 'Dev Index Kit' // Dev, "", Debug, QC
  let mainSheetMode = 'Input' // for filename
  let useIndicatorSubset = true // true := use subset

  let Companies = companiesVector.companies //.slice(0, 0) // on purpose to prevent script from running.
    .slice(0,15)

    // .slice(0,1) // SLT Mobitel
    // .slice(1,2) // Dialog
    // .slice(2,3) // Globe Telecom
    // .slice(3,4) // Smart Communications
    // .slice(4,5) // NCell
    // .slice(5,6) // Nepal Telecom
    // .slice(6,7) // Dhiraagu
    // .slice(7,8) // Ooredoo Maldives
    // .slice(8,9) // Telkomsel
    // .slice(9,10) // XL Axiata
    // .slice(10,11) // Indosat Ooredoo
    // .slice(11,12) // Grameenphone
    // .slice(12,13) // Robi
    // .slice(13,14) // Smart
    // .slice(14,15) // Metfone


  let fileID

  Companies.forEach((Company) => {
    fileID = createSpreadsheetInput({
      useIndicatorSubset: useIndicatorSubset,
      Company,
      filenamePrefix,
      filenameSuffix,
      mainSheetMode,
    })

    addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)
  })
}

function initiateGlobalConfig() {
  indexPrefix = centralConfig.indexPrefix
  filenamePrefix = '2021 Mini Index -'
  filenameSuffix = 'Dev' // Dev, "", Debug, QC
  rootFolderID = centralConfig.rootFolderID // "2019 Back-End Dev"
  outputFolderName = centralConfig.outputFolderName // '2021 Mini Index'

  controlSpreadsheetID = centralConfig.controlSpreadsheetID // 00_2019_Pilot_Dashboard

  IndicatorsObj = subsetIndicatorsObject(indicatorsVector, ['F1a', 'F3a', 'F9', 'F10', 'P1a', 'P10a', 'P11a', 'P12'])
}

function mainScoringSheets() {
  initiateGlobalConfig()
  outputFolderName = 'Index Kit Scores - EngageMedia'
  let mainSheetMode = 'Output'
  let useStepsSubset = false // true := use subset
  let useIndicatorSubset = false // true := use subset

  let Companies = companiesVector.companies.slice(0, 15)
  // .slice(0,1) // SLT Mobitel

  let fileID

  Companies.forEach(function (Company) {
    fileID = createSpreadsheetOutput(
      useStepsSubset,
      useIndicatorSubset,
      Company,
      filenamePrefix,
      filenameSuffix,
      mainSheetMode
    )

    addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)
  })
}
