import { format } from 'date-fns/esm';
import { useState } from 'react';
import AppointmentOptions from './AppointmentOptions';
import BookingModal from '../BookingModal/BookingModal';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../Shared/Loading/Loading';

const AvailableAppointments = ({ selected }) => {
    const [treatment, setTreatment] = useState(null)
    const date = format(selected, 'PP')

    const { data: appointmentOptions = [], refetch, isLoading } = useQuery({
        queryKey: ['appointmentOptions', date],
        queryFn: async () => {
            const res = await fetch(`https://doctors-portal-server-lime-three.vercel.app/appointmentOptions?date=${date}`)
            const data = await res.json()
            return data;
        }
    })

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className='my-16'>
            <h2 className='text-2xl text-secondary text-center font-bold'>Available Appointments:  {format(selected, 'PP')}.</h2>
            <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6'>
                {
                    appointmentOptions.map(option => <AppointmentOptions
                        key={option._id}
                        appointmentOption={option}
                        setTreatment={setTreatment} />)
                }
            </div>
            {treatment && <BookingModal
                treatment={treatment}
                selected={selected}
                setTreatment={setTreatment}
                refetch={refetch} />}
        </div>
    );
};

export default AvailableAppointments;