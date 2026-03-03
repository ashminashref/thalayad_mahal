import React, { useState, useEffect } from 'react';
import { Clock, Loader2 } from 'lucide-react';
import axios from 'axios';
import './PrayerTimer.css'

const PrayerTimer = () => {
  const [timings, setTimings] = useState(null);
  const [nextPrayer, setNextPrayer] = useState({ name: '', time: '' });
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1. Fetch timings from Aladhan API for Kozhikode
  useEffect(() => {
    const fetchTimings = async () => {
      try {
        // Method 1: Using City and Country
        const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
          params: {
            city: 'Kozhikode',
            country: 'India',
            method: 2, // ISNA method (commonly used)
          }
        });
        setTimings(response.data.data.timings);
      } catch (error) {
        console.error("Error fetching prayer timings:", error);
      }
    };
    fetchTimings();
  }, []);

  // 2. Logic to determine the next prayer and update the clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (timings) {
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        
        let foundNext = false;
        for (let name of prayers) {
          const [h, m] = timings[name].split(':').map(Number);
          const prayerMinutes = h * 60 + m;

          if (prayerMinutes > currentMinutes) {
            setNextPrayer({ name, time: timings[name] });
            foundNext = true;
            break;
          }
        }
        // If all prayers passed, next is Fajr tomorrow
        if (!foundNext) setNextPrayer({ name: 'Fajr', time: timings['Fajr'] });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timings]);

  if (!timings) return <Loader2 className="spinner-icon text-muted" size={16} />;

  return (
    <div className="prayer-live-content">
      <div className="d-flex align-items-center gap-2">
        <div className="status-indicator animate-pulse-green"></div>
        <span className=" next-label body-txt">Next: <strong>{nextPrayer.name}</strong> at {nextPrayer.time}</span>
      </div>
      <div className="digital-clock mt-1 body-txt p-2">
        {currentTime.toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit', 
          hour12: true 
        })}
      </div>
    </div>
  );
};

export default PrayerTimer;