import { listFiles } from './HardcodedFiles';
import { generateNewFile } from './WriteHelpers';
import PropTypes from 'prop-types';
import path from 'path';

// returns promise, value expected to be an array of locally stored files
export async function getFiles() {
  const fileNames = localStorage.getItem('fileNames');
  if (fileNames) {
    return getFilesFromStorage(fileNames);
  }
  else {
    return await getHardcodedFiles();
  }
}

// returns promise, value expected to be an array of the hardcoded files,
// also puts hardcoded files into local storage
async function getHardcodedFiles() {
  const files = listFiles();
  let fileNames = [];
  for (let i=0;i<files.length;i++) {
    const file = files[i];
    const text = await file.text();
    const fileObj = {
      text: text,
      name: path.basename(file.name),
      type: file.type,
      date: file.lastModified
    };
    fileNames.push(path.basename(file.name));
    localStorage.setItem(path.basename(file.name), JSON.stringify(fileObj));
  }
  localStorage.setItem('fileNames', JSON.stringify(fileNames));
  return files;
}

// returns a JSON object, queries local storage for the file with the given
// file name
export function getFileJSON(fileName) {
  const file = JSON.parse(localStorage.getItem(fileName));
  if (file) {
    return file;
  }
  return null;
}

getFileJSON.propTypes = {
  fileName: PropTypes.string
}

// void, puts given JSON file object in local storage
export function putFile(fileJSON) {
  const fileName = fileJSON.name;
  localStorage.setItem(fileName, JSON.stringify(fileJSON));
}

putFile.propTypes = {
  fileJSON: PropTypes.object
}

// returns a file object so index.js can set the activeFile, adds new file
// to local storage.
export function postFile(fileName, fileType) {
  const newFileObj = generateNewFile('', fileName, fileType);
  const newFileJSON = {
    text: '',
    name: path.basename(newFileObj.name),
    type: newFileObj.type,
    date: newFileObj.lastModified
  };
  const fileNamesArray = getFileNamesArray();
  fileNamesArray.push(fileName);
  localStorage.setItem('fileNames', JSON.stringify(fileNamesArray));
  localStorage.setItem(fileName, JSON.stringify(newFileJSON));
  return newFileObj;
}

postFile.propTypes = {
  fileName: PropTypes.string,
  fileType: PropTypes.string
}

// returns a boolean, true if the given filename is already used, false otherwise
export function fileNameTaken(fileName) {
  const fileNames = localStorage.getItem('fileNames');
  if (fileNames.includes(fileName)) {
    return true;
  }
  return false;
}

fileNameTaken.propTypes = {
  fileName: PropTypes.string
}

function getFileNamesArray() {
  const fileNames = JSON.parse(localStorage.getItem('fileNames'));
  return fileNames;
}

// returns an array of files stored in local storage
function getFilesFromStorage(fileNames) {
  let files = [];
  fileNames = JSON.parse(fileNames);
  for (let i=0;i<fileNames.length;i++) {
    const fileName = fileNames[i];
    const fileData = JSON.parse(localStorage.getItem(fileName));
    const newFile = new File(
      [fileData.text],
      fileData.name,
      { type: fileData.type, lastModified: new Date(fileData.date)}
    );
    files.push(newFile);
  }
  return files;
}

getFilesFromStorage.propTypes = {
  fileNames: PropTypes.string
}
