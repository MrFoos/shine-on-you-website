import { useEffect, useRef } from 'react'

const SLIDES = [
  { src: '/images/P1092593Shine25@EspenHåkonsen47754888.webp', alt: 'img-1' },
  { src: '/images/P1092053Shine25@EspenHåkonsen47754888.webp', alt: 'img-2' },
  { src: '/images/P1092557Shine25@EspenHåkonsen47754888.webp', alt: 'img-3' },
  { src: '/images/P1092034Shine25@EspenHåkonsen47754888.webp', alt: 'img-4' },
  { src: '/images/P1102743Shine25@EspenHåkonsen47754888.webp', alt: 'img-5' },
  { src: '/images/P1103000Shine25@EspenHåkonsen47754888.webp', alt: 'img-6' },
]

export default function ImageSlider() {
  const imageListRef = useRef(null)
  const prevBtnRef = useRef(null)
  const nextBtnRef = useRef(null)
  const scrollbarThumbRef = useRef(null)
  const sliderScrollbarRef = useRef(null)

  useEffect(() => {
    const imageList = imageListRef.current
    const prevBtn = prevBtnRef.current
    const nextBtn = nextBtnRef.current
    const scrollbarThumb = scrollbarThumbRef.current
    const sliderScrollbar = sliderScrollbarRef.current

    let maxScrollLeft = 0

    const updateMaxScrollLeft = () => {
      maxScrollLeft = imageList.scrollWidth - imageList.clientWidth
    }

    const handleSlideButtons = () => {
      prevBtn.style.display = imageList.scrollLeft <= 0 ? 'none' : 'flex'
      nextBtn.style.display = imageList.scrollLeft >= maxScrollLeft ? 'none' : 'flex'
    }

    const updateScrollThumbPosition = () => {
      const scrollPosition = imageList.scrollLeft
      const thumbPosition =
        (scrollPosition / maxScrollLeft) *
        (sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth)
      scrollbarThumb.style.left = `${thumbPosition}px`
    }

    const handleScroll = () => {
      updateScrollThumbPosition()
      handleSlideButtons()
    }

    const handleThumbMouseDown = (e) => {
      const startX = e.clientX
      const thumbPosition = scrollbarThumb.offsetLeft
      const maxThumbPosition =
        sliderScrollbar.getBoundingClientRect().width - scrollbarThumb.offsetWidth

      const handleMouseMove = (e) => {
        const deltaX = e.clientX - startX
        const newThumbPosition = thumbPosition + deltaX
        const boundedPosition = Math.max(0, Math.min(maxThumbPosition, newThumbPosition))
        const scrollPosition = (boundedPosition / maxThumbPosition) * maxScrollLeft
        scrollbarThumb.style.left = `${boundedPosition}px`
        imageList.scrollLeft = scrollPosition
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    const handleButtonClick = (e) => {
      const direction = e.currentTarget === prevBtn ? -1 : 1
      imageList.scrollBy({ left: imageList.clientWidth * direction, behavior: 'smooth' })
    }

    const handleResize = () => {
      updateMaxScrollLeft()
      updateScrollThumbPosition()
      handleSlideButtons()
    }

    const init = () => {
      updateMaxScrollLeft()
      updateScrollThumbPosition()
      handleSlideButtons()
    }

    imageList.addEventListener('scroll', handleScroll)
    scrollbarThumb.addEventListener('mousedown', handleThumbMouseDown)
    prevBtn.addEventListener('click', handleButtonClick)
    nextBtn.addEventListener('click', handleButtonClick)
    window.addEventListener('resize', handleResize)
    window.addEventListener('load', init)

    // Images may already be cached/loaded
    if (document.readyState === 'complete') init()

    return () => {
      imageList.removeEventListener('scroll', handleScroll)
      scrollbarThumb.removeEventListener('mousedown', handleThumbMouseDown)
      prevBtn.removeEventListener('click', handleButtonClick)
      nextBtn.removeEventListener('click', handleButtonClick)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('load', init)
    }
  }, [])

  return (
    <>
      <div className="slider-wrapper">
        <button id="prev-slide" className="slide-button material-symbols-rounded" ref={prevBtnRef}>
          chevron_left
        </button>
        <ul className="image-list" ref={imageListRef}>
          {SLIDES.map((slide) => (
            <li key={slide.alt}>
              <img className="image-item" src={slide.src} alt={slide.alt} />
            </li>
          ))}
        </ul>
        <button id="next-slide" className="slide-button material-symbols-rounded" ref={nextBtnRef}>
          chevron_right
        </button>
      </div>
      <div className="slider-scrollbar" ref={sliderScrollbarRef}>
        <div className="scrollbar-track">
          <div className="scrollbar-thumb" ref={scrollbarThumbRef}></div>
        </div>
      </div>
    </>
  )
}
