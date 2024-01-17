'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDelayed } from '../../lib/hooks'
import { useAthenaState } from '../../lib/athena/state'
import { Post } from '../../lib/athena/post'
import Index from './_Index'
import PostComponent from './_Post'
import PasswordModal from './_PasswordModal'
import styles from './styles.module.scss'

type PostIndex = { list: string[] }

const fetchAllPosts = () => fetch('/posts/index.json')
  .then((res) => res.json())
  .then((res: PostIndex) =>
    Promise.all(res.list.map((url) => fetch(url).then((r) => r.text())))
      .then((allPosts) => allPosts
          .map(parsePost)
          .sort((a, b) => a.date < b.date ? 1 : -1)
      )
  )

const slugify = (title: string): string => title.toLowerCase().replaceAll(' ', '-').replaceAll(':', '')

const parsePost = (postContent: string): Post => {
  const lines = postContent.split('\n')
  const title = lines[0]
  const post: Post = {
    title: title,
    date: new Date(),
    slug: slugify(title),
    content: '',
    meta: {},
  }
  let i = 1
  for (; i < lines.length && lines[i] !== ''; i++) {
    const [key, ...rest] = lines[i].split(':')
    post.meta[key.trim()] = rest.join(':').trim()
  }
  post.content = lines.slice(i).join('\n')
  post.date = new Date(post.meta['date'] || '')

  return post
}

const NAV_POST = 'post'
const NAV_INDEX = 'index'

const Athena = () => {
  const searchParams = useSearchParams();
  const allPosts = useDelayed(fetchAllPosts, [], [])
  const [nav, setNav] = useState<string>(NAV_POST)
  const [athena, setAthena] = useAthenaState({ userKeys: [] })
  const slug = searchParams.get('slug') || ''
  const postsToShow = (!!slug ? allPosts?.filter((p) => p.slug === slug) : allPosts) || []
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);

  useEffect(() => setNav(NAV_POST), [slug])

  const postProps = { userKeys: athena.userKeys, onUnlockPost: () => setIsPasswordModalOpen(true) }
  const handleNewPassword = (password: string | null) => {
    setIsPasswordModalOpen(false)
    if (!!password) {
      setAthena({ ...athena, userKeys: [...(athena.userKeys || []), password].filter((v, i, a) => a.indexOf(v) === i) })
    }
  }
  return (
    <main className={`${styles.athena}`}>
      <title>
        {!!slug && postsToShow.length === 1
          ? `${postsToShow[0].title} | Athena: Yonas\' Blog`
          : 'Athena: Yonas\' Blog'}
      </title>
      <PasswordModal isOpen={isPasswordModalOpen} onSubmit={handleNewPassword} />
      <div className={`${styles.container} ${styles.head} mx-auto py-6 border-teal-800/50`}>
        <h1 className="text-4xl font-bold">Athena</h1>
        <p>Yonas Adiel Wiguna&apos;s Blog</p>
        <div className="border-b-4 border-teal-800 w-32 md:w-80" />
      </div>
      <div className={`${styles.container} ${styles.navbar} mx-auto block lg:hidden flex flex-row border-teal-800/50`}>
        <div className={`py-2 px-4 ${nav === NAV_POST ? 'bg-teal-100 border-b-2 border-teal-800' : 'hover:bg-teal-50'}`} onClick={() => setNav(NAV_POST)}>Post</div>
        <div className={`py-2 px-4 ${nav === NAV_INDEX ? 'bg-teal-100 border-b-2 border-teal-800' : 'hover:bg-teal-50 cursor-pointer'}`} onClick={() => setNav(NAV_INDEX)}>Index</div>
      </div>
      <div className={`${styles.container} ${styles.body} mx-auto`}>
        <div className={`${styles.main} block lg:hidden`}>
          {nav === NAV_POST && <>
            {!!slug && (<Link href="/athena"><div className="mt-5 underline">&lt;- Kembali</div></Link>)}
            {postsToShow.map((p) => <PostComponent key={p.slug} post={p} {...postProps} />)}
          </>}
          {nav === NAV_INDEX && <Index allPosts={allPosts} />}
        </div>
        <div className={`${styles.main} hidden lg:block`}>
          {!!slug && (<Link href="/athena"><div className="mt-5">&lt; Lihat semua</div></Link>)}
          {postsToShow.map((p) => <PostComponent key={p.slug} post={p} {...postProps} />)}
        </div>
        <div className={`${styles.side} hidden lg:block`}>
          <Index allPosts={allPosts} />
        </div>
      </div>
    </main>
  )
}

export default Athena
