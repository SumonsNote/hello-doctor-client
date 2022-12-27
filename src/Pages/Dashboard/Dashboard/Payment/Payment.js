import { useLoaderData, useNavigation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckOutForm from './CheckOutForm';
import Loading from '../../../Shared/Loading/Loading';

const stripePromise = loadStripe('pk_test_51L0kIdKwDMKTsXj5VVvXcwv36k9ByQs9iTSamUmm9yfdZRhzps59U832jKOh98uy50T2NWcp2A1xeCNA4wtV4MeD00HRoE1Vnl');


const Payment = () => {
    const booking = useLoaderData();
    const navigation = useNavigation();
    const { treatment, slot, appointmentDate, price } = booking;
    if (navigation.state === "loading") {
        return <Loading></Loading>
    }
    return (
        <div className='p-5 border'>
            <h2 className='text-3xl mb-4 border p-2'>Payment for {treatment}</h2>
            <p className='text-xl'>Please pay <strong>${price}</strong> for your appointment on <strong>{appointmentDate}</strong> at {slot}</p>

            <div className='w-96 my-6 p-4'>
                <Elements stripe={stripePromise}>
                    <CheckOutForm booking={booking} />
                </Elements>
            </div>
        </div>

    );
};

export default Payment;