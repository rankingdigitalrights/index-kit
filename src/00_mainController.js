function mainInputSheets() {

    initiateGlobalConfig()
    filenameSuffix = "Dev" // Dev, "", Debug, QC
    var mainSheetMode = "Input" // for filename
    var useStepsSubset = false // true := use subset
    var useIndicatorSubset = true // true := use subset

    var Companies = companiesVector.companies
        .slice(0, 0) // on purpose to prevent script from running.
    // .slice(0,3) // Subset #1 0:2
    // .slice(3,6) // Subset #2 3:5
    // .slice(6,9) // Subset #3 6:8

    // .slice(0,1) // Amazon
    // .slice(1, 2) // Apple
    // .slice(2,3) // Deutsche Telekom
    // .slice(3,4) // Facebook
    // .slice(4, 5) // Google
    // .slice(5,6) // Microsoft
    // .slice(6,7) // Telefonica
    // .slice(7,8) // Twitter
    // .slice(8,9) // Vodafone

    var fileID

    Companies.forEach(function (Company) {

        fileID = createSpreadsheetInput(useStepsSubset, useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)

        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)

    })

}


function initiateGlobalConfig() {

    indexPrefix = centralConfig.indexPrefix
    filenamePrefix = "2019 Pilot -"
    filenameSuffix = "Dev" // Dev, "", Debug, QC
    rootFolderID = centralConfig.rootFolderID // "2019 Back-End Dev"
    outputFolderName = "2019 Pilot Demo" // "2019 Pilot Data Store"

    controlSpreadsheetID = centralConfig.controlSpreadsheetID // 00_2019_Pilot_Dashboard
}