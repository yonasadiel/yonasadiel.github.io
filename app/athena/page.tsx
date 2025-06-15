import PostComponent from 'app/athena/_components/Post'
import { readAllPosts } from 'app/athena/_lib/post'

const AthenaPage = async () => {
  const allPosts = await readAllPosts()

  return (
    <>
      <title>Athena: Yonas&apos; Blog</title>
      {allPosts.map((p) => <PostComponent key={p.slug} post={p} initialCollapsed={true} />)}
    </>
  )
}

export default AthenaPage
