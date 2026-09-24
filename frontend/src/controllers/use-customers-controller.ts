import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { errorMessage } from '@/lib/error-message'
import { type CustomerDraft, customerService } from '@/services/customer-service'
import { queryKeys } from './query-keys'
import { useRefreshAll } from './use-refresh-all'

export function useCustomersController() {
  const refresh = useRefreshAll()
  const query = useQuery({ queryKey: queryKeys.customers, queryFn: () => customerService.list() })
  const [search, setSearch] = useState('')
  const customers = useMemo(() => customerService.filter(query.data ?? [], search), [query.data, search])

  const remove = useMutation({ mutationFn: (id: string) => customerService.remove(id), onSuccess: refresh })

  return {
    customers,
    total: query.data?.length ?? 0,
    isLoading: query.isLoading,
    error: errorMessage(query.error),
    search,
    setSearch,
    removeCustomer: remove.mutateAsync,
  }
}

export function useCreateCustomerController() {
  const refresh = useRefreshAll()
  const [draft, setDraft] = useState<CustomerDraft>(() => customerService.emptyDraft())
  const create = useMutation({ mutationFn: (value: CustomerDraft) => customerService.create(value), onSuccess: refresh })

  return {
    draft,
    updateDraft: (patch: Partial<CustomerDraft>) => setDraft((current) => ({ ...current, ...patch })),
    submit: () => create.mutateAsync(draft),
    isSubmitting: create.isPending,
    error: errorMessage(create.error),
  }
}
