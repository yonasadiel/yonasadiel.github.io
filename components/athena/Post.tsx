'use client'

import { useMemo, useState, ReactNode } from 'react'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { decryptKey, decryptPost } from 'lib/athena/decrypt'
import { useAthenaState } from 'lib/athena/state'
import { Post } from 'lib/athena/post'
import PasswordModal from './PasswordModal'
import styles from './Post.module.scss'
import './Post.scss'

const month = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
const formatDate = (date: Date): string =>  `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`

interface PostProps {
  post: Post
  initialCollapsed?: boolean
}

const PostComponent = (props: PostProps) => {
  const { post, initialCollapsed } = props;
  const [athena, setAthena] = useAthenaState({ userKeys: [] })
  const [collapsed, setCollapsed] = useState(initialCollapsed)
  const [actualContent, locked] = useMemo(() => {
    if (!!post.meta.iv) {
      if (!athena.userKeys) return ['', true]
      for (let i = 0; i < athena.userKeys.length; i++) {
        const key = decryptKey(post.meta, athena.userKeys[i])
        if (!!key) return [decryptPost(post.content, post.meta, key), false]
      }
      return ['', true]
    }
    return [post.content, false]
  }, [post.meta, athena.userKeys])
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const handleNewPassword = (password: string | null) => {
    setIsPasswordModalOpen(false)
    if (!!password) {
      setAthena({ ...athena, userKeys: [...(athena.userKeys || []), password].filter((v, i, a) => a.indexOf(v) === i) })
    }
  }

  return (
    <div className={`pt-8 pb-2 ${styles.post} border-teal-800/50 ${collapsed && !locked ? styles.collapsed : ''}`} id={post.slug}>
      <PasswordModal isOpen={isPasswordModalOpen} onSubmit={handleNewPassword} />
      <Link passHref href={`/athena/post/${post.slug}`}><h1 className="text-2xl font-bold">{post.title}</h1></Link>
      <small className="text-neutral-400">{formatDate(post.date)} | {post.meta?.category || ''}</small>
      <div className="mb-2"/>
      <div className={`${styles.mdContainer} relative place-content-center`}>
        <Markdown
          className={`${styles.md} md ${locked ? styles.locked : ''}`}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ node, ...rest }) => <h1 id={heading(rest.children)} {...rest} />,
            h2: ({ node, ...rest }) => <h2 id={heading(rest.children)} {...rest} />,
            h3: ({ node, ...rest }) => <h3 id={heading(rest.children)} {...rest} />,
            h4: ({ node, ...rest }) => <h4 id={heading(rest.children)} {...rest} />,
            h5: ({ node, ...rest }) => <h5 id={heading(rest.children)} {...rest} />,
            h6: ({ node, ...rest }) => <h6 id={heading(rest.children)} {...rest} />,
          }}>
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
              <button type="button" className="bg-teal-700 text-white py-1 px-3 rounded hover:bg-teal-600" onClick={() => setIsPasswordModalOpen(true)}>Unlock</button>
            </div>
          </div>
        )}
        {collapsed && !locked && (
          <div className={`${styles.expandButton} absolute left-0 right-0 flex justify-center items-center`}>
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className={`py-1 px-4 bg-teal-700 rounded text-white hover:bg-teal-600`}>
              Expand
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const heading = (p: ReactNode) => p?.toString()

export default PostComponent