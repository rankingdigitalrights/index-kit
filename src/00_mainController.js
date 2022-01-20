/* this function creates input sheets for specified companies in the designated
 output folder by calling createSpreadsheetInput() and adds the sheets to the control sheet by calling addFileIDtoControl()*/

//"use strict"

function mainInputSheets() {
  initiateGlobalConfig()
  filenameSuffix = 'Dev Index Kit' // Dev, "", Debug, QC
  let mainSheetMode = 'Input' // for filename
  let useIndicatorSubset = true // true := use subset

  let Companies = companiesVector.companies //.slice(0, 0) // on purpose to prevent script from running.
    //.slice(0,15)

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

  IndicatorsObj = subsetIndicatorsObject(
    indicatorsVector,
    ['G1', 'G2', 'G4a', 'G4b', 'G5', 'F1a', 'F3a', 'F9', 'F10', 'F11', 'P1a', 'P3a', 'P3b', 'P4', 'P5', 'P6', 'P7', 'P8', 'P10a', 'P10b', 'P11a', 'P11b', 'P12', 'P15']
  )
}

function mainScoringSheets() {
  initiateGlobalConfig()
  outputFolderName = 'Index Kit Scores - PIN'
  let mainSheetMode = 'Output'
  let useStepsSubset = false // true := use subset
  let useIndicatorSubset = false // true := use subset

  let Companies = companiesVector.companies//.slice(1, 3)
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

function mainSummarySheets() {
  initiateGlobalConfig()

  let ss = SpreadsheetApp.openById("16DMz99-l_dyiRV7m_oTFjOPjYflNiP1CYknTsbVuRio")
  let tab = ss.getSheets()[0]

  let indicatorLabels = ['G1', 'G2', 'G4a', 'G4b', 'G5', 'F1a', 'F3a', 'F9', 'F10', 'F11', 'P1a', 'P3a', 'P3b', 'P4', 'P5', 'P6', 'P7', 'P8', 'P10a', 'P10b', 'P11a', 'P11b', 'P12', 'P15']

  let companies = companiesVector.companies

  writeHeaderColumn(tab, 1, indicatorLabels, 'S01')
  writeCompanySummaries(tab, 2, centralConfig.indexPrefix, companies, indicatorLabels)

  tab.setFrozenColumns(1)
  tab.setFrozenRows(2)
}

function mainInspectInputSheets() {
  initiateGlobalConfig()
  // IMPORTANT FLAG

  let controlSpreadsheet = connectToSpreadsheetByID(controlSpreadsheetID)
  let listSheetBroken = insertSheetIfNotExist(controlSpreadsheet, 'Input - Broken Refs', true)
  // ListSheetBroken.clear()

  let companies = companiesVector.companies

  companies.forEach((company) => {
      processCompanyHealth(listSheetBroken, company)
  })
}