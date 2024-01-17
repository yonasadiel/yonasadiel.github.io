import { readAllPosts } from 'lib/athena/post'
import PostComponent from 'components/athena/Post'

const AthenaPage = async () => {
  const allPosts = await readAllPosts()

  return (
    <>
      <title>Athena: Yonas&apos; Blog</title>
      {allPosts.map((p) => <PostComponent key={p.slug} post={p} />)}
    </>
  )
}

export default AthenaPage
