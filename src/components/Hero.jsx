import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa'
import { HERO_LOGO } from '../config/branding'
import NextShowCard from './NextShowCard'
import BetweenToursCard from './BetweenToursCard'
import HeroCardSkeleton from './HeroCardSkeleton'
import styles from './Hero.module.css'

const DEFAULTS = {
  eyebrow: 'Pink Floyd Tribute · Est. 2017',
  tagline: 'A powerful tribute to one of the greatest bands in music history.',
  ctaPrimaryLabel: 'All concerts →',
  ctaPrimaryHref: '/tour',
  ctaSecondaryLabel: 'Book us',
  ctaSecondaryHref: 'mailto:shineonyouband@gmail.com?subject=Booking%20inquiry',
  nextShowKicker: 'Next Show',
  betweenToursEyebrow: 'BETWEEN TOURS',
  betweenToursHeading: 'No shows currently scheduled.',
  betweenToursBody: "We're off the road right now. Follow us on Instagram for tour news as soon as new dates are announced.",
  overlayOpacity: 0.65,
}

function CtaLink({ href, className, children }) {
  if (href && href.startsWith('/')) {
    return <Link to={href} className={className}>{children}</Link>
  }
  return <a href={href} className={className}>{children}</a>
}

export default function Hero({ settings = {}, nextEvent, facebookUrl, instagramUrl, youtubeUrl, loading = false }) {
  const eyebrow = settings.hero_eyebrow ?? DEFAULTS.eyebrow
  const tagline = settings.hero_tagline ?? DEFAULTS.tagline
  const ctaPrimaryLabel = settings.hero_cta_primary_label ?? DEFAULTS.ctaPrimaryLabel
  const ctaPrimaryHref = settings.hero_cta_primary_href ?? DEFAULTS.ctaPrimaryHref
  const ctaSecondaryLabel = settings.hero_cta_secondary_label ?? DEFAULTS.ctaSecondaryLabel
  const ctaSecondaryHref = settings.hero_cta_secondary_href ?? DEFAULTS.ctaSecondaryHref
  const nextShowKicker = settings.next_show_kicker ?? DEFAULTS.nextShowKicker
  const betweenToursEyebrow = settings.between_tours_eyebrow ?? DEFAULTS.betweenToursEyebrow
  const betweenToursHeading = settings.between_tours_heading ?? DEFAULTS.betweenToursHeading
  const betweenToursBody = settings.between_tours_body ?? DEFAULTS.betweenToursBody
  const socialKicker = settings.social_kicker ?? 'FOLLOW US'
  const bgImage = settings.hero_background_image || null
  const overlayOpacity = settings.hero_overlay_opacity ?? DEFAULTS.overlayOpacity
  const cardAlign = settings.hero_card_align ?? 'top'
  const cardOpacity = settings.hero_card_opacity ?? 0.82
  const cardVisible = settings.hero_card_visible ?? true
  const heroBackgroundCredit = settings.hero_background_credit ?? ''

  const hasSocial = facebookUrl || instagramUrl || youtubeUrl

  return (
    <section
      className={styles.hero}
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    >
      {bgImage && (
        <div className={styles.overlay} style={{ background: `rgba(0, 0, 0, ${overlayOpacity})` }} />
      )}
      {bgImage && heroBackgroundCredit && (
        <p className={styles.heroCredit}>Photo: {heroBackgroundCredit}</p>
      )}
      <div className={styles.heroContent}>
        <div className={styles.heroLeft}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <img
            src={HERO_LOGO}
            alt="Shine On You"
            className={styles.heroLogo}
          />
          <p className={styles.tagline}>{tagline}</p>
          <div className={styles.ctaGroup}>
            <CtaLink href={ctaPrimaryHref} className={styles.ctaPrimary}>{ctaPrimaryLabel}</CtaLink>
            <CtaLink href={ctaSecondaryHref} className={styles.ctaSecondary}>{ctaSecondaryLabel}</CtaLink>
          </div>
        </div>

        {cardVisible && (
          <div
            className={styles.heroRight}
            style={{
              '--card-bg-alpha': cardOpacity,
              alignSelf: cardAlign === 'bottom' ? 'end' : 'start',
            }}
          >
            {loading
              ? <HeroCardSkeleton />
              : nextEvent
                ? <NextShowCard event={nextEvent} kicker={nextShowKicker} />
                : <BetweenToursCard
                    eyebrow={betweenToursEyebrow}
                    heading={betweenToursHeading}
                    body={betweenToursBody}
                    instagramUrl={instagramUrl}
                  />
            }
          </div>
        )}

        {hasSocial && (
          <div className={styles.heroSocial}>
            <span className={styles.heroSocialLabel}>{socialKicker}</span>
            {facebookUrl && (
              <a href={facebookUrl} aria-label="Facebook" className={styles.heroSocialIcon} target="_blank" rel="noopener noreferrer">
                <FaFacebookF size={20} />
              </a>
            )}
            {instagramUrl && (
              <a href={instagramUrl} aria-label="Instagram" className={styles.heroSocialIcon} target="_blank" rel="noopener noreferrer">
                <FaInstagram size={20} />
              </a>
            )}
            {youtubeUrl && (
              <a href={youtubeUrl} aria-label="YouTube" className={styles.heroSocialIcon} target="_blank" rel="noopener noreferrer">
                <FaYoutube size={20} />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
