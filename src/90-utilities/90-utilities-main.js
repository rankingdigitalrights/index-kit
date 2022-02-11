function getMainFolder() {
    return DriveApp.getFolderById('1Nwkb_7ikDYd1MfUsx-_35c8BBe4dxva2')
}

function retrieveCentralConfig(rootFolder) {
    let fileIterator = rootFolder.getFilesByName('config.json')
    if (!fileIterator.hasNext()) {
        return null
    }
    let fcon = fileIterator.next().getBlob().getDataAsString()
    return JSON.parse(fcon)
}

function retrieveCompaniesConfig(rootFolder) {
    let fileIterator = rootFolder.getFilesByName('companies.json')
    if (!fileIterator.hasNext()) {
        return null
    }
    let fcon = fileIterator.next().getBlob().getDataAsString()
    return JSON.parse(fcon)
}

function retrieveCompaniesSheet(rootFolder) {
    let files = rootFolder.getFilesByName('companies-data')
    if (!files.hasNext()) {
        return null
    }
    return SpreadsheetApp.open(files.next())
}

function retrieveCompaniesData(companiesSheet) {
    let tab = companiesSheet.getSheetByName('Companies')
    let range = tab.getDataRange()
    let values = range.getValues().slice(1)
    let companies = {}
    for (let row of values) {
        companies[row[0]] = {
            name: row[1],
            input: row[2],
            scoring: row[3]
        }
    }
    return companies
}

function updateCompaniesSheet(companiesSheet, newData) {
    let tab = companiesSheet.getSheetByName('Companies')
    tab.clear()
    let values = [
        ['id', 'company', 'input sheet', 'scoring sheet']
    ]
    let companies = {}
    for (let prop in newData) {
        values.push([prop, newData[prop].name, newData[prop].input, newData[prop].scoring])
    }
    let range = tab.getRange(1, 1, values.length, 4)
    range.setValues(values)
}

function createSpreadSheet(rootFolder, spreadsheetName, subFolder = null) {
    let f = null
    if (subFolder) {
        let subfolders = rootFolder.getFoldersByName(subFolder)
        if (!subfolders.hasNext()) {
            f = rootFolder.createFolder(subFolder)
        } else {
            f = subfolders.next()
        }
    } else {
        f = rootFolder
    }
    let files = f.getFilesByName(spreadsheetName)
    if (files.hasNext()) {
        throw 'Spreadsheet already exists, delete the file and then execute this script again.'
    }
    newSS = SpreadsheetApp.create(spreadsheetName)
    DriveApp.getFileById(newSS.getId()).moveTo(f)
    return newSS
}