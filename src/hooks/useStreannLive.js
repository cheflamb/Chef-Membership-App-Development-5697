import {useState, useEffect, useCallback} from 'react';

export const useStreannLive = () => {
  const [liveEvents, setLiveEvents] = useState([]);
  const [currentLiveEvent, setCurrentLiveEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sample live events data - replace with your actual Streann events
  const sampleEvents = [
    {
      id: '6859aeff745c6099c08f0bfc', // Your actual event ID
      title: 'Monthly Leadership Deep Dive: Handling Difficult Conversations',
      description: 'Learn frameworks for navigating tough conversations that build trust instead of breaking it down.',
      scheduledFor: '2024-01-28T15:00:00Z',
      isLive: false, // You'd check this via Streann API
      viewerCount: 0,
      tier_required: 'fraternity',
      instructor: 'Chef Adam'
    },
    {
      id: 'live-brigade-call',
      title: 'Brigade Monthly Coaching Call',
      description: 'Group coaching session for Brigade members.',
      scheduledFor: '2024-02-05T14:00:00Z',
      isLive: false,
      viewerCount: 0,
      tier_required: 'brigade',
      instructor: 'Chef Adam'
    }
  ];

  useEffect(() => {
    // Simulate fetching live events
    const fetchLiveEvents = () => {
      setIsLoading(true);
      
      // In a real implementation, you'd fetch from Streann API
      setTimeout(() => {
        setLiveEvents(sampleEvents);
        
        // Check if any event is currently live
        const liveEvent = sampleEvents.find(event => event.isLive);
        setCurrentLiveEvent(liveEvent || null);
        
        setIsLoading(false);
      }, 1000);
    };

    fetchLiveEvents();

    // Poll for live status every 30 seconds
    const interval = setInterval(() => {
      // In real app, check Streann API for live status
      checkLiveStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const checkLiveStatus = useCallback(async () => {
    // In a real implementation, you'd call Streann API to check live status
    // For now, we'll simulate it
    
    try {
      // Example: Check if scheduled event should be live now
      const now = new Date();
      const updatedEvents = liveEvents.map(event => {
        const scheduledTime = new Date(event.scheduledFor);
        const eventEndTime = new Date(scheduledTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
        
        const shouldBeLive = now >= scheduledTime && now <= eventEndTime;
        
        return {
          ...event,
          isLive: shouldBeLive,
          viewerCount: shouldBeLive ? Math.floor(Math.random() * 100) + 20 : 0
        };
      });

      setLiveEvents(updatedEvents);
      
      const liveEvent = updatedEvents.find(event => event.isLive);
      setCurrentLiveEvent(liveEvent || null);
      
    } catch (error) {
      console.error('Error checking live status:', error);
    }
  }, [liveEvents]);

  const getEventById = useCallback((eventId) => {
    return liveEvents.find(event => event.id === eventId);
  }, [liveEvents]);

  const getUpcomingEvents = useCallback(() => {
    const now = new Date();
    return liveEvents
      .filter(event => new Date(event.scheduledFor) > now)
      .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));
  }, [liveEvents]);

  const registerForEvent = useCallback(async (eventId) => {
    try {
      // In real app, this would call your backend API
      console.log(`Registering for event: ${eventId}`);
      
      // Update local state to show registration
      setLiveEvents(events => 
        events.map(event => 
          event.id === eventId 
            ? { ...event, userRegistered: true }
            : event
        )
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error registering for event:', error);
      return { success: false, error: error.message };
    }
  }, []);

  return {
    liveEvents,
    currentLiveEvent,
    isLoading,
    getEventById,
    getUpcomingEvents,
    registerForEvent,
    checkLiveStatus
  };
};