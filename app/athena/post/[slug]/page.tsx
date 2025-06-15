import { ROUTE_ATHENA } from 'app/_lib/route_const'
import PostComponent from 'app/athena/_components/Post'
import { readAllPosts } from 'app/athena/_lib/post'
import Link from 'next/link'

export const generateStaticParams = () => readAllPosts()
  .then((posts) => posts.map((p) => ({ slug: p.slug })))

const AthenaSingle = async ({ params: { slug } }: { params: { slug: string }}) => {
  const post = await readAllPosts().then((posts) => posts.find((p) => p.slug === slug))
  if (!post) return <p>Not Found</p>

  return (
    <>
      <title>{`${post.title} | Athena: Yonas\' Blog`}</title>
      <Link passHref href={ROUTE_ATHENA}><div className="mt-5">&lt; Lihat semua</div></Link>
      <PostComponent post={post} initialCollapsed={false} />
    </>
  )
}

export default AthenaSingle;
