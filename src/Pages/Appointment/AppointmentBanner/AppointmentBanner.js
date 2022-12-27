import React from 'react';
import chiar from '../../../assets/images/chair.png'
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const AppointmentBanner = ({selected, setSelected}) => {
    return (
        <div className="hero ">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <img src={chiar} alt='' className="max-w-sm rounded-lg shadow-2xl" />
                <div className='mr-6'>
                    <DayPicker mode="single" selected={selected} onSelect={setSelected} />
                </div>
            </div>
        </div>
    );
};

export default AppointmentBanner;