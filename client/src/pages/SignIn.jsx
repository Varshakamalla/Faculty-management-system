import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [forgotPassword, setForgotPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  const handleForgotPassword = () => {
    setForgotPassword(true);
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (data.success === false) {

        return;
      }
    } catch (error) {
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        {forgotPassword ? 'Forgot Password' : 'Sign In'}
      </h1>
      <form
        onSubmit={forgotPassword ? handleForgotPasswordSubmit : handleSubmit}
        className='flex flex-col gap-4'
      >
        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        {!forgotPassword && (
          <input
            type='password'
            placeholder='Password'
            id='password'
            className='bg-slate-100 p-3 rounded-lg'
            onChange={handleChange}
          />
        )}
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : forgotPassword ? 'Reset Password' : 'Sign In'}
        </button>
        <OAuth />
      </form>
      <div className='flex flex-col gap-2 mt-5'>
        {forgotPassword ? (
          <>
            <p>Remember your password?</p>
            <button className='text-blue-500' onClick={() => setForgotPassword(false)}>
              Sign In
            </button>
          </>
        ) : (
          <>
            <div className='flex gap-2'>
              <p>Don't Have an account?</p>
              <Link to='/sign-up'>
                <span className='text-blue-500'>Sign up</span>
              </Link>
            </div>
            <button className='text-red-500' onClick={handleForgotPassword}>
              Forgot Password?
            </button>
          </>
        )}
      </div>
      <p className='text-red-700 mt-5'>{error ? error.message || 'Something went wrong!' : ''}</p>
    </div>
  );
}