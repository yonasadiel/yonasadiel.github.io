import Index from 'app/athena/_components/Index'
import Navbar from 'app/athena/_components/Navbar'
import AthenaThemeProvider from 'app/athena/_components/ThemeProvider'
import styles from 'app/athena/layout.module.scss'

const AthenaLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <AthenaThemeProvider>
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
    </AthenaThemeProvider>
  )
}


export default AthenaLayout
