import PostComponent from 'components/athena/Post'
import { readAllPosts } from 'lib/athena/post'
import { ROUTE_ATHENA } from 'lib/route'
import Link from 'next/link'

export const generateStaticParams = () => readAllPosts()
  .then((posts) => posts.map((p) => ({ slug: p.slug })))

const AthenaSingle = async ({ params: { slug } }: { params: { slug: string }}) => {
  const post = await readAllPosts().then((posts) => posts.find((p) => p.slug === slug))
  if (!post) return <p>Not Found</p>

  return (
    <>
      <title>{`${post.title} | Athena: Yonas\' Blog`}</title>
      <Link href={ROUTE_ATHENA}><div className="mt-5">&lt; Lihat semua</div></Link>
      <PostComponent post={post} />
    </>
  )
}

export default AthenaSingle;