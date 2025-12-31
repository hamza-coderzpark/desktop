import { Repository } from '../models/repository'
import { Account, isDotComAccount } from '../models/account'
import { getAccountForEndpoint } from './api'

/**
 * Get the authenticated account for the repository based on its endpoint.
 *
 * @param activeAccount Optional. The currently active GitHub.com account.
 *                      If provided, and the repository is a GitHub.com repository,
 *                      this account will be returned if it matches the endpoint.
 */
export function getAccountForRepository(
  accounts: ReadonlyArray<Account>,
  repository: Repository,
  activeAccount?: Account | null
): Account | null {
  const gitHubRepository = repository.gitHubRepository
  if (!gitHubRepository) {
    return null
  }

  // If we have an active account provided, and the repository is a dotcom repository,
  // we prefer the active account.
  if (
    activeAccount &&
    isDotComAccount(activeAccount) &&
    activeAccount.endpoint === gitHubRepository.endpoint
  ) {
    return activeAccount
  }

  return getAccountForEndpoint(accounts, gitHubRepository.endpoint)
}
