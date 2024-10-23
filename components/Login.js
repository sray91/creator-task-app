"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import router for navigation
import { supabase } from '../lib/supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Initialize router

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push('/'); // Redirect to dashboard after successful login
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-black text-3xl">Sign in!</h1>
      <form onSubmit={handleLogin} className="space-y-4">
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
          Log In
        </button>
      </form>
      <p className="text-center text-black">
        Don&apos;t have an account?{' '}
        <button onClick={() => router.push('/signup')} className="text-blue-500 underline">
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;