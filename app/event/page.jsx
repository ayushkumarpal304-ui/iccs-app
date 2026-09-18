'use client';
import { useState, useEffect } from 'react';

export default function EventHub() {
    const [events, setEvents] = useState([]);
    const [eventName, setEventName] = useState('');
    const [eventCat, setEventCat] = useState('💻 Coding Contest');

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('cs_events')) || [];
        setEvents(stored);
    }, []);

    const renderEvents = (newEvents) => {
        setEvents(newEvents);
        localStorage.setItem('cs_events', JSON.stringify(newEvents));
    };

    const addEvent = () => {
        if (!eventName.trim()) return alert('Please enter an event name!');
        const updated = [...events, { name: eventName, category: eventCat }];
        setEventName('');
        renderEvents(updated);
    };

    const deleteEvent = (index) => {
        const updated = events.filter((_, i) => i !== index);
        renderEvents(updated);
    };

    return (
        <div style={{ backgroundColor: '#0f172a', color: '#f1f5f9', minHeight: '100vh', padding: '16px', fontFamily: 'system-ui' }}>
            <div style={{ maxWidth: '400px', margin: '20px auto', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}>
                <h1 style={{ color: '#818cf8', fontSize: '24px', fontWeight: '955', textAlign: 'center', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>🚀 CS TECH EVENT HUB</h1>
                <p style={{ color: '#94a3b8', fontSize: '12px', textAlign: 'center', margin: '0 0 24px 0' }}>BTech CS First Year Project</p>
                
                <input type="text" placeholder="Event Name (e.g., CodeStorm)" value={eventName} onChange={(e) => setEventName(e.target.value)} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #475569', color: 'white', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' }} />
                
                <select value={eventCat} onChange={(e) => setEventCat(e.target.value)} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #475569', color: 'white', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' }}>
                    <option value="💻 Coding Contest">💻 Coding Contest</option>
                    <option value="🌐 Web Hackathon">🌐 Web Hackathon</option>
                    <option value="🤖 AI/ML Seminar">🤖 AI/ML Seminar</option>
                    <option value="🎮 Gaming Night">🎮 Gaming Night</option>
                </select>
                
                <button onClick={addEvent} style={{ width: '100%', backgroundColor: '#4f46e5', color: 'white', fontWeight: '600', padding: '12px', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>+ Add Event to Timeline</button>

                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#cbd5e1', margin: '24px 0 12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>📅 Upcoming Events</span>
                    <span style={{ backgroundColor: '#312e81', color: '#c7d2fe', fontSize: '12px', padding: '2px 8px', borderRadius: '9999px' }}>{events.length}</span>
                </h2>
                
                <div>
                    {events.length === 0 ? (
                        <p style={{ color: '#64748b', textAlign: 'center', fontSize: '14px', margin: '16px 0' }}>No events scheduled. Add one above!</p>
                    ) : (
                        events.map((ev, index) => (
                            <div key={index} style={{ backgroundColor: 'rgba(51, 65, 85, 0.5)', border: '1px solid #475569', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: '700', color: 'white', margin: '0' }}>{ev.name}</p>
                                    <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: '500' }}>{ev.category}</span>
                                </div>
                                <button onClick={() => deleteEvent(index)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer', padding: '4px 8px' }}>✕</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

