import { useState } from 'react'

// TODO: Replace with your Formspree form ID (create a free account at formspree.io)
const FORMSPREE_ID = 'PLACEHOLDER_FORM_ID'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    const data = new FormData(e.target)
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="contact">
      <h2>Contact</h2>
      {status === 'success' ? (
        <p className="contact-success">Thanks! We&apos;ll get back to you soon.</p>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your name" required />
          <input type="email" name="email" placeholder="Your email" required />
          <textarea name="message" placeholder="Your message" rows={5} required />
          <button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {status === 'error' && (
            <p className="contact-error">Something went wrong. Please try again.</p>
          )}
        </form>
      )}
    </section>
  )
}
