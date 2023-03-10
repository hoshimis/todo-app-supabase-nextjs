import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetServerSideProps, NextPage } from 'next'
import { Layout } from './../components/Layout'
import { supabase } from './../utils/supabase'
import { Task, Notice } from '../types/types'

export const getServerSideProps: GetServerSideProps = async () => {
  console.log('getServerSideProps/ssg invoked')
  const { data: tasks } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: true })
  const { data: notices } = await supabase
    .from('notices')
    .select('*')
    .order('created_at', { ascending: true })
  return { props: { tasks, notices } }
}

type StaticProps = {
  tasks: Task[]
  notices: Notice[]
}

const Ssr: NextPage<StaticProps> = ({ tasks, notices }) => {
  const router = useRouter()
  return (
    <Layout title="SSR">
      <p className="mb-3 text-blue-500">SSR</p>

      <ul className="mb-3">
        {tasks.map((task) => (
          <li key={task.id}>
            <p className="text-lg font-extrabold">{task.title}</p>
          </li>
        ))}
      </ul>
      <ul className="mb-3">
        {notices.map((notice) => (
          <li key={notice.id}>
            <p className="text-lg font-extrabold">{notice.content}</p>
          </li>
        ))}
      </ul>
      <Link href="/ssg" className="text-x3 mb-3" prefetch={false}>
        Link to-ssg
      </Link>
      <Link href="/isr" className="text-x3 mb-3" prefetch={false}>
        Link to-isr
      </Link>
      <button className="text-x3 mb-3" onClick={() => router.push('/ssg')}>
        Route to ssg
      </button>
      <button className="text-x3 mb-3" onClick={() => router.push('/isr')}>
        Route to isr
      </button>
    </Layout>
  )
}

export default Ssr
