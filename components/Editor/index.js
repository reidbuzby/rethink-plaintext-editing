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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      setValue(generateInitialValue(await file.text()));
    })();
  }, [file]);

  function handleClose() {
    setShowModal(false);
  }

  function discardChanges() {
    setShowModal(false);
    write(null);
  }

  function validateDiscard() {
    if (!edited) {
      write(null);
    }
    else {
      setShowModal(true);
    }
  }

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // const modal = (
  //   <Modal show={showModal} onHide={handleClose}>
  //     <Modal.Header closeButton>
  //       <Modal.Title>Discard Changes?</Modal.Title>
  //     </Modal.Header>
  //     <Modal.Footer>
  //       <button onClick={handleClose}>
  //         Close
  //       </button>
  //       <button onClick={discardChanges}>
  //         Discard Changes
  //       </button>
  //     </Modal.Footer>
  //   </Modal>
  // );

  // TODO - editor does not dynamically resize when text goes out of box at the bottom
  return (
    <div className={css.editor}>
      <div className={css.title}>
        {path.basename(file.name)}
        <div style={{ flex: 1 }}></div>
        <button className={css.discard} onClick={() => { write(null) }}>{'Discard'}</button>
        <button className={css.save} onClick={() => { write(value) }}>{'Save'}</button>
      </div>
      <div className={css.slateEditor}>
        <Slate editor={editor} value={value} onChange={(value) => {
            setValue(value);
            setEdited(true);
          }}>
          <Editable placeholder="Enter some plain text..." />
        </Slate>
      </div>
    </div>
  );

  // switch (file.type) {
  //   // Plaintext editor
  //   case 'text/plain':
  //     return textEditor;
  //
  //   // Markdown editor
  //   case 'text/markdown':
  //     return textEditor;
  //
  //   // JavaScript editor
  //   case 'text/javascript':
  //     return textEditor;
  //
  //   // JSON Editor
  //   case 'application/json':
  //     return textEditor;
  // }
}

Editor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default Editor;
