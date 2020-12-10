import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import axios from 'axios';
import { addFirstRule } from '../../actions/perseo';
import { setAlert } from '../../actions/alert';

const AddRule = ({ perseo: { rules }, addFirstRule, setAlert }) => {
  const [formData, setFormData] = useState({
    ruleName: '',
    class_names: '',
    minScores: 0,
    maxScores: 0,
    interval: 0,
    count: 0
  });

  const {
    ruleName,
    class_names,
    minScores,
    maxScores,
    interval,
    count,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <div className='wrapper'>
        <h3>Add a new CEP rule</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addFirstRule(formData);
            // setAlert('Error! Rule with this name has already been added', 'danger');
            // setFormData({
            //   ruleName: '',
            //   class_names: '',
            //   minScores: 0,
            //   maxScores: 0,
            //   interval: 0,
            //   count: 0,
            // });
          }}
        >
          <div className='form-group'>
            <span>Rule name:</span>
            <p>
              <input
                className='formInput'
                type='text'
                placeholder='* Rule name'
                name='ruleName'
                value={ruleName}
                onChange={onChange}
                required
              />
            </p>
          </div>
          <div className='form-group'>
            <span>Suspect name:</span>
            <p>
              <input
                className='formInput'
                type='text'
                placeholder='* Suspect name'
                name='class_names'
                value={class_names}
                onChange={onChange}
                required
              />
            </p>
          </div>
          <div className='form-group'>
            <span>Minimum percentage:</span>
            <p>
              <input
                className='formInput'
                type='text'
                placeholder='Minimum percentage'
                name='minScores'
                value={minScores}
                onChange={onChange}
                required
              />
            </p>
          </div>
          <div className='form-group'>
            <span>Maximum percentage:</span>
            <p>
              <input
                className='formInput'
                type='text'
                placeholder='Maximum percentage'
                name='maxScores'
                value={maxScores}
                onChange={onChange}
                required
              />
            </p>
          </div>
          <div className='form-group'>
            <span>Time interval (minutes):</span>
            <p>
              <input
                className='formInput'
                type='text'
                placeholder='Time interval'
                name='interval'
                value={interval}
                onChange={onChange}
                required
              />
            </p>
          </div>
          <div className='form-group'>
            <span>Count:</span>
            <p>
              <input
                className='formInput'
                type='text'
                placeholder='Count'
                name='count'
                value={count}
                onChange={onChange}
                required
              />
            </p>
          </div>
          <p className='formEnd'>
            <button type='submit' className='btnPrimary'>
              Submit{' '}
            </button>
            <Link to='/'>{'    '} Go Back</Link>
          </p>
        </form>
      </div>
    </Fragment>
  );
};

AddRule.propTypes = {
  addFirstRule: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  perseo: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  perseo: state.perseo,
});

export default connect(mapStateToProps, { addFirstRule, setAlert })(AddRule);
