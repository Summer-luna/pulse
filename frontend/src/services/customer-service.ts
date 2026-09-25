import type { Customer } from '@/domain/types'
import type { CreateCustomerInput, CustomerStatus, CustomerTier, UpdateCustomerInput } from '@/graphql/generated/graphql'
import { customerRepository } from '@/repositories/customer-repository'

export interface CustomerDraft {
  name: string
  status: CustomerStatus
  tier: CustomerTier | null
  annualRevenue: number | null
  size: string
  domains: string[]
  ownerId: string | null
}

class CustomerService {
  list(): Promise<Customer[]> {
    return customerRepository.list()
  }

  get(id: string): Promise<Customer> {
    return customerRepository.get(id)
  }

  create(draft: CustomerDraft): Promise<Customer> {
    return customerRepository.create(this.toCreateInput(draft))
  }

  update(id: string, input: UpdateCustomerInput): Promise<Customer> {
    return customerRepository.update(id, input)
  }

  remove(id: string): Promise<void> {
    return customerRepository.remove(id)
  }

  emptyDraft(): CustomerDraft {
    return { name: '', status: 'ACTIVE', tier: null, annualRevenue: null, size: '', domains: [], ownerId: null }
  }

  toCreateInput(draft: CustomerDraft): CreateCustomerInput {
    const name = draft.name.trim()
    if (!name) {
      throw new Error('Customer name is required')
    }
    return {
      name,
      status: draft.status,
      tier: draft.tier,
      annualRevenue: draft.annualRevenue,
      size: draft.size.trim() || null,
      domains: draft.domains,
      ownerId: draft.ownerId,
    }
  }

  filter(customers: Customer[], search: string): Customer[] {
    const needle = search.trim().toLowerCase()
    return needle ? customers.filter((customer) => customer.name.toLowerCase().includes(needle)) : customers
  }
}

export const customerService = new CustomerService()
