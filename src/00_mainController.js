/* this function creates input sheets for specified companies in the designated
 output folder by calling createSpreadsheetInput() and adds the sheets to the control sheet by calling addFileIDtoControl()*/

//"use strict"

// function initiateGlobalConfig() {
//   indexPrefix = centralConfig.indexPrefix
//   filenamePrefix = '2021 Mini Index -'
//   filenameSuffix = 'Dev' // Dev, "", Debug, QC
//   rootFolderID = centralConfig.rootFolderID // "2019 Back-End Dev"
//   outputFolderName = centralConfig.outputFolderName // '2021 Mini Index'

//   controlSpreadsheetID = centralConfig.controlSpreadsheetID // 00_2019_Pilot_Dashboard

//   IndicatorsObj = subsetIndicatorsObject(
//     indicatorsVector,
//     ['G1', 'G2', 'G4a', 'G4b', 'G5', 'F1a', 'F3a', 'F9', 'F10', 'F11', 'P1a', 'P3a', 'P3b', 'P4', 'P5', 'P6', 'P7', 'P8', 'P10a', 'P10b', 'P11a', 'P11b', 'P12', 'P15']
//   )
// }

function mainInputSheets() {
  let mainFolder = getMainFolder()
  let compConfig = retrieveCompaniesConfig(mainFolder)
  let mainConfig = retrieveCentralConfig(mainFolder)
  let compData = {}

  let indicatorsObj = subsetIndicatorsObject(indicatorsVector, mainConfig.indicators)

  compConfig.forEach((c) => {
    let fileId = createSpreadsheetInput(mainFolder, mainConfig, indicatorsObj, researchStepsVector, c)
    compData[c.id] = {
      name: c.name,
      input: fileId,
      scoring: null
    }
  })

  let compSheet = retrieveCompaniesSheet(mainFolder)
  updateCompaniesSheet(compSheet, compData)
}

function mainScoringSheets() {
  let mainFolder = getMainFolder()
  let compConfig = retrieveCompaniesConfig(mainFolder)
  let mainConfig = retrieveCentralConfig(mainFolder)
  let compSheet = retrieveCompaniesSheet(mainFolder)
  let compData = retrieveCompaniesData(compSheet)
  let indicatorsObj = subsetIndicatorsObject(indicatorsVector, mainConfig.indicators)

  compConfig.forEach((c) => {
    c.data = compData[c.id]
    let fileId = createSpreadsheetOutput(mainFolder, mainConfig, indicatorsObj, researchStepsVector, c)
    c.data.scoring = fileId
  })
  updateCompaniesSheet(compSheet, compData)
}

function mainSummarySheets() {
  let mainFolder = getMainFolder()
  let compConfig = retrieveCompaniesConfig(mainFolder)
  let mainConfig = retrieveCentralConfig(mainFolder)
  let compSheet = retrieveCompaniesSheet(mainFolder)
  let compData = retrieveCompaniesData(compSheet)

  let step = 'S01'

  let ss = createSpreadSheet(mainFolder, `${step} - Scores Summary`)
  let tab = ss.getSheets()[0]

  let indicatorLabels = mainConfig.indicators

  writeHeaderColumn(tab, 1, indicatorLabels, step)
  writeCompanySummaries(tab, 2, mainConfig.indexPrefix, compConfig, compData, indicatorLabels, step)

  tab.setFrozenColumns(1)
  tab.setFrozenRows(2)
}

function startProject() {
  let mainFolder = getMainFolder()
  let compSheet = retrieveCompaniesSheet(mainFolder)
  if (!compSheet) {
    compSheet = createSpreadSheet(mainFolder, 'companies-data')
    compSheet.getSheets()[0].setName('Companies')
    console.log("✅ New companies-data sheet created.")
  } else {
    console.log("✅ companies-data sheet already created.")
  }
  // TODO check jsons
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