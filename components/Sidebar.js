"use client";

import { useRouter } from 'next/navigation'; // Use next/navigation for App Router navigation
import { supabase } from '../lib/supabaseClient'; // Import Supabase client
import Image from 'next/image';

export default function Sidebar({ setActiveComponent }) {
  const router = useRouter(); // Initialize router for navigation

  // Handle user logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut(); // Sign the user out
      router.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const menuItems = [
    { name: 'Task List', component: 'TaskList' },
    { name: 'Engagement Lists', component: 'EngagementLists' },
    { name: 'Content Strategy', component: 'ContentStrategy' },
    { name: 'ICP Builder', component: 'ICPBuilder' },
    { name: 'Ideation Station', component: 'IdeationStation' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed p-4 flex flex-col justify-between">
      <div>
        <Image alt='' src="/creator-task-logo.png" width={100} height={100} />
        <h2 className="text-3xl font-bold mb-6">CreatorTask</h2>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.component}
              className="p-4 hover:bg-gray-700 cursor-pointer mb-2 rounded-lg"
              onClick={() => setActiveComponent(item.component)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg mt-auto"
      >
        Logout
      </button>
    </div>
  );
}