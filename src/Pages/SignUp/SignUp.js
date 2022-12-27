import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider';
import { toast } from 'react-hot-toast';
import useToken from '../../hooks/useHook';

const SignUp = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUser, signInWithGoogle } = useContext(AuthContext)
    const [signUpError, setSignUpError] = useState('')
    const [createdUserEmail, setCreatedUserEmail] = useState('')
    const [token] = useToken(createdUserEmail)
    const navigate = useNavigate()

    if (token) {
        navigate('/')
    }

    const handleSignUp = (data) => {
        setSignUpError('')
        console.log(data);
        createUser(data.email, data.password)
            .then(res => {
                const user = res.user;
                console.log(user)
                toast.success('SignUp Successfully')
                const userInfo = {
                    displayName: data.name
                }
                updateUser(userInfo)
                    .then(() => {
                        saveUser(data.name, data.email)
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => {
                console.log(err)
                setSignUpError(err.message)
            })
    }

    const saveUser = (name, email) => {
        const user = { name, email };
        fetch('https://doctors-portal-server-lime-three.vercel.app/users', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(data => {
                setCreatedUserEmail(email)
            })
    }

    const handleGoogleSignIn = () => {
        signInWithGoogle()
    }
    return (
        <div className='h-[800px] flex justify-center items-center'>
            <div className='2-96 p-7 border'>
                <h2 className='text-3xl text-center'>Sign Up</h2>

                <form onSubmit={handleSubmit(handleSignUp)}>
                    <div
                        className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Name</span></label>
                        <input type="text"
                            {...register('name', {
                                required: 'Name is required',
                            })}
                            className="input input-bordered w-full max-w-xs" />
                        {errors.name && <p className='text-red-600'>{errors.name?.message}</p>}
                    </div>

                    <div
                        className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Email</span></label>
                        <input type="text"
                            {...register('email', {
                                required: 'Email is required'
                            })}
                            className="input input-bordered w-full max-w-xs" />
                        {errors.email && <p className='text-red-600'>{errors.email?.message}</p>}
                    </div>

                    <div
                        className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Password</span></label>
                        <input type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be 6 charactres or longer' },
                                pattern: { value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/, message: 'Password must have uppercase, number and special characters' }
                            })}
                            className="input input-bordered w-full max-w-xs" />
                        {errors.password && <p className='text-red-600'>{errors.password?.message}</p>}
                        <label className="label"> <span className="label-text">Forget Password?</span></label>
                    </div>

                    <input type="submit" value='sign up' className='btn btn-accent w-full' />
                    {signUpError && <p className='text-red-600'>Email already in used</p>}

                </form>

                <p>Already have an account?<Link className='text-secondary' to='/login'> Pleae Login</Link></p>
                <div className='divider'>OR</div>
                <button onClick={handleGoogleSignIn} className='btn btn-outline uppercase w-full'>continue with google</button>
            </div>
        </div>
    );
};

export default SignUp;