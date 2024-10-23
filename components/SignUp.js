"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import router for navigation
import { supabase } from '../lib/supabaseClient';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Initialize router

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      alert('Sign up successful! Please check your email for verification.');
      router.push('/login'); // Redirect to login after successful signup
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-black text-3xl">Sign up!</h1>
      <form onSubmit={handleSignUp} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-red-600 text-white rounded">
          Sign Up
        </button>
      </form>
      <p className="text-center text-black">
        Already have an account?{' '}
        <button onClick={() => router.push('/login')} className="text-blue-500 underline">
          Log In
        </button>
      </p>
    </div>
  );
};

export default SignUp;