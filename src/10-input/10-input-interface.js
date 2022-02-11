// --- Spreadsheet Casting: Company Data Collection Sheet --- //

/* function starts creating a spreadsheet for a single company and populates it by calling populateDCbyCategory()*/

//"use strict"

// eslint-disable-next-line no-unused-vars
// function createSpreadsheetInput({
//   useIndicatorSubset = false,
//   Company,
//   filenamePrefix,
//   filenameSuffix,
//   mainSheetMode = 'Input',
// }) {

function createSpreadsheetInput(mainFolder, mainConfig, indicatorsObj, researchSteps, c) {

  Logger.log('--- // --- begin main data collection --- // ---')

  let sourcesTabName = 'Sources'

  let companyShortName = cleanCompanyName(c)
  c.name = companyShortName

  let mainSheetMode = 'Input'

  Logger.log('--- // --- creating ' + mainSheetMode + ' Spreadsheet for ' + companyShortName + ' --- // ---')

  // importing the JSON objects which contain the parameters
  // Refactored to fetching from Google Drive

  // json objects
  // let Config = centralConfig // let Config = importLocalJSON("Config")
  // let Indicators = IndicatorsObj
  // let ResearchStepsObj = researchStepsVector

  // config information
  let serviceColWidth = mainConfig.serviceColWidth
  let doCollapseAll = mainConfig.collapseAllGroups
  let scoringSteps = mainConfig.scoringSteps

  // TODO add them to mainConfig?
  let filenamePrefix = 'Mini-Index'
  let filenameSuffix = ''

  // connect to existing spreadsheet or creat a blank spreadsheet
  let spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)

  let ss = createSpreadSheet(mainFolder, spreadsheetName)

  let fileID = ss.getId()
  Logger.log('SS ID: ' + fileID)

  // TODO implement prevYear tab

  // --- // creates sources page // --- //

  newSheet = insertSheetIfNotExist(ss, sourcesTabName, false)
  if (newSheet !== null) {
    fillSourceSheet(newSheet)
  }

  // if scoring sheet is integrated into DC, create Points sheet

  let hasOpCom = c.hasOpCom

  // --- // MAIN TASK // --- //
  // for each Indicator Class do
  let currentCat

  for (let i = 0; i < indicatorsObj.indicatorCategories.length; i++) {
    currentCat = indicatorsObj.indicatorCategories[i]

    Logger.log('Starting ' + currentCat.labelLong)
    Logger.log('Passing over ' + researchSteps.researchSteps.length + ' Steps')

    populateDCSheetByCategory(
      ss,
      currentCat,
      c,
      researchSteps,
      c.services.length,
      serviceColWidth,
      hasOpCom,
      doCollapseAll,
      mainConfig,
      scoringSteps
    )

    Logger.log('Completed ' + currentCat.labelLong)
  }

  Logger.log('end DC main')

  // clean up //
  // if empty Sheet exists, delete
  removeEmptySheet(ss)

  Logger.log(mainSheetMode + ' Spreadsheet created for ' + companyShortName)
  return fileID
}
