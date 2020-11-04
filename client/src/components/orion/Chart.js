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

  

  const setCD = () => {
    setChartData({
      labels: entityNames,
      datasets: [
        {
          label: 'Entity scores by name',
          data: entityScores,
          backgroundColor: ['rgba(46, 81, 181, 0.8)'],
          borderWidth: 4,
        },
      ],
    });
  };


  const chartEntities = (
    <Fragment>
      <button className='btnGrey' onClick={setCD}>Click to see the charts</button>
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
      <h3>Chart</h3>
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
