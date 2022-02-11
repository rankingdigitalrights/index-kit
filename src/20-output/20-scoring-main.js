// --- Spreadsheet Casting: Company Scoring Sheet --- //
// Works only for a single ATOMIC step right now //

// --------------- This is the Main Scoring Process Caller ---------------- //

// function createSpreadsheetOutput(useIndicatorSubset, thisCompany, filenamePrefix, filenameSuffix, mainSheetMode) {
    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive
function createSpreadsheetOutput(mainFolder, mainConfig, indicators, researchStepsObj, comp) {

    let sheetModeID = "SC"

    let companyFilename = comp.data.name

    let mainSheetMode = 'Output'

    Logger.log("--- --- START: main Scoring for " + companyFilename)
    Logger.log("--- --- START: creating " + mainSheetMode + " Spreadsheet for " + companyFilename)

    let hasOpCom = comp.hasOpCom
    Logger.log(companyFilename + " opCom? - " + hasOpCom)

    // TODO add them to mainConfig?
    let filenamePrefix = 'Mini-Index'
    let filenameSuffix = ''

    // define SS name
    let spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyFilename, filenameSuffix)

    let ss = createSpreadSheet(mainFolder, spreadsheetName)
    let fileID = ss.getId()

    // creates Outcome  page

    // Scoring Scheme / Validation
    var pointsSheet = insertPointValidationSheet(ss, "Points")

    // --- // Main Procedure // --- //

    var integrateOutputs = false
    var isPilotMode = false
    var outputParams = mainConfig.scoringParams

    addSetOfScoringSteps(ss, sheetModeID, mainConfig, indicators, researchStepsObj, comp, hasOpCom, integrateOutputs, outputParams, isPilotMode)

    moveHideSheetifExists(ss, pointsSheet, 1)

    // clean up // 
    // if empty Sheet exists, delete
    removeEmptySheet(ss)

    Logger.log("--- --- END: main Scoring for " + companyFilename)

    return fileID
}