import PropTypes from 'prop-types';

// returns an object with the text body containing the given value string
export function generateInitialValue(value) {
  return [
    {
      children: [
        { text: value },
      ],
    },
  ]
}

generateInitialValue.propTypes = {
  object: PropTypes.string
}
