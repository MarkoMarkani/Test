import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Navbar = () => {
  const links = (
    <ul>
      <li>
        <Link to='/'>Entities</Link>
      </li>
      <li>
        <Link to='/'>Posts</Link>
      </li>
      <li>
        <Link to='/'>
          <i className='fas fa-user' />{' '}
          <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>
    </ul>
  );


  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-link' /> Connexions
        </Link>
      </h1>
      <Fragment>{links}</Fragment>
    </nav>
  );
};


const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(Navbar);