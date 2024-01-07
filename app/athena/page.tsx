'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import Markdown from 'react-markdown'
import { useDelayed } from '../../lib/hooks'
import styles from './styles.module.scss'

type Post = {
  title: string
  date: Date
  slug: string
  meta: { [key: string]: string }
  content: string // markdown
}

type PostIndex = { list: string[] }

const fetchAllPosts = () => fetch("/posts/index.json")
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

const month = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
const formatDate = (date: Date): string =>  `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`

const NAV_POST = 'post'
const NAV_INDEX = 'index'

interface AthenaProps {
  params: { slug?: string[] }
}

const Athena = () => {
  const searchParams = useSearchParams();
  const allPosts = useDelayed(fetchAllPosts, [], [])
  const [nav, setNav] = useState<string>(NAV_POST)
  const slug = searchParams.get('slug') || ''
  const postsToShow = (!!slug ? allPosts?.filter((p) => p.slug === slug) : allPosts) || []

  return (
    <div className={styles.athena}>
        <title>
          {!!slug && postsToShow.length === 1
        ? `${postsToShow[0].title} | Athena: Yonas\' Blog`
        : 'Athena: Yonas\' Blog'}
        </title>
      <div className={`${styles.container} ${styles.head} mx-auto py-6`}>
        <h1 className="text-4xl font-bold">Athena</h1>
        <p>Yonas Adiel Wiguna&apos;s Blog</p>
      </div>
      <div className={`${styles.container} ${styles.navbar} mx-auto block lg:hidden flex flex-row`}>
        <div className={`${styles.navbarItem} ${nav === NAV_POST ? styles.active : ''}`} onClick={() => setNav(NAV_POST)}>Post</div>
        <div className={`${styles.navbarItem} ${nav === NAV_INDEX ? styles.active : ''}`} onClick={() => setNav(NAV_INDEX)}>Index</div>
      </div>
      <div className={`${styles.container} ${styles.body} mx-auto`}>
        <div className={`${styles.main} block lg:hidden`}>
          {nav === NAV_POST && postsToShow.map((p) => <Post key={p.slug} post={p} />)}
          {nav === NAV_INDEX && <Index allPosts={allPosts} />}
        </div>
        <div className={`${styles.main} hidden lg:block`}>
          {postsToShow.map((p) => <Post key={p.slug} post={p} />)}
        </div>
        <div className={`${styles.side} hidden lg:block`}>
          <Index allPosts={allPosts} />
        </div>
      </div>
    </div>
  )
}

interface IndexProps {
  allPosts: Post[]
}

const Index = (props: IndexProps) => {
  const { allPosts } = props;
  return (
    <div className="pt-8">
      {allPosts
        .map((p) => p.date.getFullYear())
        .filter((p, i, a) => a.indexOf(p) === i)
        .map((yr) => allPosts.filter((p) => p.date.getFullYear() === yr))
        .sort((a, b) => a > b ? 1 : -1)
        .map((pl) => (
          <div key={pl[0].date.getFullYear()} className="pb-3">
            <h4 className="font-bold">{pl[0].date.getFullYear()}</h4>
            <div>
              {pl.sort((a, b) => a.date < b.date ? 1 : -1).map((p) =>
                <Link href={`/athena?slug=${p.slug}`} className="block hover:underline mb-3" key={p.slug}>{p.title}</Link>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}

interface PostProps {
  post: Post
}

const Post = (props: PostProps) => {
  const { post } = props;
  return (
    <div className={`pt-8 pb-2 ${styles.post}`} id={post.slug}>
      <h2 className="text-xl font-bold">{post.title}</h2>
      <small className="text-neutral-400">{formatDate(post.date)} | {post.meta?.category || ''}</small>
      <div className="mb-2"/>
      <Markdown className={styles.md}>{post.content}</Markdown>
    </div>
  )
}

export default Athena
