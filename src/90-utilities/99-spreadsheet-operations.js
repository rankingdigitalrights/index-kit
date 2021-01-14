// --- connection helper function  --- //

// Connect by Spreadsheet name //
// Universal Method: Connect to Spreadsheet File and return Obj as open Spreadsheet

// Main Test Caller //

function mainTestConnectionByName() {
    let spreadsheetName = "verizon test"
    connectToSpreadsheetByName(spreadsheetName, false)
}

function mainTestConnectionByID() {
    connectToSpreadsheetByID(spreadsheetID)
}

// TODO: refactor everywhere into two seperate functions:
// one to try to connect and return null if file does not exist
// one to create a new file
// --> separation of concerns AND explicit action where needed

function connectToSpreadsheetByName(spreadsheetName, createNewFile) {

    let Spreadsheets = DriveApp.getFilesByName(spreadsheetName)

    let Spreadsheet = null

    // if SS doesn't exist
    // --- and createNewFile === true
    // --- create new SS
    // --- else return null
    // else
    // if SS exists --> return SS

    if (!Spreadsheets.hasNext()) {

        Logger.log(spreadsheetName + " does not exist!")

        if (createNewFile) {
            Logger.log("--- --- START: creating " + spreadsheetName)

            let folderID = createFolderIfNotExist(rootFolderID, outputFolderName)

            let resource = {
                title: spreadsheetName,
                mimeType: MimeType.GOOGLE_SHEETS,
                parents: [{
                    id: folderID
                }]
            }

            // Logger.log(resource.parents.id)
            let fileJson = Drive.Files.insert(resource)

            let fileId = fileJson.id
            Logger.log("new Speadsheet fileID: " + fileId)
            Spreadsheet = connectToSpreadsheetByID(fileId)

        } else {
            Spreadsheet = null
        }

    } else {

        // while (Spreadsheet.hasNext()) { }
        // Nope. Only do for first Spreadsheet element
        let thisSpreadsheet = Spreadsheets.next()
        Logger.log("File " + thisSpreadsheet.getName() + " exists")
        Logger.log("locally connected to: " + thisSpreadsheet.getName())

        Spreadsheet = SpreadsheetApp.open(thisSpreadsheet)
    }
    // returns SS or null
    return Spreadsheet
}

// connect by Spreadsheet ID //
// more accurate then by name //

function connectToSpreadsheetByID(ID) {

    let thisSpreadsheet = SpreadsheetApp.openById(ID)
    Logger.log("locally connected to: " + thisSpreadsheet.getName())
    return thisSpreadsheet

}


// Help Function to overwrite Sheet in Spreadsheet if it is already existing

function insertSheetIfNotExist(Spreadsheet, SheetName, updateSheet) {
    let Sheet
    if (!Spreadsheet.getSheetByName(SheetName)) {
        Sheet = Spreadsheet.insertSheet(SheetName)
    } else {
        if (updateSheet) {
            Sheet = Spreadsheet.getSheetByName(SheetName)
        } else {
            Sheet = null
            Logger.log("WARN: " + "Sheet for " + SheetName + " already exists ")
        }
    }
    return Sheet
}

function moveHideSheetifExists(Spreadsheet, Sheet, posInt) {

    if (!posInt) {
        posInt = 1
    }

    if (Sheet !== null) {
        moveSheetToPos(Spreadsheet, Sheet, posInt)
        Sheet.hideSheet()
    }
}

function moveSheetifExists(Spreadsheet, Sheet, posInt) {

    if (!posInt) {
        posInt = 1
    }

    if (Sheet !== null) {
        moveSheetToPos(Spreadsheet, Sheet, posInt)
    }
}



function moveSheetToPos(Spreadsheet, Sheet, posInt) {
    Spreadsheet.setActiveSheet(Sheet)
    Spreadsheet.moveActiveSheet(posInt)
}

function addFileIDtoControl(mode, companyShortName, fileID, controlSpreadsheetID) {

    let spreadsheet = connectToSpreadsheetByID(controlSpreadsheetID)
    let sheet = insertSheetIfNotExist(spreadsheet, mode, true)
    let formula = "=HYPERLINK(CONCAT(\"https://docs.google.com/spreadsheets/d/\",INDIRECT(ADDRESS(ROW(),COLUMN()-1))),INDIRECT(ADDRESS(ROW(),COLUMN()-2)))"
    sheet.appendRow([mode, companyShortName, fileID, formula])
    Logger.log("created" + fileID + "; added to Control")

}

function importRangeFormula(url, range, integrateOutputs) {

    let formula

    if (integrateOutputs) {
        formula = "=" + range
    } else {
        formula = "=IMPORTRANGE(\"" + url + "\",\"" + range + "\")"
        formula = formula.toString()
    }
    return formula
}

function getSheetByName(Spreadsheet, Sheetname) {
    let Sheet
    if (!Spreadsheet.getSheetByName(Sheetname)) {
        Sheet = null
        Logger.log("Sheet " + Sheetname + " not found.")
    } else {
        Sheet = Spreadsheet.getSheetByName(Sheetname)
    }
    return Sheet
}

function removeEmptySheet(SS) {
    let emptySheet = SS.getSheetByName("Sheet1")

    if (emptySheet) {
        SS.deleteSheet(emptySheet)
    }
}

function resizeSheet(Sheet, newRows) {
    let oldRows = Sheet.getMaxRows()
    let rowDiff = newRows - oldRows
    if (oldRows < newRows) {
        Sheet.insertRows(1, rowDiff)
    }
}