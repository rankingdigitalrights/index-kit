// --- Spreadsheet Casting: Company Data Collection Sheet --- //

function createSpreadsheetInput(useStepsSubset, useIndicatorSubset, CompanyObj, filenamePrefix, filenameSuffix, mainSheetMode) {
    Logger.log("--- // --- begin main data collection --- // ---")

    let sourcesTabName = "Sources"

    let companyShortName = cleanCompanyName(CompanyObj)

    Logger.log("--- // --- creating " + mainSheetMode + " Spreadsheet for " + companyShortName + " --- // ---")

    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    let Config = centralConfig // let Config = importLocalJSON("Config")
    // let CompanyObj = CompanyObj // TODO this a JSON Obj now; adapt in scope
    let IndicatorsObj = indicatorsVector
    let ResearchStepsObj = researchStepsVector

    let serviceColWidth = Config.serviceColWidth
    let doCollapseAll = Config.collapseAllGroups
    let integrateOutputs = Config.integrateOutputs
    let importedOutcomeTabName = Config.prevYearOutcomeTab
    let includeRGuidanceLink = Config.includeRGuidanceLink
    let collapseRGuidance = Config.collapseRGuidance


    // connect to existing spreadsheet or creat a blank spreadsheet
    let spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)

    let SS = connectToSpreadsheetByName(spreadsheetName, true)

    let fileID = SS.getId()
    Logger.log("SS ID: " + fileID)
    // --- // add previous year's outcome sheet // --- //

    // Formula for importing previous year's outcome
    let externalFormula = "=IMPORTRANGE(\"" + Config.prevIndexSSID + "\",\"" + CompanyObj.tabPrevYearsOutcome + "!" + "A:Z" + "\")"

    let newSheet

    // if set in Config, import previous Index Outcome
    if (Config.YearOnYear) {
        newSheet = insertSheetIfNotExist(SS, importedOutcomeTabName, false)
        if (newSheet !== null) {
            fillPrevOutcomeSheet(newSheet, importedOutcomeTabName, externalFormula)
        }
    }

    // --- // creates sources page // --- //

    newSheet = insertSheetIfNotExist(SS, sourcesTabName, false)
    if (newSheet !== null) {
        fillSourceSheet(newSheet)
    }

    // if scoring sheet is integrated into DC, create Points sheet

    let hasOpCom = CompanyObj.hasOpCom

    // fetch number of Services once
    let companyNumberOfServices = CompanyObj.services.length

    // --- // MAIN TASK // --- //
    // for each Indicator Class do
    let currentCat

    for (let i = 0; i < IndicatorsObj.indicatorClasses.length; i++) {

        currentCat = IndicatorsObj.indicatorClasses[i]

        Logger.log("Starting " + currentCat.labelLong)
        Logger.log("Passing over " + ResearchStepsObj.researchSteps.length + " Steps")

        populateDCSheetByCategory(SS, currentCat, CompanyObj, ResearchStepsObj, companyNumberOfServices, serviceColWidth, hasOpCom, doCollapseAll, includeRGuidanceLink, collapseRGuidance, useIndicatorSubset)

        Logger.log("Completed " + currentCat.labelLong)
    }

    Logger.log("end DC main")

   
    // clean up //
    // if empty Sheet exists, delete
    removeEmptySheet(SS)

    Logger.log(mainSheetMode + " Spreadsheet created for " + companyShortName)
    return fileID
}