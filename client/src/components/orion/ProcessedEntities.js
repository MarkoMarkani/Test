import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProcessed321Entities } from '../../actions/orion';
import Pagination from '../layout/Pagination';
import { Fragment } from 'react';
import Spinner from '../layout/Spinner';
//import ReactPaginate from 'react-paginate';

const Entities = ({ orion: { entities, loading }, getProcessed321Entities }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entitiesPerPage] = useState(10);

  useEffect(() => {
    getProcessed321Entities();
  }, [getProcessed321Entities]);
  
  console.log(entities[0]);
  // const reversedEntities=entities.reverse();
  // console.log(reversedEntities[0]);

  const indexOfLastEntity = currentPage * entitiesPerPage;
  const indexOfFirstEntity = indexOfLastEntity - entitiesPerPage;
  const currentEntities = entities.slice(indexOfFirstEntity, indexOfLastEntity);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <Fragment>
      {loading?
      (<Spinner/>):
    <div className='wrapper'>
      <h3>Processed entities by the CEP</h3>
      <div>
        {currentEntities.map((entity) => (
          <ul className='entityList' key={entity.id}>
            <li>
              <p>
                <span>Id</span>: {entity.id}
              </p>
              <p>
                <span>Type</span>: {entity.type}
              </p>
              <p>
                <span>Time Instant</span>: {entity.TimeInstant}
              </p>
              {/* <p><span>Attach Desc</span>: {entity.attachDesc}</p> */}
              <p>
                <span>Cam Latitude</span>: {entity.camLatitude}
              </p>
              <p>
                <span>Cam Longitude</span>: {entity.camLongitude}
              </p>
              <p>
                <span>Class Names</span>: {entity.class_names}
              </p>
              <p>
                <span>Description</span>: {entity.description}
              </p>
              <p>
                <span>Device Id</span>: {entity.deviceId}
              </p>
              <p>
                <span>Object Store Id</span>: {entity.objectStoreId}
              </p>
              <p>
                <span>Scores</span>: {entity.scores}
              </p>
              <p>
                <span>Count</span>: {entity.count}
              </p>
              <p>
                <span>Rule Name</span>: {entity.ruleName}
              </p>
              {/* <p><span>Suspect description</span>: {entity.suspect_description}</p> */}
            </li>
          </ul>
        ))}
      </div>
      <Pagination
        postsPerPage={entitiesPerPage}
        totalPosts={entities.length}
        paginate={paginate}
      />
    </div>
}</Fragment>
  );
};

Entities.propTypes = {
  getProcessed321Entities: PropTypes.func.isRequired,
  orion: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  orion: state.orion,
});

export default connect(mapStateToProps, { getProcessed321Entities })(Entities);
