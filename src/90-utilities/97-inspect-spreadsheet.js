// eslint-disable-next-line no-unused-vars

function processCompanyHealth(listSheetBroken, company) {
    var companyShortName = cleanCompanyName(company)
    console.log('--- // --- begin processing ' + companyShortName + ' --- // ---')

    // connect to Company Input Spreadsheet

    var ss = connectToSpreadsheetByID(company.urlCurrentDataCollectionSheet)

    // skip if company spreadsheet does not exist
    if (ss === null) {
        console.log('!!!ERROR!!! : ' + companyShortName + ' does not exist. Skipping.')
        return null
    }

    var currentDate = getISOtimeAsString()

    listSheetBroken.appendRow([currentDate, companyShortName, company.urlCurrentInputSheet])

    // --- // MAIN TASK // --- //
    console.log('FLOW --- begin Inspection ' + companyShortName + ' --- // ---')
    inspectInputSheet(ss, listSheetBroken)
}

function inspectInputSheet(ss, listSheet) {
    let namedRangesRaw = ss.getNamedRanges()
    console.log(`Length of Named Ranges received: ${namedRangesRaw.length}`)

    let namedRanges = []

    let indicator, step, range, rangeVal, rangeName

    let regexInd = new RegExp('[G|F|P]\\d+[a-z]?')
    let regexStep = new RegExp('S\\d{3}')

    console.log('processing')

    namedRangesRaw = namedRangesRaw.filter(
        (namedRange) => namedRange.getRange().getA1Notation() === '#REF!'
    )

    console.log('Filtered Named Ranges: ' + namedRangesRaw.length)

    if (namedRangesRaw.length > 0) {
        namedRangesRaw.forEach((namedRange) => {
            range = namedRange.getRange()
            rangeVal = range.getA1Notation()

            rangeName = namedRange.getName()
            indicator = rangeName.match(regexInd)
            step = rangeName.match(regexStep)

            namedRanges.push([
                ['|------'],
                [indicator],
                [step],
                [rangeName],
                [rangeVal],
            ])
        })
    }

    if (namedRanges.length > 0) {
        namedRanges = namedRanges.sort()
        let width = namedRanges[0].length
        let height = namedRanges.length
        listSheet.getRange(
            listSheet.getLastRow() + 1,
            1,
            height,
            width
        ).setValues(namedRanges)
    } else {
        listSheet.appendRow(['| --- |', 'OK'])
    }
}
