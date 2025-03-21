import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Field, Label } from '@headlessui/react'
import { Button } from '@headlessui/react'
import '../style.scss'
import logo from '../assets/images/logo.png'
import Loader from '../components/loader';
import useToastStore from '../store/useToastStore';
import axios from 'axios';
import { BASE_URL } from '../config';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecking, setIsChecking] = useState(false); // ✅ Fixed missing state
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true); // ✅ Corrected state update

    try {
        const response = await axios.post(`${BASE_URL}/auth/login-beta`, {
      email,
      password,
    });

      if (response.data.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        showToast("Login successful!", "success"); // ✅ Show success toast
        navigate('/dashboard');
      } else {
        showToast("Invalid email or password", "error"); // ✅ Show error toast
      }
    } catch (e) {
      console.error("Error sending request", e);
      showToast("An error occurred. Please try again.", "error"); // ✅ Show error toast
    } finally {
      setIsChecking(false); // ✅ Corrected state update
    }
  };  

  return (
    <div className="flex flex-col md:flex-row min-h-screen login-screen">

      <div className="flex-1 order-2 md:order-1 flex items-center justify-center">
        <div className="loginBox">
          <figure className="login-logo"> <img src={logo} alt="logo" /> </figure>
          <h2>Sign into Account</h2>
          <h3>Please enter your credentials for login</h3>
          <form>

            <Field className="form-group">
              <Label className="data-[disabled]:opacity-50">Email</Label>
              <Input className="data-[disabled]:bg-gray-100" type="email" name="email" placeholder="Email"
                autoFocus={true}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </Field>

            <Field className="form-group">
              <Label className="data-[disabled]:opacity-50">Password</Label>
              <Input className="data-[disabled]:bg-gray-100" type="password" name="password" placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
                />
            </Field>

          
            {/* <div className="form-group">
              <label htmlFor="email">Email</label>
              <Input type="email" id="email" name="email" placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
               />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Input type="password" id="password" name="password" placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
            </div> */}
            <Field className="btnRow">
                <Button
              disabled={isChecking}
              style={{display: 'flex', flexDirection:'row',justifyContent:'center', }}
              onClick={handleSubmit}
                type="submit"
                className="btn btn-primary"
              >
                Sign in
              {isChecking && <Loader/>}
              </Button>
            </Field>
          </form>
        </div>
      </div>
      <div className="flex-1 order-1 md:order-2 flex items-center justify-center login-bg">
        <div className="innerContent">
          <h1>Welcome to our community</h1>
          <p>We are dedicated to bridging the gap between theory and real-world application. Our platform seamlessly integrates into your existing curriculum, providing an engaging and effective way to reinforce HVAC principles and diagnostic processes in the classroom.</p>
        </div>
      </div>


      {/*
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="container">
      <h1>Hello, Sass!</h1>
      <p>This is a simple example of using Sass with HTML.</p>


     <Button className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
      Save changes
    </Button>

    </div>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
      */}

    </div>
  );
} 