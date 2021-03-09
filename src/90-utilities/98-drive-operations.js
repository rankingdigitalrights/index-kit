// search Folder and create a new one if needed
//"use strict"

function createFolderIfNotExist(ParentFolderID, FolderName) {
    let Parent = DriveApp.getFolderById(ParentFolderID)
    let Children = Parent.getFoldersByName(FolderName)
    let Folder
    let FolderID
    if (!Children.hasNext()) {
        Logger.log("Folder " + FolderName + " does not exist. Creating a new one")
        Folder = Parent.createFolder(FolderName)
        FolderID = Folder.getId()
    } else {
        Folder = Children.next()
        FolderID = Folder.getId()
    }
    Logger.log("Found folder: " + Folder.getName())
    return FolderID
}