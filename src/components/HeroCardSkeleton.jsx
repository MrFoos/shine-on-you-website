import styles from './HeroCardSkeleton.module.css'

export default function HeroCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={`${styles.bar} ${styles.kicker}`} />
      <div className={styles.dateRow}>
        <div className={`${styles.bar} ${styles.dateDay}`} />
        <div className={styles.dateMonthYear}>
          <div className={`${styles.bar} ${styles.dateMonth}`} />
          <div className={`${styles.bar} ${styles.dateYear}`} />
        </div>
      </div>
      <div className={`${styles.bar} ${styles.location}`} />
      <div className={`${styles.bar} ${styles.venue}`} />
      <div className={`${styles.bar} ${styles.button}`} />
    </div>
  )
}
