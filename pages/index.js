import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import path from 'path';
import classNames from 'classnames';

import { listFiles } from '../files';
import { generateNewFile, generateTextFromObj } from '../helperFunctions/writeHelpers';

// Used below, these need to be registered
import MarkdownEditor from '../components/MarkdownEditor';
import PlaintextEditor from '../components/PlaintextEditor';

import IconPlaintextSVG from '../public/icon-plaintext.svg';
import IconMarkdownSVG from '../public/icon-markdown.svg';
import IconJavaScriptSVG from '../public/icon-javascript.svg';
import IconJSONSVG from '../public/icon-json.svg';

import css from './style.module.css';

const TYPE_TO_ICON = {
  'text/plain': IconPlaintextSVG,
  'text/markdown': IconMarkdownSVG,
  'text/javascript': IconJavaScriptSVG,
  'application/json': IconJSONSVG
};

function FilesTable({ files, activeFile, setActiveFile }) {
  return (
    <div className={css.files}>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr
              key={file.name}
              className={classNames(
                css.row,
                activeFile && activeFile.name === file.name ? css.active : ''
              )}
              onClick={() => setActiveFile(file)}
            >
              <td className={css.file}>
                <div
                  className={css.icon}
                  dangerouslySetInnerHTML={{
                    __html: TYPE_TO_ICON[file.type]
                  }}
                ></div>
                {path.basename(file.name)}
              </td>

              <td>
                {new Date(file.lastModified).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

FilesTable.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  activeFile: PropTypes.object,
  setActiveFile: PropTypes.func
};

function Previewer({ file, setEditMode }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    (async () => {
      setValue(await file.text());
    })();
  }, [file]);

  return (
    <div className={css.preview}>
      <div className={css.title}>
        {path.basename(file.name)}
        <div style={{ flex: 1 }}></div>
        <button onClick={() => { setEditMode(true) }}>{'Edit'}</button>
      </div>
      <div className={css.content}>{value}</div>
    </div>
  );
}

Previewer.propTypes = {
  file: PropTypes.object,
  setEditMode: PropTypes.func
};

// Uncomment keys to register editors for media types
// There are currently only editors for .txt and .md files. Need to create
// new directories and components for .js and .json files
const REGISTERED_EDITORS = {
  "text/plain": PlaintextEditor
  // "text/markdown": MarkdownEditor,
};

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

  const Editor = activeFile ? REGISTERED_EDITORS[activeFile.type] : null;

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
