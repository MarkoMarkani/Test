import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import axios from 'axios';
import { Map, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import { get321Entities } from '../../actions/orion';
import Pagination from '../layout/Pagination';
export const icon = new Icon({
  iconUrl: '../../../videocamera.svg',
  iconSize: [25, 25],
});

const Face321 = ({ orion: { entities }, get321Entities }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entitiesPerPage] = useState(10);
  const [activeCamera, setActiveCamera] = React.useState(null);
  const [paramData, setParam] = useState({
    nameParam: '',
  });

  useEffect(() => {
    get321Entities();
  }, [get321Entities]);
  
  // const api = axios.create({
  //   baseURL: 'http://217.172.12.192:1026/v2/entities',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   resolveWithFullResponse: true,
  // });

  // const getCameraEntities = async () => {
  //   try {
  //     return await api.get('?options=keyValues&limit=1000&type=IP_Camera');
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // const cameraEntities = getCameraEntities().then((e) =>  e.data);
  //console.log(cameraEntities);


  const { nameParam } = paramData;
  const onChange = (e) =>
    setParam({ ...paramData, [e.target.name]: e.target.value });

    // const reversedEntities=entities.reverse();
    const indexOfLastEntity = currentPage * entitiesPerPage;
    const indexOfFirstEntity = indexOfLastEntity - entitiesPerPage;
    const currentEntities = entities.slice(indexOfFirstEntity, indexOfLastEntity);

    const paginate = pageNumber => setCurrentPage(pageNumber);

  // const uniqueValues = [
  //   ...new Set(
  //     entities.map(
  //       (entity) =>
  //         entity.deviceId + ' ' + entity.camLatitude + ' ' + entity.camLongitude
  //     )
  //   ),
  // ];
  //const uniqueValuesArray = uniqueValues.map((entity) => entity.split(' '));

  //console.log(uniqueValues);

 
  const entitiesWithMatchingName = nameParam
    ? entities.filter((entity) => entity.class_names === nameParam)
    : entities;
  console.log(entitiesWithMatchingName);

  const mappedEntities = (entity) => (
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
      </li>
    </ul>
  );

  const maps = (entity) => (
    <Fragment key={entity.id}>
      <Marker
        position={[entity.camLatitude, entity.camLongitude]}
        onClick={() => {
          setActiveCamera(entity);
        }}
        icon={icon}
      />
      <Polyline
        positions={[
          [
            entitiesWithMatchingName.slice(-5)[0].camLatitude,
            entitiesWithMatchingName.slice(-5)[0].camLongitude,
          ],
          [
            entitiesWithMatchingName.slice(-4)[0].camLatitude,
            entitiesWithMatchingName.slice(-4)[0].camLongitude,
          ],
          [
            entitiesWithMatchingName.slice(-3)[0].camLatitude,
            entitiesWithMatchingName.slice(-3)[0].camLongitude,
          ],
          [
            entitiesWithMatchingName.slice(-2)[0].camLatitude,
            entitiesWithMatchingName.slice(-2)[0].camLongitude,
          ],
          [
            entitiesWithMatchingName.slice(-1)[0].camLatitude,
            entitiesWithMatchingName.slice(-1)[0].camLongitude,
          ],
        ]}
        color={'red'}
        arrowheads={{ size: '300m', frequency: '1000m' }}
      />
    </Fragment>
  );

  return (
    <div className='wrapper'>
      <h3>321 maps</h3>
      <p>
        <label>
          Filter by the suspect
          <input
            className='search-box'
            type='text'
            name='nameParam'
            placeholder='Enter name'
            value={nameParam}
            onChange={onChange}
          />
        </label>
      </p>
      <Map center={[52.370216,4.895168]} zoom={12}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {!nameParam
          ? null//entities.map((entity) => maps(entity)) we will return this
          : entities
              .filter((entity) => entity.class_names === nameParam)
              .map((entity) => maps(entity))}
        {activeCamera && (
          <Popup
            position={[activeCamera.camLatitude, activeCamera.camLongitude]}
            onClose={() => {
              setActiveCamera(null);
            }}
          >
            <div>
              <Link to={`/camera/urn:ngsi-ld:IP_Camera:${activeCamera.deviceId}`}>
                Camera id : {'urn:ngsi-ld:IP_Camera:' + activeCamera.deviceId}
              </Link>
              <p>Camera latitude : {activeCamera.camLatitude}</p>
              <p>Camera longitude : {activeCamera.camLongitude}</p>
            </div>
          </Popup>
        )}
      </Map>
      <h3>Face Reco list</h3>
      <div>
        {!nameParam
          ? currentEntities.map((entity) => mappedEntities(entity))
          : currentEntities
              .filter((entity) => entity.class_names === nameParam)
              .map((entity) => mappedEntities(entity))}
      </div>
      <Pagination
        postsPerPage={entitiesPerPage}
        totalPosts={entities.length}
        paginate={paginate}
      />
    </div>
  );
};

Face321.propTypes = {
  get321Entities: PropTypes.func.isRequired,
  orion: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  orion: state.orion,
});

export default connect(mapStateToProps, { get321Entities })(Face321);
