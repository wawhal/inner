'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from './store'
import { nanoid } from 'nanoid'
import type { Note } from './types'

export const useAreas = () =>
  useQuery({
    queryKey: ['areas'],
    queryFn: () => db.areas.toArray()
  })

export const useInsights = () =>
  useQuery({
    queryKey: ['insights'],
    queryFn: () => db.insights.orderBy('createdAt').reverse().limit(10).toArray()
  })

export const useActions = () =>
  useQuery({
    queryKey: ['actions'],
    queryFn: () => db.actions.orderBy('createdAt').reverse().limit(10).toArray()
  })

export const useNotesByArea = (areaId: string | null) =>
  useQuery({
    queryKey: ['notes', areaId],
    queryFn: () => (areaId ? db.notes.where('areaId').equals(areaId).toArray() : []),
    enabled: Boolean(areaId)
  })

export const useCreateNote = (areaId: string | null) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (content: string) => {
      if (!areaId) throw new Error('area required')
      const note: Note = {
        id: nanoid(),
        areaId,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        meta: { source: 'user' }
      }
      await db.notes.add(note)
      return note
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes', areaId] })
      await queryClient.invalidateQueries({ queryKey: ['areas'] })
    }
  })
}
