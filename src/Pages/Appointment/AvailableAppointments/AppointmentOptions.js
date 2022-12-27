import React from 'react';

const AppointmentOptions = ({ appointmentOption, setTreatment }) => {
    const { name, slots, price } = appointmentOption
    return (
        <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="text-2xl text-center font-bold text-secondary">{name}</h2>
                <p>{slots.length > 0 ? slots[0] : 'Try another day'}</p>
                <p>{slots.length} {slots.length > 1 ? 'spaces' : 'space'} available</p>
                <small>Price: ${price}</small>
                <div className="card-actions justify-center">
                    <label disabled={slots.length === 0} onClick={() => setTreatment(appointmentOption)} htmlFor="bookingModal" className="btn btn-primary text-white">Book Appointment</label>
                </div>
            </div>
        </div>
    );
};

export default AppointmentOptions;