import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import { listFiles } from '../files';
import { generateNewFile, generateTextFromObj } from '../helperFunctions/WriteHelpers';
import FilesTable from '../components/FilesTable';
import Previewer from '../components/Previewer';
import Editor from '../components/Editor';

import css from './style.module.css';

function PlaintextFilesChallenge() {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const files = listFiles();
    setFiles(files);
  }, []);

  // Function passed into Editor component which will write the file changes
  // made in the editor to the 'files' array which is local storage for
  // the files presented. If you only update the files array, when the page
  // reloads the changes will be erased as the files array is initialized to
  // the files created in Files.js. Would need to store the files persistently
  // somewhere to allow for changes to be saved after reloads. This function
  // would then need to update the stored files.

  function write(value) {
    if (value === null) {
      setEditMode(false);
      return;
    }

    let tempFiles = files;
    let tempActiveFile = activeFile;

    for (let i=0;i<files.length;i++) {
      if (tempFiles[i].name === tempActiveFile.name) {
        tempFiles[i] = generateNewFile(generateTextFromObj(value), tempFiles[i].name, tempFiles[i].type);;
        setActiveFile(tempFiles[i]);
        setFiles(tempFiles);
        break;
      }
    }
    setEditMode(false);
  }

  return (
    <div className={css.page}>
      <Head>
        <title>Rethink Engineering Challenge</title>
      </Head>
      <aside>
        <header>
          <div className={css.tagline}>Rethink Engineering Challenge</div>
          <h1>Seasoning Plaintext</h1>
          <div className={css.description}>
            Let{"'"}s have fun with files and JavaScript. What could be more fun
            than rendering and editing plaintext? Not much, as it turns out.
          </div>
        </header>

        <FilesTable
          files={files}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
        />

        <div style={{ flex: 1 }}></div>

        <footer>
          <div className={css.link}>
            <a href="https://v3.rethink.software/jobs">Rethink Software</a>
            &nbsp;—&nbsp;Frontend Engineering Challenge
          </div>
          <div className={css.link}>
            Questions? Feedback? Email us at jobs@rethink.software
          </div>
        </footer>
      </aside>

      <main className={css.editorWindow}>
        {activeFile ?
          (editMode ?
            (<Editor file={activeFile} write={write} />)
            : <Previewer file={activeFile} setEditMode={setEditMode}/>)
          : (<div className={css.empty}>Select a file to view or edit</div>)
        }
      </main>
    </div>
  );
}

export default PlaintextFilesChallenge;
