import { useState, useRef } from 'react'
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
  const tabRefs = useRef([])

  const handleTabKeyDown = (e, index) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = (index + 1) % TABS.length
      setActiveTab(TABS[next].id)
      tabRefs.current[next]?.focus()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = (index - 1 + TABS.length) % TABS.length
      setActiveTab(TABS[prev].id)
      tabRefs.current[prev]?.focus()
    }
  }

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.adminHeader}>
        <h1>Shine On You — Admin</h1>
        <button className={styles.adminSignout} onClick={signOut}>Logg ut</button>
      </div>

      <div className={styles.adminTabs} role="tablist" aria-label="Admin seksjoner">
        {TABS.map((tab, i) => (
          <button
            key={tab.id}
            ref={el => { tabRefs.current[i] = el }}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={`${styles.adminTab} ${activeTab === tab.id ? styles.adminTabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => handleTabKeyDown(e, i)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className={styles.adminContent}
      >
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
