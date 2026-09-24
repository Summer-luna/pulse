import { graphql } from '@/graphql/generated'
import type { CreateCustomerInput, CustomerFieldsFragment, UpdateCustomerInput } from '@/graphql/generated/graphql'
import { graphqlClient } from './graphql-client'

const CustomersQuery = graphql(`
  query Customers {
    customers {
      ...CustomerFields
    }
  }
`)

const CreateCustomerMutation = graphql(`
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      ...CustomerFields
    }
  }
`)

const UpdateCustomerMutation = graphql(`
  mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      ...CustomerFields
    }
  }
`)

const DeleteCustomerMutation = graphql(`
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id) {
      id
    }
  }
`)

class CustomerRepository {
  async list(): Promise<CustomerFieldsFragment[]> {
    const data = await graphqlClient.request(CustomersQuery)
    return data.customers
  }

  async create(input: CreateCustomerInput): Promise<CustomerFieldsFragment> {
    const data = await graphqlClient.request(CreateCustomerMutation, { input })
    return data.createCustomer
  }

  async update(id: string, input: UpdateCustomerInput): Promise<CustomerFieldsFragment> {
    const data = await graphqlClient.request(UpdateCustomerMutation, { id, input })
    return data.updateCustomer
  }

  async remove(id: string): Promise<void> {
    await graphqlClient.request(DeleteCustomerMutation, { id })
  }
}

export const customerRepository = new CustomerRepository()
