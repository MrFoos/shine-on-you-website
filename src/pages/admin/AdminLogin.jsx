import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import styles from './AdminLogin.module.css'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn(email, password)
    if (error) {
      setError('Feil e-post eller passord')
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className={styles.adminLogin}>
      <h1>Admin</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email" className={styles.adminLabel}>E-post</label>
        <input
          id="login-email"
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="login-password" className={styles.adminLabel}>Passord</label>
        <input
          id="login-password"
          type="password"
          placeholder="Passord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logger inn…' : 'Logg inn'}
        </button>
        {error && <p className={styles.adminError}>{error}</p>}
      </form>
    </div>
  )
}
