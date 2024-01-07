'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import Markdown from 'react-markdown'
import { FormLabel, Modal, ModalDialog, Input, Button } from '@mui/joy'
import { useDelayed } from '../../lib/hooks'
import { decryptKey, decryptPost } from '../../lib/athena/decrypt'
import { useAthenaState } from '../../lib/athena/state'
import styles from './styles.module.scss'

type Post = {
  title: string
  date: Date
  slug: string
  meta: { [key: string]: string }
  content: string // markdown
}

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

const month = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
const formatDate = (date: Date): string =>  `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`

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
          {nav === NAV_POST && postsToShow.map((p) => <Post key={p.slug} post={p} {...postProps} />)}
          {nav === NAV_INDEX && <Index allPosts={allPosts} />}
        </div>
        <div className={`${styles.main} hidden lg:block`}>
          {postsToShow.map((p) => <Post key={p.slug} post={p} {...postProps} />)}
        </div>
        <div className={`${styles.side} hidden lg:block`}>
          <Index allPosts={allPosts} />
        </div>
      </div>
    </main>
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
  userKeys: string[]
  onUnlockPost: () => void
}

const Post = (props: PostProps) => {
  const { post, userKeys, onUnlockPost } = props;
  const [actualContent, locked] = useMemo(() => {
    if (!!post.meta.iv) {
      if (!userKeys) return ['', true]
      for (let i = 0; i < userKeys.length; i++) {
        const key = decryptKey(post.meta, userKeys[i])
        if (!!key) return [decryptPost(post.content, post.meta, key), false]
      }
      return ['', true]
    }
    return [post.content, false]
  }, [post.meta, userKeys])

  return (
    <div className={`pt-8 pb-2 ${styles.post} border-teal-800/50`} id={post.slug}>
      <h2 className="text-xl font-bold">{post.title}</h2>
      <small className="text-neutral-400">{formatDate(post.date)} | {post.meta?.category || ''}</small>
      <div className="mb-2"/>
      <div className="relative place-content-center">
        <Markdown className={`${styles.md} ${locked ? styles.locked : ''}`}>
          {locked
            ? 'Maxime voluptas provident quam voluptatem sit. Corporis nam rerum debitis. ' +
              'Iure minus iusto nisi minus quisquam expedita. Et doloribus rerum et praesentium et reiciendis deleniti. ' +
              'Laboriosam maiores incidunt minus. Facere qui atque vitae fugiat ipsam sint sequi perspiciatis. ' +
              'Velit repudiandae et eligendi nihil quas dolorum non. ' +
              'Deleniti iusto omnis minus soluta accusantium corporis quis inventore. '+
              'Repellat aliquid nesciunt a temporibus qui amet tenetur ratione. Modi consequatur rerum qui culpa ea et. ' +
              'Dolorem cumque aliquid sequi et autem aliquid. Vel sed aut aliquid est repudiandae omnis. Odit officiis non sint. ' +
              'Nisi qui consequatur sunt. Explicabo inventore impedit sed est. Voluptate sed porro optio. ' +
              'Dolores eligendi culpa est vitae et placeat magni vero. Molestias nisi dolorum quo quasi.'
            : actualContent}
        </Markdown>
        {locked && (
          <div className={`absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center`}>
            <div className={`${styles.lockBox} rounded py-2 px-4 flex flex-col justify-center items-center`}>
              <p>This post is password locked</p>
              <button type="button" className="bg-teal-700 text-white py-1 px-3 rounded" onClick={onUnlockPost}>Unlock</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface PasswordModalProps {
  isOpen: boolean
  onSubmit: (password: string | null) => void
}

const PasswordModal = (props: PasswordModalProps) => {
  const { isOpen, onSubmit } = props
  const [password, setPassword] = useState('')
  return (
    <Modal open={isOpen} onClose={() => onSubmit(null)}>
      <ModalDialog>
        <FormLabel>Password</FormLabel>
        <Input onChange={(e) => setPassword(e.currentTarget.value)} autoFocus />
        <Button onClick={() => onSubmit(password)}>Submit</Button>
      </ModalDialog>
    </Modal>
  )
}

export default Athena
