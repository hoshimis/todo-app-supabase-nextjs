import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetServerSideProps, NextPage } from 'next'
import { Layout } from './../components/Layout'
import { supabase } from './../utils/supabase'
import { Task, Notice } from '../types/types'
import { useState, useEffect } from 'react'

const Csr: NextPage = () => {
  // クライアントサイドでフェッチを行うためその状態を保持するステートを宣言
  const [tasks, setTasks] = useState<Task[]>([])
  const [notices, setNotices] = useState<Notice[]>([])

  // このページがマウントされたときにフェッチを行う
  // 初回だけ実行されればいいので第二引数は空
  useEffect(() => {
    const getTasks = async () => {
      const { data: tasks } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: true })
      setTasks(tasks as Task[])
    }
    const getNotices = async () => {
      const { data: notices } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: true })
      setNotices(notices as Notice[])
    }

    getTasks()
    getNotices()
  }, [])

  const router = useRouter()

  return (
    <Layout title="CSR">
      <p className="mb-3 text-blue-500">SSG + CSF</p>

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
      <Link href="/ssr" prefetch={false}>
        <a className="mv-3 text-xs">Link to-ssr</a>
      </Link>
      <Link href="/isr" prefetch={false}>
        <a className="mv-3 text-xs">Link to-isr</a>
      </Link>
      <button className="text-x3 mb-3" onClick={() => router.push('/ssr')}>
        Route to ssr
      </button>
      <button className="text-x3 mb-3" onClick={() => router.push('/isr')}>
        Route to isr
      </button>
    </Layout>
  )
}

export default Csr
