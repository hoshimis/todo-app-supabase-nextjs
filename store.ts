import create from 'zustand'
import { EditedTask, EditedNotice } from './types/types'

// 状態管理用のオブジェクト、更新用の関数をまとめて定義する
type State = {
  editedTask: EditedTask
  editedNotice: EditedNotice
  updateEditedTask: (payload: EditedTask) => void
  updateEditedNotice: (payload: EditedNotice) => void
  resetEditedTask: () => void
  resetEditedNotice: () => void
}

const useStore = create<State>((set) => ({
  editedTask: { id: '', title: '' },
  editedNotice: { id: '', content: '' },
  // stateに値を入力する
  updateEditedTask: (payload) =>
    set({
      editedTask: {
        id: payload.id,
        title: payload.title,
      },
    }),
  // stateの値をリセットする
  resetEditedTask: () => set({ editedTask: { id: '', title: '' } }),

  updateEditedNotice: (payload) =>
    set({
      editedNotice: {
        id: payload.id,
        content: payload.content,
      },
    }),

  resetEditedNotice: () => set({ editedNotice: { id: '', content: '' } }),
}))

export default useStore
