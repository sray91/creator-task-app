'use client';

import React, { useState, useEffect } from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Login from './Login';
import SignUp from './SignUp';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const tasksByDay = {
  Monday: [
    { type: 'header', content: "6am - 12pm: TOP OF FUNNEL (Personal takes, opinions, stories)" },
    { type: 'task', content: "Post 1 long-form tweet (personal story)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post image-based tweet (memes, gym, family)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post 1 image-based tweets (memes, gym, family)" },
    { type: 'task', content: "Post 1 short-form video (< 1 minute, personal take)" },
    { type: 'task', content: "Spend 30 minutes engaging with audience" },
    { type: 'header', content: "12pm - 6pm: MIDDLE OF FUNNEL (General niche advice, problem-solving, how-to's)" },
    { type: 'task', content: "Post 1 long-form tweet (niche advice or insight)" },
    { type: 'task', content: "Post 1 thread (inspirational brand comparison or how-to)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 piece of competence content (social proof, how-i)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 piece of competence content (social proof, how-i)" },
    { type: 'task', content: "Post 1 short-form video (< 1 minute, quick tip or advice)" },
    { type: 'task', content: "Publish 1 email and promo tweet (CTA)" },
    { type: 'task', content: "Spend 30 minutes engaging with audience" },
    { type: 'header', content: "6pm - 12am: BOTTOM OF FUNNEL (Extremely technical, in-depth, step by step)" },
    { type: 'task', content: "Post 1 long-form tweet (technical deep dive)" },
    { type: 'task', content: "Post 1 thread (step-by-step guide or technical breakdown)" },
    { type: 'task', content: "Post 20 outbound DMs selling to cold prospects" },
    { type: 'task', content: "Post 20 outbound DMs selling to warm prospects" },
    { type: 'task', content: "Re-engage old conversations that have died" }
  ],
  Tuesday: [
    { type: 'header', content: "6am - 12pm: TOP OF FUNNEL (Personal takes, opinions, stories)" },
    { type: 'task', content: "Post 1 long-form tweet (personal story)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post image-based tweet (memes, gym, family)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post 1 image-based tweets (memes, gym, family)" },
    { type: 'task', content: "Post 1 short-form video (< 1 minute, personal take)" },
    { type: 'task', content: "Spend 30 minutes engaging with audience" },
    { type: 'header', content: "12pm - 6pm: MIDDLE OF FUNNEL (General niche advice, problem-solving, how-to's)" },
    { type: 'task', content: "Post 1 long-form tweet (niche advice or insight)" },
    { type: 'task', content: "Post 1 thread (inspirational brand comparison or how-to)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 piece of competence content (social proof, how-i)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 piece of competence content (social proof, how-i)" },
    { type: 'task', content: "Post 1 short-form video (< 1 minute, quick tip or advice)" },
    { type: 'task', content: "Publish 1 email and promo tweet (CTA)" },
    { type: 'task', content: "Spend 30 minutes engaging with audience" },
    { type: 'header', content: "6pm - 12am: BOTTOM OF FUNNEL (Extremely technical, in-depth, step by step)" },
    { type: 'task', content: "Post 1 long-form tweet (technical deep dive)" },
    { type: 'task', content: "Post 1 thread (step-by-step guide or technical breakdown)" },
    { type: 'task', content: "Post 20 outbound DMs selling to cold prospects" },
    { type: 'task', content: "Post 20 outbound DMs selling to warm prospects" },
    { type: 'task', content: "Re-engage old conversations that have died" }
  ],
  Wednesday: [
    { type: 'header', content: "6am - 12pm: TOP OF FUNNEL (Personal takes, opinions, stories)" },
    { type: 'task', content: "Post 1 long-form tweet (personal story)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post image-based tweet (memes, gym, family)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post 1 image-based tweets (memes, gym, family)" },
    { type: 'task', content: "Post 1 short-form video (< 1 minute, personal take)" },
    { type: 'task', content: "Spend 30 minutes engaging with audience" },
    { type: 'header', content: "12pm - 6pm: MIDDLE OF FUNNEL (General niche advice, problem-solving, how-to's)" },
    { type: 'task', content: "Post 1 hand-raiser tweet" },
    { type: 'task', content: "Post 1 long-form tweet (niche advice or insight)" },
    { type: 'task', content: "Post 1 thread (inspirational brand comparison or how-to)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 piece of competence content (social proof, how-i)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 piece of competence content (social proof, how-i)" },
    { type: 'task', content: "Post 1 short-form video (< 1 minute, quick tip or advice)" },
    { type: 'task', content: "Publish 1 email and promo tweet (CTA)" },
    { type: 'task', content: "Spend 30 minutes engaging with audience" },
    { type: 'header', content: "6pm - 12am: BOTTOM OF FUNNEL (Extremely technical, in-depth, step by step)" },
    { type: 'task', content: "Post 1 long-form tweet (technical deep dive)" },
    { type: 'task', content: "Post 1 thread (step-by-step guide or technical breakdown)" },
    { type: 'task', content: "Post 20 outbound DMs selling to cold prospects" },
    { type: 'task', content: "Post 20 outbound DMs selling to warm prospects" },
    { type: 'task', content: "Re-engage old conversations that have died" }
  ],
  Thursday: [
    { type: 'header', content: "6am - 12pm: TOP OF FUNNEL (Personal takes, opinions, stories)" },
    { type: 'task', content: "Post 1 long-form tweet (personal story)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post image-based tweet (memes, gym, family)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post 1 image-based tweets (memes, gym, family)" },
    { type: 'task', content: "Post 1 short-form video (< 1 minute, personal take)" },
    { type: 'task', content: "Spend 30 minutes engaging with audience" },
    { type: 'header', content: "12pm - 6pm: MIDDLE OF FUNNEL (General niche advice, problem-solving, how-to's)" },
    { type: 'task', content: "Post 1 hand-raiser tweet" },
    { type: 'task', content: "Post 1 long-form tweet (niche advice or insight)" },
    { type: 'task', content: "Post 1 thread (inspirational brand comparison or how-to)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 piece of competence content (social proof, how-i)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 piece of competence content (social proof, how-i)" },
    { type: 'task', content: "Post 1 short-form video (< 1 minute, quick tip or advice)" },
    { type: 'task', content: "Publish 1 email and promo tweet (CTA)" },
    { type: 'task', content: "Spend 30 minutes engaging with audience" },
    { type: 'header', content: "6pm - 12am: BOTTOM OF FUNNEL (Extremely technical, in-depth, step by step)" },
    { type: 'task', content: "Post 1 long-form tweet (technical deep dive)" },
    { type: 'task', content: "Post 1 thread (step-by-step guide or technical breakdown)" },
    { type: 'task', content: "Post 20 outbound DMs selling to cold prospects" },
    { type: 'task', content: "Post 20 outbound DMs selling to warm prospects" },
    { type: 'task', content: "Re-engage old conversations that have died" }
  ],
  Friday: [
    { type: 'header', content: "6am - 12pm: TOP OF FUNNEL (Personal takes, opinions, stories)" },
    { type: 'task', content: "Post 1 long-form tweet (personal story)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post image-based tweet (memes, gym, family)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post 1 image-based tweets (memes, gym, family)" },
    { type: 'task', content: "Post 1 short-form video (< 1 minute, personal take)" },
    { type: 'task', content: "Spend 30 minutes engaging with audience" },
    { type: 'header', content: "12pm - 6pm: MIDDLE OF FUNNEL (General niche advice, problem-solving, how-to's)" },
    { type: 'task', content: "Post 1 hand-raiser tweet" },
    { type: 'task', content: "Post 1 long-form tweet (niche advice or insight)" },
    { type: 'task', content: "Post 1 thread (inspirational brand comparison or how-to)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 piece of competence content (social proof, how-i)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 piece of competence content (social proof, how-i)" },
    { type: 'task', content: "Post 1 short-form video (< 1 minute, quick tip or advice)" },
    { type: 'task', content: "Publish 1 email and promo tweet (CTA)" },
    { type: 'task', content: "Spend 30 minutes engaging with audience" },
    { type: 'header', content: "6pm - 12am: BOTTOM OF FUNNEL (Extremely technical, in-depth, step by step)" },
    { type: 'task', content: "Post long-form video on YouTube (technical, in-depth content)" },
    { type: 'task', content: "Post 20 outbound DMs selling to cold prospects" },
    { type: 'task', content: "Post 20 outbound DMs selling to warm prospects" },
    { type: 'task', content: "Re-engage old conversations that have died" }
  ],
  Saturday: [
    { type: 'header', content: "6am - 12pm: TOP OF FUNNEL (Personal takes, opinions, stories)" },
    { type: 'task', content: "Post 1 long-form tweet (personal story)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post image-based tweet (memes, gym, family)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post 1 value tweet (personal opinions, experiences)" },
    { type: 'task', content: "Post 1 image-based tweets (memes, gym, family)" },
    { type: 'task', content: "Post 1 short-form video (< 1 minute, personal take)" },
    { type: 'task', content: "Spend 30 minutes engaging with audience" },
    { type: 'header', content: "12pm - 6pm: MIDDLE OF FUNNEL (General niche advice, problem-solving, how-to's)" },
    { type: 'task', content: "Post 1 hand-raiser tweet" },
    { type: 'task', content: "Post 1 long-form tweet (niche advice or insight)" },
    { type: 'task', content: "Post 1 thread (inspirational brand comparison or how-to)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 piece of competence content (social proof, how-i)" },
    { type: 'task', content: "Post 1 value tweet (what, why, how of niche topics)" },
    { type: 'task', content: "Post 1 piece of competence content (social proof, how-i)" },
    { type: 'task', content: "Post 1 short-form video (< 1 minute, quick tip or advice)" },
    { type: 'task', content: "Publish 1 email and promo tweet (CTA)" },
    { type: 'task', content: "Spend 30 minutes engaging with audience" },
    { type: 'header', content: "6pm - 12am: BOTTOM OF FUNNEL (Extremely technical, in-depth, step by step)" },
    { type: 'task', content: "Post 1 long-form tweet (technical deep dive)" },
    { type: 'task', content: "Post 1 thread (step-by-step guide or technical breakdown)" },
    { type: 'task', content: "Post 20 outbound DMs selling to cold prospects" },
    { type: 'task', content: "Post 20 outbound DMs selling to warm prospects" },
    { type: 'task', content: "Re-engage old conversations that have died" }
  ],
  Sunday: [
    { type: 'task', content: "Post as many off the dome tweets as possible" },
    { type: 'task', content: "Write content for the next week" }
  ]
};

