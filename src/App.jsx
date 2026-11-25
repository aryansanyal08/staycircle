import React, { useState, useEffect } from 'react'
import Screen1Hook from './components/Screen1Hook'
import Screen2Checkin from './components/Screen2Checkin'
import Screen3Unlock from './components/Screen3Unlock'
import AdminDashboard from './components/AdminDashboard'
import { trackEvent } from './lib/api'

export default function App() {
  const params = new URLSearchParams(window.location.search)
  const bed = params.get('bed') || 'WALK-IN'
  const property = params.get('property') || 'Sai Ganga Cottage'
  const isAdmin = window.location.pathname === '/admin'

  const [screen, setScreen] = useState(1)
  const [checkinData, setCheckinData] = useState(null)
  const [sessionId] = useState(() => crypto.randomUUID())

  useEffect(() => {
    if (!isAdmin) {
      trackEvent(sessionId, 'scan_started', { bed_id: bed, property })
    }
  }, [])

  if (isAdmin) return <AdminDashboard />

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-start justify-center px-4 py-6">
      <div className="w-full max-w-md">
        {screen === 1 && (
          <Screen1Hook
            bed={bed}
            property={property} 
            onContinue={() => setScreen(2)}
          />
        )}
        {screen === 2 && (
          <Screen2Checkin
            bed={bed}
            property={property}
            sessionId={sessionId}
            onComplete={(data) => {
              setCheckinData(data)
              setScreen(3)
            }}
          />
        )}
        {screen === 3 && (
          <Screen3Unlock checkinData={checkinData} />
        )}
      </div>
    </div>
  )
}
