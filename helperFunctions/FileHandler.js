import { listFiles } from './HardcodedFiles';
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
