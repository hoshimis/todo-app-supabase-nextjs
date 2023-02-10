import { FormEvent, FC } from 'react'
import { supabase } from '../utils/supabase'
import useStore from '../store'
import { useMutateTask } from '../hooks/useMutateTask'

export const TaskForm: FC = () => {
  const { editedTask } = useStore()
  const update = useStore((state) => state.updateEditedTask)
  const { createTaskMutation, updateTaskMutation } = useMutateTask()
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedTask.id === '') {
      createTaskMutation.mutate({
        title: editedTask.title,
        user_id: supabase.auth.user()?.id,
      })
    } else {
      updateTaskMutation.mutate({
        id: editedTask.id,
        title: editedTask.title,
      })
    }
  }

  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        className="focus:outline-one my-2 rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-indigo-500"
        placeholder="New Task ?"
        value={editedTask.title}
        onChange={(e) => update({ ...editedTask, title: e.target.value })}
      />
      <button
        type="submit"
        className="font medium ml-2 rounded bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700"
      >
        {/* idが存在すればupdate そうでなければ create と表示する */}
        {editedTask.id ? 'Update' : 'Create'}
      </button>
    </form>
  )
}
