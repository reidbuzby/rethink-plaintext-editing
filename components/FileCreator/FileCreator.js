import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { fileNameTaken } from '../../helperFunctions/FileHandler';
import { getFileTypes, fileTypeToString, fileTypeToExtension } from '../../helperFunctions/FileCreatorHelpers';

import css from './style.css';

function FileCreator({ createNewFile }) {
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');

  const fileTypes = getFileTypes();

  function handleTypeChange(e) {
    setFileType(e.target.value);
  }

  function handleNameChange(e) {
    setFileName(e.target.value);
  }

  function preProcessNewFile() {
    const newFileName = fileName + fileTypeToExtension(fileType);
    if (fileNameTaken(newFileName)) {
      alert('The file: ' + newFileName + ' already exists. Please choose a different name.');
    }
    else {
      createNewFile(newFileName, fileType);
    }
  }

  function validateForm() {
    if (fileName !== '' && fileType !== '') {
      return false;
    }
    return true;
  }

  return (
    <div className={css.preview}>
      <div className={css.title}>
        New File
        <div style={{ flex: 1 }}></div>
        <button
          className={css.cancel}
          onClick={() => { createNewFile(null, null) }}>
          {'Cancel'}
        </button>
        <button
          className={css.create}
          disabled={ validateForm() }
          onClick={() => { preProcessNewFile() }}>
          {'Create File'}
        </button>
      </div>
      <div className={css.content}>
        <form>
          <label>
            File Name:
            <div style={{ flex: 1}}></div>
            <input type="text"
              placeholder={'ie. \'NewFile\''}
              value={ fileName }
              onChange={ handleNameChange }/>
          </label>
          <div style={{ flex: 1, height: '20px'}}></div>
          <label>
            File Type:
            <div style={{ flex: 1}}></div>
            <select value={ fileType } onChange={ handleTypeChange }>
              <option value={''}>--Select file type--</option>
              {fileTypes.map(fType => (
                <option key={fType} value={fType}>{fileTypeToString(fType)}</option>
              ))}
            </select>
          </label>
        </form>
      </div>
    </div>
  );
}

FileCreator.propTypes = {
  createNewFile: PropTypes.func
}

export default FileCreator;
