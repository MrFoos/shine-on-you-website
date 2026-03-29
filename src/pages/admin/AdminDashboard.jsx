import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import EventTable from './EventTable'
import AboutEditor from './AboutEditor'
import VideoManager from './VideoManager'
import GalleryManager from './GalleryManager'
import PressKitManager from './PressKitManager'
import ContactEditor from './ContactEditor'

const TABS = [
  { id: 'events', label: 'Events' },
  { id: 'about', label: 'Om bandet' },
  { id: 'videos', label: 'Videoer' },
  { id: 'gallery', label: 'Galleri' },
  { id: 'presskit', label: 'Press Kit' },
  { id: 'contact', label: 'Kontakt' },
]

export default function AdminDashboard() {
  const { signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('events')

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Shine On You — Admin</h1>
        <button className="admin-signout" onClick={signOut}>Logg ut</button>
      </div>

      <nav className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="admin-content">
        {activeTab === 'events' && <EventTable />}
        {activeTab === 'about' && <AboutEditor />}
        {activeTab === 'videos' && <VideoManager />}
        {activeTab === 'gallery' && <GalleryManager />}
        {activeTab === 'presskit' && <PressKitManager />}
        {activeTab === 'contact' && <ContactEditor />}
      </div>
    </div>
  )
}
