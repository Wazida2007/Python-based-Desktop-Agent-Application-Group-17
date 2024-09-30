import React, { useState } from 'react';
import axios from 'axios';

const Box = () => {
    const [time, setTime] = useState(0);

    const handleForm = (event) => {
        event.preventDefault();
        console.log(time)
        axios.post('http://127.0.0.1:8000/api', { time: time })
            .then(response => console.log(response))
            .catch(error => console.error(error));
    };

    return (
        <div>
            <form onSubmit={handleForm}>
                <input
                    type="number"
                    
                    onChange={(e) => setTime(e.target.valueAsNumber)}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Box;