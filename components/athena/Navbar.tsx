'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ROUTE_ATHENA, ROUTE_ATHENA_INDEX } from 'lib/route'
import styles from './Navbar.module.scss'

const INDEX = 0
const POST = 1

const Navbar = () => {
  const pathname = usePathname()

  let activeRoute = POST
  if (pathname.startsWith(ROUTE_ATHENA_INDEX)) {
    activeRoute = INDEX
  }

  return (
    <div className={`${styles.container} ${styles.navbar} mx-auto block lg:hidden flex flex-row border-teal-800/50`}>
      <NavItem active={activeRoute === POST} to={ROUTE_ATHENA} title="Post" />
      <NavItem active={activeRoute === INDEX} to={ROUTE_ATHENA_INDEX} title="Index" />
    </div>
  )
}

interface NavItemProps {
  active: boolean
  title: string
  to: string
}

const NavItem = ({ active, to, title }: NavItemProps) => (
  <Link passHref href={to}>
    <div className={`py-2 px-4 ${active
        ? 'bg-teal-100 border-b-2 border-teal-800'
        : 'hover:bg-teal-50 cursor-pointer'}`}>
      {title}
    </div>
  </Link>
)

export default Navbar