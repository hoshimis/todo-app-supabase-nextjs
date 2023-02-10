import { useQueryClient, useMutation } from 'react-query'
import useStore from '../store'
import { supabase } from '../utils/supabase'
import { Task, EditedTask } from '../types/types'

export const useMutateTask = () => {
  const queryClient = useQueryClient()
  // zustandからresetを呼び出す
  const reset = useStore((state) => state.resetEditedTask)
  // taskの新規作成のための関数
  const createTaskMutation = useMutation(
    async (task: Omit<Task, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('todos').insert(task)
      if (error) {
        throw new Error(error.message)
      }
      return data
    },
    {
      // 成功した場合
      onSuccess: (res) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['todos'])
        if (previousTodos) {
          // 既存のtodosのキャッシュがあれば展開してから一番最後の要素に追加して更新しなおす
          queryClient.setQueryData(['todos'], [...previousTodos, res[0]])
        }
        reset()
      },
      // 失敗した場合
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  // 呼び出されるときに変更したい新しいタスクの内容を引数に渡す
  const updateTaskMutation = useMutation(
    async (task: EditedTask) => {
      const { data, error } = await supabase
        .from('todos')
        .update({ title: task.title })
        .eq('id', task.id)
      if (error) {
        throw new Error(error.message)
      }
      return data
    },
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['todos'])
        if (previousTodos) {
          queryClient.setQueryData(
            ['todos'],
            previousTodos.map((task) => (task.id === variables.id ? res : task))
          )
        }
        reset()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )

  // 削除するタスクのIDを引数に指定する
  const deleteTaskMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase.from('todos').delete().eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
      return data
    },
    {
      onSuccess: (_, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['todos'])
        if (previousTodos) {
          queryClient.setQueryData(
            ['todos'],
            previousTodos.filter((task) => task.id !== variables)
          )
        }
        reset()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )

  // 上記3つの関数をreactコンポーネントで使用できるようにする。
  return { deleteTaskMutation, createTaskMutation, updateTaskMutation }
}
