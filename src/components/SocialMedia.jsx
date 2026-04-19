import { useEffect, useState } from 'react'
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa'
import { supabase } from '../lib/supabase'
import styles from './SocialMedia.module.css'

export default function SocialMedia() {
  const [links, setLinks] = useState({ facebook_url: '', instagram_url: '', youtube_url: '' })

  useEffect(() => {
    supabase
      .from('settings')
      .select('facebook_url, instagram_url, youtube_url')
      .eq('id', 1)
      .single()
      .then(({ data }) => { if (data) setLinks(data) })
  }, [])

  return (
    <section id="social-media" className={styles.socialMedia}>
      <div className={styles.socialIcons}>
        {links.facebook_url && (
          <a
            href={links.facebook_url}
            className={styles.facebook}
            aria-label="Visit our Facebook page"
          >
            <FaFacebookF size={32} />
          </a>
        )}
        {links.instagram_url && (
          <a
            href={links.instagram_url}
            className={styles.instagram}
            aria-label="Visit our Instagram page"
          >
            <FaInstagram size={32} />
          </a>
        )}
        {links.youtube_url && (
          <a
            href={links.youtube_url}
            className={styles.youtube}
            aria-label="Visit our Youtube page"
          >
            <FaYoutube size={32} />
          </a>
        )}
      </div>
    </section>
  )
}
