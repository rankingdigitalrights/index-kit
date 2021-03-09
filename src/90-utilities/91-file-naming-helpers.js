// --- // central File naming logic // --- //
//"use strict"

function spreadSheetFileName(filenamePrefix, mainSheetMode, mainFileNameElement, filenameSuffix) {

    let filename = filenamePrefix + " " + mainFileNameElement + " - " + mainSheetMode + " " + filenameSuffix

    return filename
}

function cleanCompanyName(Company) {
    
    let companyName
    if (Company.label.altFilename) {
        companyName = Company.label.altFilename
    } else {
        companyName = Company.label.current
    }

    Logger.log("Company Name parsed: " + companyName)
    return companyName
}