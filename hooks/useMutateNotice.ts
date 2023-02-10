import { useQueryClient, useMutation } from 'react-query'
import useStore from '../store'
import { supabase } from '../utils/supabase'
import { Notice, EditedNotice } from '../types/types'

export const useMutateNotice = () => {
  const queryClient = useQueryClient()
  // zustandからresetを呼び出す
  const reset = useStore((state) => state.resetEditedNotice)
  // Noticeの新規作成のための関数
  const createNoticeMutation = useMutation(
    async (notice: Omit<Notice, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('notices').insert(notice)
      if (error) {
        throw new Error(error.message)
      }
      return data
    },
    {
      // 成功した場合
      onSuccess: (res) => {
        const previousNotices = queryClient.getQueryData<Notice[]>(['notices'])
        if (previousNotices) {
          // 既存のnoticesのキャッシュがあれば展開してから一番最後の要素に追加して更新しなおす
          queryClient.setQueryData(['notices'], [...previousNotices, res[0]])
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
  const updateNoticeMutation = useMutation(
    async (notice: EditedNotice) => {
      const { data, error } = await supabase
        .from('notices')
        .update({ content: notice.content })
        .eq('id', notice.id)
      if (error) {
        throw new Error(error.message)
      }
      return data
    },
    {
      onSuccess: (res, variables) => {
        const previousNotices = queryClient.getQueryData<Notice[]>(['notices'])
        if (previousNotices) {
          queryClient.setQueryData(
            ['notices'],
            previousNotices.map((notice) =>
              notice.id === variables.id ? res : notice
            )
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
  const deleteNoticeMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
      return data
    },
    {
      onSuccess: (_, variables) => {
        const previousNotices = queryClient.getQueryData<Notice[]>(['notices'])
        if (previousNotices) {
          queryClient.setQueryData(
            ['notices'],
            previousNotices.filter((notice) => notice.id !== variables)
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
  return { deleteNoticeMutation, createNoticeMutation, updateNoticeMutation }
}
