import fs from "fs";
import { loggerService } from "./logger.service.js";
import { makeId, readJsonFile  } from "./util.service.js";

const bugs = readJsonFile('./data/bugs.json')

export const bugService = {
  query,
  getById,
  remove,
  save
};

async function query() {
  try {
    return bugs;
  } catch (error) {
    loggerService.error("couldnt retrieve bugs.", error);
    throw error;
  }
}

async function getById(bugId){
    try {
        let bug = bugs.find(bug => bug._id === bugId)
        if(!bug){
            throw `Couldn't find bug with id ${bugId}`
        }
        return bug
    } catch (error) {
        loggerService.error("couldnt get bug.", error);
        throw error;
    }
}

async function save(bugToSave) {
  try {
    if(bugToSave._id){
        let bugIndex = bugs.findIndex(bug => bug._id === bugToSave._id)
        if(bugIndex === -1){
            throw `Couldn't update car with _id ${bugToSave._id}`
        }
        bugs[bugIndex] = bugToSave
    }
    else{
        bugToSave._id = makeId()
        bugs.push(bugToSave)
    }
    await _saveBugsToFile()
    return bugToSave
  } catch (error) {
    loggerService.error("Couldn't finish operation 'save': ", error)
    throw error
  }
}

async function remove(bugId) {
  try {
    let bugIndex = bugs.findIndex(bug => bug._id === bugId)
    if(bugIndex === -1){
        throw `Couldn't find bug with id ${bugId}`
    }
    bugs.splice(bugIndex,1)
    return _saveBugsToFile()
  } catch (error) {
    loggerService.error("Couldn't remove bug.", error)
    throw error
  }
}

function _saveBugsToFile(path = './data/bugs.json') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}