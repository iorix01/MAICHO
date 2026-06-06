'use client'

import { useState, useEffect, useRef } from 'react'
import { letters } from './letters'
import styles from './page.module.css'

type Stage = 'landing' | 'opening' | 'reading'

export default function Home() {
  const [stage, setStage] = useState<Stage>('landing')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [stars, setStars] = useState<{ x: number; y: number; size: number; delay: number; duration: number }[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const generated = Array.from({ length: 70 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
    }))
    setStars(generated)
  }, [])

  const typeText = (text: string) => {
    setDisplayedText('')
    setIsTyping(true)
    let i = 0
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1))
      i++
      if (i >= text.length) {
        clearInterval(intervalRef.current!)
        setIsTyping(false)
      }
    }, 20)
  }

  const openLetter = () => {
    setStage('opening')
    setTimeout(() => {
      setStage('reading')
      typeText(letters[0].body)
    }, 900)
  }

  const nextLetter = () => {
    const next = (currentIndex + 1) % letters.length
    setCurrentIndex(next)
    typeText(letters[next].body)
  }

  const prevLetter = () => {
    const prev = (currentIndex - 1 + letters.length) % letters.length
    setCurrentIndex(prev)
    typeText(letters[prev].body)
  }

  return (
    <main className={styles.main}>
      {/* Stars background */}
      <div className={styles.starsLayer}>
        {stars.map((s, i) => (
          <span
            key={i}
            className={styles.star}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Landing stage */}
      {stage === 'landing' && (
        <div className={styles.landing}>
          <p className={styles.preTitle}>— for her —</p>

          <div className={styles.envelope} onClick={openLetter}>
            <div className={styles.envBody} />
            <div className={styles.envLeft} />
            <div className={styles.envRight} />
            <div className={styles.envBottom} />
            <div className={styles.envFlap} />
            <div className={styles.envSeal}>♥</div>
          </div>

          <h1 className={styles.title}>A letter.<br />Written just for her.</h1>
          <p className={styles.desc}>She heals everyone. Someone had to write this for her.</p>

          <button className={styles.btnOpen} onClick={openLetter}>
            Click here &mdash; open her letter
            <span className={styles.btnHeart}>♥</span>
          </button>
        </div>
      )}

      {/* Opening animation */}
      {stage === 'opening' && (
        <div className={styles.opening}>
          <div className={`${styles.envelope} ${styles.envelopeOpen}`}>
            <div className={styles.envBody} />
            <div className={styles.envLeft} />
            <div className={styles.envRight} />
            <div className={styles.envBottom} />
            <div className={`${styles.envFlap} ${styles.flapOpen}`} />
            <div className={styles.envSeal} style={{ opacity: 0 }}>♥</div>
          </div>
        </div>
      )}

      {/* Reading stage */}
      {stage === 'reading' && (
        <div className={styles.reading}>
          <div className={styles.paperTop}>
            <span className={styles.paperLine} />
            <span className={styles.letterCounter}>
              {currentIndex + 1} / {letters.length}
            </span>
            <span className={styles.paperLine} />
          </div>

          <div className={styles.letterCard}>
            <div className={styles.letterHeader}>
              <p className={styles.letterTo}>To the one who heals</p>
              <h2 className={styles.letterTitle}>{letters[currentIndex].title}</h2>
            </div>

            <div className={styles.divider}>— ✦ —</div>

            <p className={styles.letterBody}>
              {displayedText}
              {isTyping && <span className={styles.cursor}>|</span>}
            </p>

            <div className={styles.letterFooter}>
              <p className={styles.fromLabel}>Always yours</p>
              <p className={styles.signature}>Someone who can&apos;t stop thinking of you</p>
            </div>
          </div>

          <div className={styles.navRow}>
            <button
              className={styles.navBtn}
              onClick={prevLetter}
              disabled={isTyping}
            >
              ← Prev
            </button>
            <button
              className={`${styles.navBtn} ${styles.navBtnNext}`}
              onClick={nextLetter}
              disabled={isTyping}
            >
              Next letter ♥
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
