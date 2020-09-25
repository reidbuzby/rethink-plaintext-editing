import PropTypes from 'prop-types';

// returns a new File object
export function generateNewFile(text, fileName, type) {
  return new File(
    [text],
    fileName,
    {
      type: type,
      lastModified: new Date()
    }
  );
}

generateNewFile.propTypes = {
  text: PropTypes.string,
  fileName: PropTypes.string,
  type: PropTypes.string
};

// returns a string representing the text body of the given object
export function generateTextFromObj(object) {
  let text = '';
  for (let i=0;i<object.length;i++) {
    let child = object[i].children[0].text;
    if (i<object.length-1) {
      text += child + "\n";
    }
    else {
      text += child;
    }

  }
  return text;
}

generateTextFromObj.propTypes = {
  object: PropTypes.object
}
