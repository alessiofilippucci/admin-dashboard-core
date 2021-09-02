import React from 'react';
import PropTypes from 'prop-types';

import './AnExample.css';

const AnExample = ({ name }) => (
  <div className="an-example">
   Welcome 2 &nbsp;
    { name }
  </div>
);

AnExample.propTypes = {
  name: PropTypes.string,
};

AnExample.defaultProps = {
  name: 'jaebaebae',
};

export default AnExample;
