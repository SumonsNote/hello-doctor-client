import { useContext } from 'react';
import { React } from 'react';
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useToken from '../../hooks/useHook';

const Login = () => {

    const { register, handleSubmit, formState: { errors }, } = useForm();
    const { signIn, signInWithGoogle } = useContext(AuthContext)
    const [loginError, setLoginError] = useState('')
    const [loginUserEmail, setloginUserEmail] = useState('')
    const [token] = useToken(loginUserEmail)
    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || '/'

    if (token) {
        navigate(from, { replace: true })
    }

    const handleLogin = (data) => {
        console.log(data)
        setLoginError('')
        signIn(data.email, data.password)
            .then(result => {
                const user = result.user;
                console.log(user);
                toast.success('Login Successfully')
                setloginUserEmail(data.email)
            })
            .catch(error => {
                console.log(error)
                setLoginError(error.message)
            })
    }

    const handleGoogleSignIn = () => {
        signInWithGoogle()
    }

    return (
        <div className='h-[800px] flex justify-center items-center'>
            <div className='2-96 p-7 border'>
                <h2 className='text-3xl text-center'>Login</h2>
                <form onSubmit={handleSubmit(handleLogin)}>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Email</span></label>
                        <input type="text"
                            {...register("email", {
                                required: "Email Address is required"
                            })}
                            className="input input-bordered w-full max-w-xs" />
                        {errors.email && <p className='text-red-600'>{errors.email?.message}</p>}
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Password</span></label>
                        <input type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: 'Password must be 6 characters or longer' }
                            })}
                            className="input input-bordered w-full max-w-xs" />
                        <label className="label"> <span className="label-text">Forget Password?</span></label>
                        {errors.password && <p className='text-red-600'>{errors.password?.message}</p>}
                    </div>
                    <input type="submit" value='login' className='btn btn-accent w-full' />
                    <div>
                        {loginError && <p className='text-red-500'>Wrong Password</p>}
                    </div>
                </form>
                <p>New to Doctor Portal?<Link className='text-secondary' to='/signup'> Create New Account</Link></p>
                <div className='divider'>OR</div>
                <button onClick={handleGoogleSignIn} className='btn btn-outline uppercase w-full'>continue with google</button>
            </div>
        </div>
    );
};

export default Login;