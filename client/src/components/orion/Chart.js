import React, { useEffect, useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Line, Doughnut, Pie } from 'react-chartjs-2'
import { chartColors } from '../../colors.js'
import { get321Entities } from '../../actions/orion'

const Chart = ({ orion: { entities }, get321Entities }) => {
  useEffect(() => {
    get321Entities()
  }, [get321Entities])

  const [chartData, setChartData] = useState({})

  const entityScores = entities.map((entity) => entity.scores)
  const entityNames = entities.map((entity) => entity.class_names)
  const entityTimeInstants = entities.map((entity) => entity.TimeInstant)
  const entityDeviceIds = entities.map((entity) => entity.deviceId)
  const uniqueDeviceIds = [
    ...new Set(entities.map((entity) => entity.deviceId)),
  ]
  const uniqueScores = [
    ...new Set(
      entities.map((entity) => `${parseInt(entity.scores)},${entity.deviceId}`)
    ),
  ]
  const uniqueScoresAndDeviceIds = uniqueScores.map((sd) => sd.split(','))

  //console.log(entities);

  // const sum = times.reduce((a, b) => a + b, 0);
  // const avg = (sum / times.length) || 0;
  // console.log(`The sum is: ${sum}. The average is: ${avg}.`);

  const pieOptions = {
    legend: {
      display: true,
      position: 'right',
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  }

  const pieData = {
    maintainAspectRatio: false,
    responsive: true,
    labels: uniqueDeviceIds,
    datasets: [
      {
        data: [2, 3, 4, 6, 7, 8, 9, 5, 9],
        backgroundColor: chartColors,
        hoverBackgroundColor: 'grey',
      },
    ],
  }

  const setCD = () => {
    setChartData({
      labels: entityNames,
      datasets: [
        {
          label: 'Entity scores by name',
          data: entityScores,
          fill: true,
          //backgroundColor: ['black'],
          borderWidth: 0,
          borderColor: 'black',
        },
      ],
    })
  }

  const setCD1 = () => {
    setChartData({
      labels: entityTimeInstants,
      datasets: [
        {
          label: 'Entity scores by time',
          data: entityScores,
          //backgroundColor: ['black'],
          borderWidth: 0,
          borderColor: 'black',
        },
      ],
    })
  }
  const setCD2 = () => {
    setChartData({
      labels: entityDeviceIds,
      datasets: [
        {
          label: 'Entity scores by device id',
          data: entityScores,
          // backgroundColor: ['black'],
          borderWidth: 0,
          borderColor: 'black',
        },
      ],
    })
  }

  const legend = {
    display: true,
    position: 'top',
    labels: {
      fontColor: 'black',
      fontSize: 20,
    },
  }

  const options = {
    responsive: true,
    title: { text: 'ENTITIES SCALE', display: false },
    scales: {
      yAxes: [
        {
          ticks: {
            autoSkip: false,
            maxTicksLimit: 100,
            beginAtZero: false,
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
  }
  const chartEntities = (
    <Fragment>
      <button className='btnPrimary' onClick={setCD}>
        Name Chart
      </button>
      <button className='btnPrimary' onClick={setCD1}>
        Time Chart
      </button>
      <button className='btnPrimary' onClick={setCD2}>
        Camera Chart
      </button>
      <Line data={chartData} legend={legend} options={options} />

      {/* <Pie data={pieData} options={pieOptions} /> */}
    </Fragment>
  )

  return (
    <div className='charts'>
      <h3>Charts</h3>
      {chartEntities}
    </div>
  )
}

Chart.propTypes = {
  get321Entities: PropTypes.func.isRequired,
  orion: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  orion: state.orion,
})

export default connect(mapStateToProps, { get321Entities })(Chart)
