import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from 'react-code-blocks';
import path from 'path';

import css from './style.css';

function Previewer({ file, setMode, deleteActiveFile }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    (async () => {
      setValue(await file.text());
    })();
  }, [file]);

  function preProcessDeleteFile() {
    if (confirm('Are you sure you want to delete this file?')) {
      deleteActiveFile();
    }
  }

  const fileName = path.basename(file.name);
  const editButton = (<button className={css.btn} onClick={() => { setMode('edit') }}>{'Edit'}</button>);
  const deleteButton = (<button className={css.delete} onClick={() => preProcessDeleteFile() }>{'Delete'}</button>);
  const titleBar = (
      <div className={css.title}>
        {fileName}
        <div style={{ flex: 1 }}></div>
        {deleteButton}
        {editButton}
      </div>
  );

  switch (file.type) {
    // Plaintext previewer
    case 'text/plain':
      return (
        <div className={css.preview}>
          {titleBar}
          <div className={css.content}>{value}</div>
        </div>
      );

    // Markdown previewer
    case 'text/markdown':
      return (
        <div className={css.preview}>
          {titleBar}
          <div className={css.content}>
            <ReactMarkdown source={value} />
          </div>
        </div>
      );

    // JavaScript previewer
    case 'text/javascript':
      return (
        <div className={css.preview}>
          {titleBar}
          <div className={css.content}>
            <CodeBlock
              text={value}
              language={'javascript'}
            />
          </div>
        </div>
      );

    // JSON previewer
    case 'application/json':
      return (
        <div className={css.preview}>
          {titleBar}
          <div className={css.content}>
            <CodeBlock
              text={value}
              language={'json'}
            />
          </div>
        </div>
      );
  }
}

Previewer.propTypes = {
  file: PropTypes.object,
  setMode: PropTypes.func,
  deleteActiveFile: PropTypes.func
};

export default Previewer;
