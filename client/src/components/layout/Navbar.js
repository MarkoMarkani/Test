import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Navbar = () => {
  const toggleScreen = (e) => {
   console.log("Hello amigos");
  };

  return (
    <Fragment>
      <div className='d-flex' id='wrapper'>
        <div className='bg-dark border-right' id='sidebar-wrapper'>
          <div className='sidebar-heading'> Select action </div>
          <div className='list-group list-group-flush'>
            <Link to='#' className='list-group-item list-group-item-action bg-dark'>
              Rules overview
            </Link>
            <Link to='#' className='list-group-item list-group-item-action bg-dark'>
              Rules history
            </Link>
            <Link to='#' className='list-group-item list-group-item-action bg-dark'>
              Topics
            </Link>
            <Link to='#' className='list-group-item list-group-item-action bg-dark'>
              Maps
            </Link>
            <Link to='#' className='list-group-item list-group-item-action bg-dark'>
              Status
            </Link>
          </div>
        </div>
        <div id='page-content-wrapper'>
          <nav className='navbar navbar-expand-lg navbar-dark bg-dark border-bottom'>
            <i className='navbar-toggler-icon' id='menu-toggle' onClick={toggleScreen}></i>
            <h2 className='title'> Connexions </h2>
          </nav>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Navbar);
