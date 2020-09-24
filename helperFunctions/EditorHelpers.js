import PropTypes from 'prop-types';

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
