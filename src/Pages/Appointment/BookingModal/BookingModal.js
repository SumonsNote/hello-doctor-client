import { format } from 'date-fns/esm';
import React, { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthProvider';
import toast from 'react-hot-toast';


const BookingModal = ({ treatment, selected, setTreatment, refetch }) => {
    const { name, slots, price } = treatment;
    const date = format(selected, 'PP')
    const { user } = useContext(AuthContext)

    const handleSubmit = (e) => {
        e.preventDefault()
        const form = e.target;
        const slot = form.slot.value
        const name = form.name.value;
        const email = form.email.value;
        const phone = form.phone.value;

        const booking = {
            appointmentDate: date,
            treatment: treatment.name,
            name,
            slot,
            email,
            phone,
            price
        }

        fetch('https://doctors-portal-server-lime-three.vercel.app/bookings', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(booking)
        })
            .then(res => res.json())
            .then(data => {
                if (data.acknowledged) {
                    setTreatment(null)
                    toast.success('Booking Confirmed')
                    refetch()
                }
                else {
                    toast.error(data.message);
                }
            })
    }
    return (
        <div>
            <input type="checkbox" id="bookingModal" className="modal-toggle" />
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <label htmlFor="bookingModal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="font-bold text-lg">{name}</h3>
                    <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-3 mt-10'>
                        <input type="text" value={date} disabled className="input input-bordered w-full" />
                        <select name='slot' className="select select-bordered w-full">
                            {
                                slots.map((slot, index) => <option value={slot} key={index}>{slot}</option>)
                            }
                        </select>
                        <input required name='name' defaultValue={user?.displayName} disabled placeholder='Your Name' type="text" className="input input-bordered w-full" />
                        <input required name='email' defaultValue={user?.email} disabled placeholder='Your Email' type="email" className="input input-bordered w-full" />
                        <input  name='phone' placeholder='Your Number' type="text" className="input input-bordered w-full" />
                        <input type="submit" value='Submit' className="uppercase input input-bordered w-full btn-accent cursor-pointer" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;