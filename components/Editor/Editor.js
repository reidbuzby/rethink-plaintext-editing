import React, { useState, useMemo, useEffect } from 'react';
import { Node, createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';

import path from 'path';

import { generateInitialValue } from '../../helperFunctions/EditorHelpers';
import css from './style.css';

function Editor({ file, write }) {
  const [value, setValue] = useState(generateInitialValue(''));
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    (async () => {
      setValue(generateInitialValue(await file.text()));
    })();
  }, [file]);

  function validateDiscard() {
    if (!edited) {
      write(null);
    }
    else {
      if(confirm("Are you sure you want to discard changes?")) {
        write(null);
      }
    }
  }

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <div className={css.editor}>
      <div className={css.title}>
        {path.basename(file.name)}
        <div style={{ flex: 1 }}></div>
        <button className={css.discard} onClick={() => { validateDiscard() }}>{'Discard'}</button>
        <button className={css.save} onClick={() => { write(value) }}>{'Save'}</button>
      </div>
      <div className={css.slateEditor}>
        <Slate editor={editor} value={value} onChange={(value) => {
            setValue(value);
            setEdited(true);
          }}>
          <Editable placeholder="Enter text..." />
        </Slate>
      </div>
    </div>
  );
}

Editor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default Editor;
