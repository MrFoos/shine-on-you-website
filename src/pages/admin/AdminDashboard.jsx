import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import EventTable from './EventTable'
import AboutEditor from './AboutEditor'
import VideoManager from './VideoManager'
import GalleryManager from './GalleryManager'
import PressKitManager from './PressKitManager'
import SiteSettingsEditor from './SiteSettingsEditor'
import BandMembersManager from './BandMembersManager'
import styles from './AdminDashboard.module.css'

const TABS = [
  { id: 'events', label: 'Events' },
  { id: 'about', label: 'Om bandet' },
  { id: 'members', label: 'Bandmedlemmer' },
  { id: 'videos', label: 'Videoer' },
  { id: 'gallery', label: 'Galleri' },
  { id: 'presskit', label: 'Press Kit' },
  { id: 'settings', label: 'Innstillinger' },
]

export default function AdminDashboard() {
  const { signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('events')

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.adminHeader}>
        <h1>Shine On You — Admin</h1>
        <button className={styles.adminSignout} onClick={signOut}>Logg ut</button>
      </div>

      <nav className={styles.adminTabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.adminTab} ${activeTab === tab.id ? styles.adminTabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className={styles.adminContent}>
        {activeTab === 'events' && <EventTable />}
        {activeTab === 'about' && <AboutEditor />}
        {activeTab === 'members' && <BandMembersManager />}
        {activeTab === 'videos' && <VideoManager />}
        {activeTab === 'gallery' && <GalleryManager />}
        {activeTab === 'presskit' && <PressKitManager />}
        {activeTab === 'settings' && <SiteSettingsEditor />}
      </div>
    </div>
  )
}
