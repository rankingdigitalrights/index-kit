// --- // crtical: central range naming logic // --- //

// To change the cell naming logic, re-arrange the vars in the function body (not in the siganture)

// RDR2019DC S01 G1 iVM1 Step

//"use strict"

function defineNamedRangeStringImport(index, sheetModeID, step, indicatorElement, companyId, service, suffix="") {

    return `${index}${sheetModeID}${step}${indicatorElement}${companyId}${service}${suffix}`;
}

function defineNamedRangeStringFromObj(paramsObj) {
    return `${paramsObj.index}${paramsObj.mode}${paramsObj.step}${paramsObj.element}${paramsObj.company}${paramsObj.service}${paramsObj.suffix}`;
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