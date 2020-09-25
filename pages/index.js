import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import { getFiles } from '../helperFunctions/FileHandler';
import { updateFiles } from '../helperFunctions/WriteHelpers';
import FilesTable from '../components/FilesTable/FilesTable';
import Previewer from '../components/Previewer/Previewer';
import Editor from '../components/Editor/Editor';

import css from './style.module.css';

function PlaintextFilesChallenge() {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    getFiles().then((result) => {
      if (result) {
        setFiles(result);
      }
      else {
        setFiles([]);
      }
    });
  }, []);

  function preProcessSetActiveFile(value) {
    if (editMode) {
      alert("Save or discard changes to current file");
    }
    else {
      setActiveFile(value);
    }
  }

  function write(value) {
    if (value === null) {
      setEditMode(false);
      return;
    }
    updateFiles(value, activeFile, setFiles, setActiveFile, setEditMode);
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
          setActiveFile={preProcessSetActiveFile}
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
