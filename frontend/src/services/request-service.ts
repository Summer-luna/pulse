import type { CustomerRequest } from '@/domain/types'
import type { CreateRequestInput, RequestSource, UpdateRequestInput } from '@/graphql/generated/graphql'
import { requestRepository } from '@/repositories/request-repository'

export interface RequestDraft {
  projectId: string
  title: string
  description: string
  requestor: string
  source: RequestSource
  customerId: string | null
}

class RequestService {
  list(projectId?: string, customerId?: string): Promise<CustomerRequest[]> {
    return requestRepository.list(projectId, customerId)
  }

  create(draft: RequestDraft): Promise<CustomerRequest> {
    return requestRepository.create(this.toCreateInput(draft))
  }

  update(id: string, input: UpdateRequestInput): Promise<CustomerRequest> {
    return requestRepository.update(id, input)
  }

  remove(id: string): Promise<void> {
    return requestRepository.remove(id)
  }

  convertToIssue(id: string, issueId: string): Promise<CustomerRequest> {
    return requestRepository.convertToIssue(id, issueId)
  }

  emptyDraft(projectId = '', customerId: string | null = null, requestor = ''): RequestDraft {
    return { projectId, title: '', description: '', requestor, source: 'EXTERNAL', customerId }
  }

  toCreateInput(draft: RequestDraft): CreateRequestInput {
    const title = draft.title.trim()
    if (!title) {
      throw new Error('Request title is required')
    }
    if (!draft.requestor.trim()) {
      throw new Error('Requestor is required')
    }
    if (!draft.projectId) {
      throw new Error('Project is required')
    }
    return {
      projectId: draft.projectId,
      title,
      description: draft.description.trim(),
      requestor: draft.requestor.trim(),
      source: draft.source,
      customerId: draft.customerId,
    }
  }
}

export const requestService = new RequestService()
