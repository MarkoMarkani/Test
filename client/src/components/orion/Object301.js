import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get301Entities } from '../../actions/orion';
import Pagination from '../layout/Pagination';

const Object301 = ({ orion: { entities }, get301Entities }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entitiesPerPage] = useState(10);
 
  useEffect(() => {
    get301Entities();
  }, [get301Entities]);

  // const reversedEntities=entities.reverse();
  const indexOfLastEntity = currentPage * entitiesPerPage;
  const indexOfFirstEntity = indexOfLastEntity - entitiesPerPage;
  const currentEntities = entities.slice(indexOfFirstEntity, indexOfLastEntity);

  const paginate = pageNumber => setCurrentPage(pageNumber);


 // console.log(entities);
  return (
    <div className='wrapper'>
      <h3>Object Detect list</h3>
      <div>
        {currentEntities.map((entity) => (
          <ul className='entityList' key={entity.id}>
            <li>
              <p><span>Id</span>: {entity.id}</p>
              <p><span>Type</span>: {entity.type}</p>
              <p><span>Time Instant</span>: {entity.TimeInstant}</p>
              {/* <p><span>Attach Desc</span>: {entity.attachDesc}</p> */}
              <p><span>Cam Latitude</span>: {entity.camLatitude}</p>
              <p><span>Cam Longitude</span>: {entity.camLongitude}</p>
              <p><span>Class Names</span>: {entity.class_names}</p>
              <p><span>Description</span>: {entity.description}</p>
              <p><span>Device Id</span>: {entity.deviceId}</p>
              <p><span>Object Store Id</span>: {entity.objectStoreId}</p>
              <p><span>Scores</span>: {entity.scores}</p>
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
  );
};

Object301.propTypes = {
  get301Entities: PropTypes.func.isRequired,
  orion: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  orion: state.orion,
});

export default connect(mapStateToProps, { get301Entities })(Object301);
