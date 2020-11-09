import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { get321Entities } from '../../actions/orion';

const Chart = ({ orion: { entities }, get321Entities }) => {
  useEffect(() => {
    get321Entities();
  }, [get321Entities]);

  const [chartData, setChartData] = useState({});

  const entityScores = entities.map((entity) => entity.scores);
  const entityNames = entities.map((entity) => entity.class_names);
  const entityTimeInstants = entities.map((entity) => entity.TimeInstant);
  const entityDeviceIds = entities.map((entity) => entity.deviceId);
console.log(entityDeviceIds+entityTimeInstants)
  
console.log("chart");

  const setCD = () => {
    setChartData({
      labels: entityNames,
      datasets: [
        {
          label: 'Entity scores by name',
          data: entityScores,
          backgroundColor: ['#FFFF66'],
          borderWidth: 4,
        },
      ],
    });
  };

  const setCD1 = () => {
    setChartData({
      labels: entityTimeInstants ,
      datasets: [
        {
          label: 'Entity scores by time',
          data: entityScores,
          backgroundColor: ['#3333FF'],
          borderWidth: 4,
        },
      ],
    });
  };
  const setCD2 = () => {
    setChartData({
      labels: entityDeviceIds ,
      datasets: [
        {
          label: 'Entity scores by device id',
          data: entityScores,
          backgroundColor: ['#FF9999'],
          borderWidth: 4,
        },
      ],
    });
  };

  const chartEntities = (
    <Fragment>
      <button className='btnPrimary' onClick={setCD}>Name Chart</button>
      <button className='btnPrimary' onClick={setCD1}>Time Chart</button>
      <button className='btnPrimary' onClick={setCD2}>Camera Chart</button>
      <Line
        data={chartData}
        options={{
          responsive: true,
          title: { text: 'ENTITIES SCALE', display: true },
          scales: {
            yAxes: [
              {
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 100,
                  beginAtZero: true,
                },
                gridLines: {
                  display: true,
                },
              },
            ],
            xAxes: [
              {
                gridLines: {
                  display: true,
                },
              },
            ],
          },
        }}
      />
    </Fragment>
  );

  return (
    <div >
      <h3>Charts</h3>
      {chartEntities}
    </div>
  );
};

Chart.propTypes = {
  get321Entities: PropTypes.func.isRequired,
  orion: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  orion: state.orion,
});

export default connect(mapStateToProps, { get321Entities })(Chart);
