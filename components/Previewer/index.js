import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from 'react-code-blocks';
import path from 'path';

import css from './style.css';

function Previewer({ file, setEditMode }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    (async () => {
      setValue(await file.text());
    })();
  }, [file]);

  const editButton = (<button onClick={() => { setEditMode(true) }}>{'Edit'}</button>);
  const fileName = path.basename(file.name);

  switch (file.type) {
    // Plaintext previewer
    case 'text/plain':
      return (
        <div className={css.preview}>
          <div className={css.title}>
            {fileName}
            <div style={{ flex: 1 }}></div>
            {editButton}
          </div>
          <div className={css.content}>{value}</div>
        </div>
      );

    // Markdown previewer
    case 'text/markdown':
      return (
        <div className={css.preview}>
          <div className={css.title}>
            {fileName}
            <div style={{ flex: 1 }}></div>
            {editButton}
          </div>
          <div className={css.content}>
            <ReactMarkdown source={value} />
          </div>
        </div>
      );

    // JavaScript previewer
    case 'text/javascript':
      return (
        <div className={css.preview}>
          <div className={css.title}>
            {fileName}
            <div style={{ flex: 1 }}></div>
            {editButton}
          </div>
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
          <div className={css.title}>
            {fileName}
            <div style={{ flex: 1 }}></div>
            {editButton}
          </div>
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
  setEditMode: PropTypes.func
};

export default Previewer;
