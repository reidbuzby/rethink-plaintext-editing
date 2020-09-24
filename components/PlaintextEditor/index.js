import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import { Node, createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';

import css from './style.css';

function PlaintextEditor({ file, write }) {
  const [value, setValue] = useState(generateInitialValue(''));

  useEffect(() => {
    (async () => {
      setValue(generateInitialValue(await file.text()));
    })();
  }, [file]);

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  return (
    <div className={css.editor}>
      <div className={css.title}>
        {path.basename(file.name)}
        <div style={{ flex: 1 }}></div>
        <button className={css.discard} onClick={() => { write(null) }}>{'Discard'}</button>
        <button className={css.save} onClick={() => { write(value) }}>{'Save'}</button>
      </div>
      <div className={css.slateEditor}>
        <Slate editor={editor} value={value} onChange={value => setValue(value)}>
          <Editable placeholder="Enter some plain text..." />
        </Slate>
      </div>
    </div>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

function generateInitialValue(value) {
  return [
    {
      children: [
        { text: value },
      ],
    },
  ]
}

export default PlaintextEditor;
