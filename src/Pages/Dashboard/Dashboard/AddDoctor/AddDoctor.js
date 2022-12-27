import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import Loading from '../../../Shared/Loading/Loading';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddDoctor = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const imgHostKey = process.env.REACT_APP_IMGBB

    const { data: specialities, isLoading } = useQuery({
        queryKey: ['speciality'],
        queryFn: async () => {
            const res = await fetch('https://doctors-portal-server-lime-three.vercel.app/appointmentSpeciality');
            const data = await res.json()
            return data;
        }
    })

    const navigate = useNavigate('')

    if(isLoading){
        return <Loading/>
    }

    const handleAddDoctor = data => {
        const image = data.img[0]
        const formData = new FormData()
        formData.append('image', image)
        const url = `https://api.imgbb.com/1/upload?key=${imgHostKey}`
        fetch(url, {
            method: 'post',
            body: formData
        })
        .then(res => res.json())
        .then(imgData => {
            if(imgData.success){
                const doctor = {
                    name: data.name,
                    email: data.email,
                    speciality: data.speciality,
                    image: imgData.data.url
                }
                fetch('https://doctors-portal-server-lime-three.vercel.app/doctors', {
                    method: 'post',
                    headers: {
                        'content-type':'application/json',
                        authorization: `bearer ${localStorage.getItem('accessToken')}`
                    },
                    body: JSON.stringify(doctor)
                })
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    toast.success(`${data.name} is added successfull`)
                    navigate('/dashboard/managedoctors')
                })
            }
        })
    }

    return (
        <div className='w-96 p-7'>
            <h2 className="text-4xl">Add A Doctor</h2>
            <form onSubmit={handleSubmit(handleAddDoctor)}>
                <div className="form-control w-full max-w-xs">
                    <label className="label"> <span className="label-text">Name</span></label>
                    <input type="text" {...register("name", {
                        required: "Name is Required"
                    })} className="input input-bordered w-full max-w-xs" />
                    {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
                </div>
                <div className="form-control w-full max-w-xs">
                    <label className="label"> <span className="label-text">Email</span></label>
                    <input type="email" {...register("email", {
                        required: 'Email is required'
                    })} className="input input-bordered w-full max-w-xs" />
                    {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                </div>
                <div className="form-control w-full max-w-xs">
                    <label className="label"> <span className="label-text">Specialty</span></label>
                    <select {...register('speciality')} className="select select-bordered w-full max-w-xs">
                        <option disabled selected>Select your speciality</option>
                        {
                            specialities.map(speciality => <option
                                key={speciality._id}
                                value={speciality.name}
                            >{speciality.name}
                            </option>
                            )
                        }

                    </select>
                </div>
                <div className="form-control w-full max-w-xs">
                    <label className="label"> <span className="label-text">Image</span></label>
                    <input type="file" {...register("img", {
                        required: "Image is Required"
                    })} className="input input-bordered w-full max-w-xs" />
                    {errors.img && <p className='text-red-500'>{errors.img.message}</p>}
                </div>
                <input className='btn btn-accent w-full mt-4' value="Add Doctor" type="submit" />
            </form>
        </div>
    );
};

export default AddDoctor;