import { useQuery } from '@tanstack/react-query'
import { resourceApi } from '@/api/resources'

export const useResources = (filters) =>
  useQuery({
    queryKey: ['resources', filters],
    queryFn: async () => {
      const { data } = await resourceApi.list(filters)
      return data.data
    },
    keepPreviousData: true,
  })
