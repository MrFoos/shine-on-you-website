import { useAuth } from '../../contexts/AuthContext'

export default function AdminDashboard() {
  const { signOut } = useAuth()

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={signOut}>Logg ut</button>
      </div>
      <p>Admin panel kommer i neste fase.</p>
    </div>
  )
}
