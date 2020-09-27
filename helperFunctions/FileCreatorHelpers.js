const fileTypes = ['text/plain', 'application/json', 'text/markdown', 'text/javascript'];

export function getFileTypes() {
  return fileTypes;
}

export function fileTypeToString(fileType) {
  switch (fileType) {
    case ('text/plain'):
      return 'Plaintext (.txt)';

    case ('application/json'):
      return 'JSON (.json)';

    case ('text/markdown'):
      return 'Markdown (.md)';

    case ('text/javascript'):
      return 'Javascript (.js)';
  }
}

export function fileTypeToExtension(fileType) {
  switch (fileType) {
    case ('text/plain'):
      return '.txt';

    case ('application/json'):
      return '.json';

    case ('text/markdown'):
      return '.md';

    case ('text/javascript'):
      return '.js';
  }
}
