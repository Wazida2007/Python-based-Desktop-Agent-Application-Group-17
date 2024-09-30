import React, { useState, useEffect } from 'react';

const TimezoneManagement = () => {
  const [time, setTime] = useState(new Date()); // Initialize with current time
  const [date, setDate] = useState('');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTimeForTimezone = async (timezone) => {
      try {
        const response = await fetch(
          `https://worldtimeapi.org/api/timezone/${timezone}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch time data: ${response.status}`);
        }
        const data = await response.json();
        const localTime = new Date(data.datetime);
        setTime(localTime);
        setDate(localTime.toLocaleDateString());
      } catch (err) {
        console.error('Error fetching time data:', err.message);
        setError(`Error fetching time data: ${err.message}`);
      }
    };

    // Fetch initial time
    fetchTimeForTimezone(timezone);

    // Update time every second
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime) {
          return new Date(prevTime.getTime() + 1000);
        }
        return new Date(); // Fallback in case prevTime is null
      });
    }, 1000);

    // Check for timezone changes every 5 seconds
    const timezoneCheckInterval = setInterval(() => {
      const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (currentTimezone !== timezone) {
        setTimezone(currentTimezone);
        fetchTimeForTimezone(currentTimezone);
        console.log(`Timezone changed to ${currentTimezone}`);
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
      clearInterval(timezoneCheckInterval);
    };
  }, [timezone]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">Local Time ({timezone})</h1>
        <p className="text-xl text-gray-600 mt-2">{date}</p>
        <p className="text-xl text-gray-600 mt-2">{time?.toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default TimezoneManagement;
