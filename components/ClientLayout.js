// /components/ClientLayout.js
"use client"; // This file will handle all the client-side logic

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import TaskList from './TaskList';
import EngagementLists from './EngagementLists';
import ContentStrategy from './ContentStrategy';
import ICPBuilder from './ICPBuilder';
import IdeationStation from './IdeationStation';
import { supabase } from '../lib/supabaseClient'; // Supabase client for session management

export default function ClientLayout({ children }) {
  const [activeComponent, setActiveComponent] = useState('TaskList');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Update this based on actual authentication
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  // Check session on page load
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && pathname !== '/login' && pathname !== '/signup') {
        router.push('/login'); // Redirect to login if no session found
      } else {
        setIsLoggedIn(!!session); // Update logged-in state
      }
    };

    checkSession();
  }, [pathname, router]);

  // Component rendering logic for the dashboard components
  const renderComponent = () => {
    switch (activeComponent) {
      case 'TaskList':
        return <TaskList />;
      case 'EngagementLists':
        return <EngagementLists />;
      case 'ContentStrategy':
        return <ContentStrategy />;
      case 'ICPBuilder':
        return <ICPBuilder />;
      case 'IdeationStation':
        return <IdeationStation />;
      default:
        return <TaskList />;
    }
  };

  // Determine if we're on the login or signup page
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <div className="h-screen">
      {!isAuthPage && isLoggedIn ? (
        // If not on login/signup and the user is logged in, show the sidebar
        <div className="flex h-full">
          <Sidebar setActiveComponent={setActiveComponent} />
          <div className="flex-1 ml-64 p-8 bg-white shadow-lg rounded-lg">
            {renderComponent()}
          </div>
        </div>
      ) : (
        // For login/signup pages or when the user is not logged in
        <div>{children}</div>
      )}
    </div>
  );
}