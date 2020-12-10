import React from 'react';
import {  useState } from 'react';
import { Link } from 'react-router-dom';

const RuleForm = ({ addRule }) => {

    const [formData, setFormData] = useState({
        ruleName: '',
        class_names: '',
        minScores: 0,
        maxScores: 0,
        minCamLatitude: 0,
        maxCamLatitude: 0,
        minCamLongitude: 0,
        maxCamLongitude: 0,
        interval: 0,
        count: 0
      });
    
      const {
        ruleName,
        class_names,
        minScores,
        maxScores,
        minCamLatitude,
        maxCamLatitude,
        minCamLongitude,
        maxCamLongitude,
        interval,
        count,
      } = formData;
    
      const onChange = (e) =>
      setFormData({ ...formData, [e.target.name]: e.target.value });

  
  return (
    <div className='wrapper'>
    <h3>Add a new CEP rule</h3>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addRule(formData);
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
        <span>Minimum latitude:</span>
        <p>
          <input
            className='formInput'
            type='text'
            placeholder='Minimum latitude'
            name='minCamLatitude'
            value={minCamLatitude}
            onChange={onChange}
            required
          />
        </p>
      </div>
      <div className='form-group'>
        <span>Maximum latitude:</span>
        <p>
          <input
            className='formInput'
            type='text'
            placeholder='Maximum latitude'
            name='maxCamLatitude'
            value={maxCamLatitude}
            onChange={onChange}
            required
          />
        </p>
      </div>
      <div className='form-group'>
        <span>Minimum longitude:</span>
        <p>
          <input
            className='formInput'
            type='text'
            placeholder='Minimum longitude'
            name='minCamLongitude'
            value={minCamLongitude}
            onChange={onChange}
            required
          />
        </p>
      </div>
      <div className='form-group'>
        <span>Maximum longitude:</span>
        <p>
          <input
            className='formInput'
            type='text'
            placeholder='Maximum longitude'
            name='maxCamLongitude'
            value={maxCamLongitude}
            onChange={onChange}
            required
          />
        </p>
      </div>
      <div className='form-group'>
        <span>Time interval (days):</span>
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
  );
};

export default RuleForm;