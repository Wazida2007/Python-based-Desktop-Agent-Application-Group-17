import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import './admin.css';
import './client.css';
import EmployeeStatusBox from '../Utils/EmployeeStatusBox';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTime, setActiveTime] = useState(0);
  const [inactiveTime, setInactiveTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [developData, setDevelopData] = useState([]);
  const [inputTime, setInputTime] = useState(''); 
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [status, setStatus] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/')
      .then(response => {
        setDevelopData(response.data);
        calculateTotalDuration(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setSubmissionStatus('Error fetching data.');
      });

    axios.get('http://127.0.0.1:8000/timer')
      .then(response => {
        setStatus(response.data.timerRunning);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setSubmissionStatus('Error fetching data.');
      });
  }, [status, developData]);

  const calculateTotalDuration = (data) => {
    let active = 0;
    let inactive = 0;

    data.forEach((item) => {
      const durationParts = item.duration.split(':');
      const hours = parseInt(durationParts[0], 10);
      const minutes = parseInt(durationParts[1], 10);
      const secondsParts = durationParts[2].split('.');
      const seconds = parseInt(secondsParts[0], 10);

      const durationInSeconds = hours * 3600 + minutes * 60 + seconds;
      if (item.app_name === 'Unknown' || item.app_name === 'Start' || item.app_name === 'Search') {
        inactive += durationInSeconds;
      } else if (item.app_name === "Inactivity Warning") {
        inactive += 30;
        active -= 30;
      } else {
        active += durationInSeconds;
      }
    });
    setInactiveTime(inactive);
    setActiveTime(active);
    setTotalTime(active + inactive);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const indexOfLastItem = currentPage * 10;
  const indexOfFirstItem = indexOfLastItem - 10;
  const currentItems = developData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Updated handleScreenshotClick function
  const handleScreenshotClick = () => {
    axios.post('http://127.0.0.1:8000/screenshot-now') // Trigger screenshot
      .then(response => {
        setSubmissionStatus('Screenshot taken and uploaded successfully!');
        console.log('Screenshot response:', response.data); // Debug log
      })
      .catch(error => {
        console.error('Error taking screenshot:', error);
        setSubmissionStatus('Error taking screenshot.');
      });
  };

  return (
    <div className="container">
      {/* Total Time Card */}
      <div className="card total-time-card">
        <h3>Total Time Today</h3>
        <h2>{formatTime(totalTime)}</h2>
        <p>Active time: {formatTime(activeTime)}</p>
        <p>Inactive time: {formatTime(inactiveTime)}</p>
      </div>

      {/* Screenshot Button Card */}
      <div className="card screenshot-button-card text-center">
        <h3>Take Screenshot Now</h3>
        <button onClick={handleScreenshotClick}>Take Screenshot</button>
        {submissionStatus && <p>{submissionStatus}</p>}
      </div>

      {/* Admin Dashboard Image Card */}
      <div className="card admin-image-card">
        <h3 className='text-center'>Employee Activity Status</h3>
        <EmployeeStatusBox isActive={status} />
      </div>

      {/* Employee Activity Status Card */}
      <div className="card activity-status-card">
        <h3 className='text-center'>Activity Status</h3>
        <div className="table">
          <div className="header">
            <div className="cell">Start Time</div>
            <div className="cell">Duration</div>
            <div className="cell">App Name</div>
          </div>
          {currentItems.map((item, index) => (
            item.app_name !== "" ? (
              <div className="row" key={index}>
                <div className="cell">{item.start_time}</div>
                <div className="cell">{item.duration}</div>
                <div className="app-name">{item.app_name}</div>
              </div>
            ) : null
          ))}
        </div>
        <div className="pagination">
          {Array(Math.ceil(developData.length / 10)).fill(0).map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
