import { useEffect } from 'react'
import styles from './styles/page.module.css'

export default function Home() {
  useEffect(() => {
    console.log('rendered home page');
  }, [])

  return (
    <main className={styles.main}>
      <h2>Bomb Rush Cyberfunk API!</h2>
    </main>
  )
}
