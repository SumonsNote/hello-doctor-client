import React, { useState } from 'react';
import AppointmentBanner from '../AppointmentBanner/AppointmentBanner';
import AvailableAppointments from '../AvailableAppointments/AvailableAppointments';

const Appointment = () => {
    const [selected, setSelected] = useState(new Date())
    return (
        <div className='px-12'>
            <AppointmentBanner selected={selected} setSelected={setSelected}/>
            <AvailableAppointments selected={selected}/>
        </div>
    );
};

export default Appointment;