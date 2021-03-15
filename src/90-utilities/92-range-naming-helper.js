// --- // crtical: central range naming logic // --- //

// To change the cell naming logic, re-arrange the vars in the function body (not in the siganture)

// RDR2019DC S01 G1 iVM1 Step

//"use strict"

function defineNamedRangeStringImport(index, sheetModeID, step, indicatorElement, companyId, service, suffix) {

    let compCellName = index + sheetModeID + step + indicatorElement
    compCellName = compCellName + companyId + service
    if (suffix) {
        compCellName = compCellName + suffix
    }
    compCellName = compCellName.toString()
    return compCellName
}


// --- // rangedName cleaner // --- //
// (as named ranges are not removed with sheet.clear())

function clearAllNamedRangesFromSheet(sheet) {

    let namedRanges = sheet.getNamedRanges()
    for (let i = 0; i < namedRanges.length; i++) {
        namedRanges[i].remove()
    }
    return sheet
}