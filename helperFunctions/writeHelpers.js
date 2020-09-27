import PropTypes from 'prop-types';
import { getFiles, getFileJSON, putFile } from './FileHandler';

// returns a new File object
export function generateNewFile(text, fileName, type) {
  return new File(
    [text],
    fileName,
    {
      type: type,
      lastModified: new Date()
    }
  );
}

generateNewFile.propTypes = {
  text: PropTypes.string,
  fileName: PropTypes.string,
  type: PropTypes.string
};

// void, updates the file states of pages/index.js by calling inherited functions
export function updateFiles(value, activeFile, setFiles, setActiveFile, setMode) {
  const oldFile = getFileJSON(activeFile.name);
  const newFileJSON = {
    text: generateTextFromObj(value),
    name: oldFile.name,
    date: new Date(),
    type: oldFile.type
  }
  const newFileObj = generateNewFile(generateTextFromObj(value), oldFile.name, oldFile.type);
  putFile(newFileJSON);

  getFiles().then((result) => {
    if (result) {
      setFiles(result);
      setActiveFile(newFileObj);
    }
    else {
      setFiles([]);
    }
    setMode('view');
  });
}

updateFiles.propTypes = {
  value: PropTypes.object,
  activeFile: PropTypes.object,
  setFiles: PropTypes.func,
  setActiveFile: PropTypes.func,
  setMode: PropTypes.func
};

// returns a string representing the text body of the given object
export function generateTextFromObj(object) {
  let text = '';
  for (let i=0;i<object.length;i++) {
    let child = object[i].children[0].text;
    if (i<object.length-1) {
      text += child + "\n";
    }
    else {
      text += child;
    }

  }
  return text;
}

generateTextFromObj.propTypes = {
  object: PropTypes.object
}
