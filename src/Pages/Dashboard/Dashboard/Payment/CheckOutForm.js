import React, { useEffect, useState } from 'react';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'

const CheckOutForm = ({ booking }) => {

    const [cardError, setCardError] = useState('')
    const [cardSuccess, setcardSuccess] = useState('')
    const [transactionId, setTransactionId] = useState('')
    const [processing, setProcessing] = useState(false);
    const stripe = useStripe();
    const elements = useElements()
    const { price, email, patient, _id } = booking;

    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        fetch("https://doctors-portal-server-lime-three.vercel.app/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ price })

        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, [price]);

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!stripe || !elements) {
            return
        }

        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            console.log(error);
            setCardError(error.message)
        }
        else {
            setCardError('')
        }
        setcardSuccess('')
        setProcessing(true)

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: patient,
                        email: email
                    },
                },
            },
        );

        if (confirmError) {
            setCardError(confirmError.message)
            return
        }

        const payment = {
            price,
            transactionId: paymentIntent.id,
            email,
            bookingId: _id
        }
        if (paymentIntent.status === 'succeeded') {
            console.log('card info', card)

            fetch('https://doctors-portal-server-lime-three.vercel.app/payments', {
                method: 'post',
                headers: {
                    'content-type': 'application/json',
                    authorization: `bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(payment)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.insertedId) {
                        setcardSuccess('Congrats! your payment completed')
                        setTransactionId(paymentIntent.id)
                    }
                })
        }
        setProcessing(false)
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
                <button
                    className='btn btn-primary btn-sm mt-3 text-white'
                    type="submit" disabled={!stripe || !clientSecret || processing}>
                    Pay
                </button>
            </form>
            <p className="text-xl text-red-600">{cardError}</p>
            {
                cardSuccess &&
                <div>
                    <p className='text-green-600'>{cardSuccess}</p>
                    <p>Your transaction ID: <span className='font-bold'>{transactionId}</span></p>
                </div>
            }
        </div>
    );
};

export default CheckOutForm;