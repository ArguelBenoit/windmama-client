import React from 'react';
import PropTypes from 'prop-types';
import { Actions } from '../store/actions.js';
import { Link } from 'react-router-dom';
import './css/header.css';

function Header(props) {
  return <div>
    <div id="header" className="elements-ui-absolute">
      <div className={props.leftActive ? 'container-left-menu button clicked' : 'container-left-menu button'} onClick={() => Actions.leftActivation()}>
        <i className="fas fa-angle-left" aria-hidden="true" />
      </div>
      <Link to="/" style={{color: '#fff'}}>
        <h1>
          WindMama.fr
        </h1>
      </Link>
      <div className={props.rightActive ? 'container-right-menu button clicked' : 'container-right-menu button'} onClick={() => Actions.rightActivation()}>
        <div/>
        <div/>
      </div>
    </div>
    <div style={{width: '100%', height: '60px'}} />
  </div>;
}

Header.propTypes = {
  leftActive: PropTypes.bool,
  rightActive: PropTypes.bool
};

export default Header;
