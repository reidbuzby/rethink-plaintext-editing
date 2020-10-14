import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import { getFiles, postFile, deleteFile } from '../helperFunctions/FileHandler';
import { updateFiles } from '../helperFunctions/WriteHelpers';
import FilesTable from '../components/FilesTable/FilesTable';
import Previewer from '../components/Previewer/Previewer';
import Editor from '../components/Editor/Editor';
import FileCreator from '../components/FileCreator/FileCreator';
import css from './style.module.css';

function PlaintextFilesChallenge() {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [mode, setMode] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    const fetchedFiles = await getFiles();
    setFiles(fetchedFiles);
  }

  function preProcessSetActiveFile(value) {
    if (mode === 'edit') {
      alert("Save or discard changes to current file");
    }
    else {
      setActiveFile(value);
      setMode('view');
    }
  }

  function deleteActiveFile() {
    setActiveFile(null);
    deleteFile(activeFile);
    getFiles().then((result) => {
      if (result) {
        setFiles(result);
        setMode('view');
      }
    });
  }

  function createNewFile(fileName, fileType) {
    if (fileName === null && fileType === null) {
      setMode(null);
      setActiveFile(null);
    }
    else {
      const newFile = postFile(fileName, fileType);
      getFiles().then((result) => {
        if (result) {
          setFiles(result);
          setActiveFile(newFile);
          setMode('edit');
        }
      });
    }
  }

  function write(value) {
    if (value === null) {
      setMode('view');
      return;
    }
    updateFiles(value, activeFile, setFiles, setActiveFile, setMode);
  }

  const editor = (<Editor file={activeFile} write={write} />);
  const previewer = (<Previewer file={activeFile} deleteActiveFile={deleteActiveFile} setMode={setMode}/>);
  const defaultView = (<div className={css.empty}>Select a file to view or edit</div>);
  const fileCreator = (<FileCreator createNewFile={createNewFile}/>);

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

        <div className={css.newFile}>
          <button className={css.btn} onClick={() => {
            setMode('create');
            setActiveFile(null);
          }}>New file</button>
        </div>

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

      <main className={css.contentWindow}>
        {activeFile ?
          mode === 'edit' ?
            editor
          : mode === 'view' ?
            previewer
          : defaultView
        : mode === 'create' ?
          fileCreator
          : defaultView
        }
      </main>
    </div>
  );
}

export default PlaintextFilesChallenge;
