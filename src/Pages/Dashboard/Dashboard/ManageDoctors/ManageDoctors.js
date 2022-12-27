import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import Loading from '../../../Shared/Loading/Loading';
import ConfirmModal from '../../../Shared/Modal/ConfirmModal';
import { toast } from 'react-hot-toast';

const ManageDoctors = () => {

    const [deleteDoctor, setDeleteDoctor] = useState(null)

    const { data: doctors, isLoading, refetch } = useQuery({
        queryKey: ['doctors'],
        queryFn: async (req, res) => {
            try {
                const res = await fetch('https://doctors-portal-server-lime-three.vercel.app/doctors', {
                    headers: {
                        authorization: `bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                const data = await res.json()
                return data;
            }
            catch (err) {

            }
        }
    })

    const closeModal = () => {
        setDeleteDoctor(null)
    }

    const handleDeleteDoctor = (doctor) => {
        fetch(`https://doctors-portal-server-lime-three.vercel.app/doctors/${doctor._id}`, {
            method: 'delete',
            headers: {
                authorization: `bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.deletedCount) {
                    refetch()
                    toast.success(`Doctor ${doctor.name} is deleted`)
                }
            })
    }

    if (isLoading) {
        return <Loading />
    }
    return (
        <div className="overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Speciality</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        doctors.map((doctor, i) =>
                            <tr key={doctor._id}>
                                <td>{i + 1}</td>
                                <td>
                                    <div className="avatar">
                                        <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <img src={doctor.image} alt='' />
                                        </div>
                                    </div>
                                </td>
                                <td>{doctor.name}</td>
                                <td>{doctor.email}</td>
                                <td>{doctor.speciality}</td>
                                <td>
                                    <label onClick={() => setDeleteDoctor(doctor)} htmlFor="confirm-modal" className='btn btn-error'>Delete</label>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            {
                deleteDoctor && <ConfirmModal
                    title={`Are you sure to delete`}
                    msg={`If you delete ${deleteDoctor.name}. It can't not be undone`}
                    closeModal={closeModal}
                    handleDeleteDoctor={handleDeleteDoctor}
                    modalData={deleteDoctor}
                    successButtonName='Delete'
                ></ConfirmModal>
            }
        </div>
    );
};

export default ManageDoctors;