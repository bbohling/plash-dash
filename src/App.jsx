import { useState, useEffect } from 'react';
import { Row, Col, Progress } from 'antd';

import './App.css';

function App() {
  const [yearlyData, setYearlyData] = useState();
  const [progressData, setProgressData] = useState();

  function calculatePercentage(data, dataPoint) {
    return Math.round(
      (data.thisYear[dataPoint] / data.lastYear[dataPoint]) * 100
    );
  }

  async function fetchData(reportType) {
    return (
      await fetch(
        `https://bbi.brndn.me/v1/reports/cycling/${reportType}/brandon`
      )
    ).json();
  }

  useEffect(() => {
    (async () => {
      const progress = await fetchData('progress');
      setProgressData(progress);
      const yearly = await fetchData('yearly');
      setYearlyData(yearly);
    })();
    return () => {};
  }, []);

  const days = progressData
    ? calculatePercentage(progressData.data, 'daysRidden')
    : 0;
  const miles = progressData
    ? calculatePercentage(progressData.data, 'miles')
    : 0;
  const hours = progressData
    ? calculatePercentage(progressData.data, 'movingTimeMinutes')
    : 0;
  const climbing = progressData
    ? calculatePercentage(progressData.data, 'climbing')
    : 0;

  function getProgressColor(percentDone) {
    let color = 'rgb(220, 53, 69)';
    if (percentDone > 75) {
      color = 'rgb(255,193,7)';
    }
    if (percentDone >= 100) {
      color = 'rgb(25, 135, 84)';
    }
    return color;
  }

  return (
    <footer>
      {progressData && (
        <Row justify='start' gutter={16}>
          <Col>
            <Progress
              width={134}
              type='circle'
              strokeColor={getProgressColor(days)}
              percent={days}
              format={() => (
                <>
                  <span className='metricValue'>
                    {progressData.data.thisYear.daysRidden}
                  </span>
                  <br />
                  <span className='metric'>days</span>
                </>
              )}
            />
          </Col>
          <Col>
            <Progress
              width={134}
              type='circle'
              strokeColor={getProgressColor(miles)}
              percent={miles}
              format={() => (
                <>
                  <span className='metricValue'>
                    {progressData.data.thisYear.miles}
                  </span>
                  <br />
                  <span className='metric'>miles</span>
                </>
              )}
            />
          </Col>
          <Col>
            <Progress
              width={134}
              type='circle'
              strokeColor={getProgressColor(hours)}
              percent={hours}
              format={() => (
                <>
                  <span className='metricValue'>
                    {Math.round(
                      progressData.data.thisYear.movingTimeMinutes / 60
                    )}
                  </span>
                  <br />
                  <span className='metric'>hours</span>
                </>
              )}
            />
          </Col>
          <Col>
            <Progress
              width={134}
              type='circle'
              strokeColor={getProgressColor(climbing)}
              percent={climbing}
              format={() => (
                <>
                  <span className='metricValue'>
                    {progressData.data.thisYear.climbing.toLocaleString(
                      'en-us'
                    )}
                  </span>
                  <br />
                  <span className='metric'>climbing</span>
                </>
              )}
            />
          </Col>
        </Row>
      )}
    </footer>
  );
}

export default App;
