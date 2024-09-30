import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BatteryStatus = () => {
    const [batteryStatus, setBatteryStatus] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBatteryStatus = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/battery_status');
                setBatteryStatus(response.data);
            } catch (err) {
                setError('Error fetching battery status.');
            }
        };

        fetchBatteryStatus();
        const intervalId = setInterval(fetchBatteryStatus, 600); // Fetch every minute

        return () => clearInterval(intervalId);
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="battery-card my-7">
            <h3 className='text-center'>Battery Status</h3>
            <p >Battery Level: {batteryStatus.battery_level}%</p>
            <b className={batteryStatus.charging ? "text-green-500" : "text-red-500"}>
                {batteryStatus.charging ? 'Charging' : 'Not Charging'}
            </b>
            {batteryStatus.warning && (
                <p className="text-red-500">Warning: Battery level is below 20%!</p>
            )}
        </div>
    );
};

export default BatteryStatus;
