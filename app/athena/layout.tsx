import Index from 'components/athena/Index'
import Navbar from 'components/athena/Navbar'
import styles from './layout.module.scss'

const AthenaLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className={styles.athena}>
      <header>
        <div className={`${styles.container} ${styles.head} mx-auto py-6 border-teal-800/50`}>
          <h1 className="text-4xl font-bold">Athena</h1>
          <p>Yonas Adiel Wiguna&apos;s Blog</p>
          <div className="border-b-4 border-teal-800 w-32 md:w-80" />
        </div>
        <Navbar />
      </header>
      <div className={`${styles.container} ${styles.body} mx-auto`}>
        <main className={`${styles.main}`}>
          {children}
        </main>
        <aside className={`${styles.side} hidden lg:block`}>
          <Index />
        </aside>
      </div>
    </div>
  )
}


export default AthenaLayout