const WeeklyPlannerChecklist = () => {
  const [user, setUser] = useState(null);
  const [currentDay, setCurrentDay] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState({});
  const [progress, setProgress] = useState(0);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      const today = new Date();
      setCurrentDay(days[today.getDay()]);
      setTasks(tasksByDay[days[today.getDay()]] || []);
      loadProgress();

      const timer = setInterval(() => {
        const now = new Date();
        setCurrentTime(now.toLocaleTimeString());
        updateCurrentTimeBlock(now);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const totalTasks = tasks.filter(task => task.type === 'task').length;
      const completedTasks = Object.values(checkedTasks).filter(Boolean).length;
      const newProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      setProgress(newProgress);
      saveProgress(newProgress);
    }
  }, [tasks, checkedTasks, user]);

  const loadProgress = async () => {
    const { data, error } = await supabase
      .from('user_progress')
      .select('progress, checked_tasks')
      .eq('user_id', user.id)
      .eq('date', new Date().toISOString().split('T')[0])
      .single();

    if (data) {
      setProgress(data.progress);
      setCheckedTasks(data.checked_tasks);
    }
  };

  const saveProgress = async (newProgress) => {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        progress: newProgress,
        checked_tasks: checkedTasks
      });

    if (error) console.error('Error saving progress:', error);
  };

  const toggleTask = (index) => {
    setCheckedTasks(prev => {
      const newCheckedTasks = {
        ...prev,
        [index]: !prev[index]
      };
      return newCheckedTasks;
    });
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
    else {
      setUser(null);
      setCheckedTasks({});
      setProgress(0);
    }
  };

  const updateCurrentTimeBlock = (now) => {
    const hour = now.getHours();
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.type === 'header') {
          const [startStr, endStr] = task.content.split(':')[0].split('-');
          const start = parseInt(startStr);
          const end = parseInt(endStr) === 12 ? 24 : parseInt(endStr);
          task.isCurrentBlock = (hour >= start && hour < end);
        }
        return task;
      })
    );
  };

  if (!user) {
    if (isSignUp) {
      return (
        <SignUp
          onSignUp={setUser}
          onSwitchToLogin={() => setIsSignUp(false)}
        />
      );
    } else {
      return (
        <Login
          onLogin={setUser}
          onSwitchToSignUp={() => setIsSignUp(true)}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-black">{currentTime}</h1>
            </div>
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${progress}%`}}></div>
              </div>
              <p className="text-center mt-2 text-black">{Math.round(progress)}% Complete</p>
            </div>
            <h2 className="text-2xl font-semibold mb-6 text-black">{currentDay}&apos;s Tasks</h2>
            <ul>
              {tasks.map((item, index) => (
                <li key={index} className="mb-2 text-black">
                  {item.type === 'header' ? (
                    <h3 className={`text-lg font-semibold mt-4 mb-2 p-2 rounded ${item.isCurrentBlock ? 'bg-yellow-200' : 'text-blue-600'}`}>
                      {item.content}
                    </h3>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button onClick={() => toggleTask(index)}>
                        {checkedTasks[index] ? (
                          <CheckSquare className="text-green-500" />
                        ) : (
                          <Square className="text-gray-300" />
                        )}
                      </button>
                      <span className={checkedTasks[index] ? 'line-through text-gray-500' : ''}>
                        {item.content}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlannerChecklist;