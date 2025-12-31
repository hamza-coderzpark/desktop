import { describe, it } from 'node:test'
import assert from 'node:assert'
import { Account } from '../../src/models/account'
import { findGitHubTrampolineAccount } from '../../src/lib/trampoline/find-account'
import { getDotComAPIEndpoint } from '../../src/lib/api'

describe('findGitHubTrampolineAccount', () => {
    const userA = new Account('UserA', getDotComAPIEndpoint(), 'tokenA', [], '', 1, 'UserA', 'free')
    const userB = new Account('UserB', getDotComAPIEndpoint(), 'tokenB', [], '', 2, 'UserB', 'free')

    it('prioritizes the active dotcom account for github.com URLs', async () => {
        const mockStore = {
            getAll: async () => [userA, userB],
            getActiveDotComAccount: () => userB
        }

        const account = await findGitHubTrampolineAccount(mockStore as any, 'https://github.com/some/repo.git')
        assert.deepStrictEqual(account, userB)
    })

    it('falls back to any matching account if no active account is set', async () => {
        const mockStore = {
            getAll: async () => [userA, userB],
            getActiveDotComAccount: () => undefined
        }

        const account = await findGitHubTrampolineAccount(mockStore as any, 'https://github.com/some/repo.git')
        // In this case it finds the first one that matches the origin
        assert.ok(account === userA || account === userB)
    })

    it('returns undefined if no accounts match', async () => {
         const mockStore = {
            getAll: async () => [],
            getActiveDotComAccount: () => undefined
        }

        const account = await findGitHubTrampolineAccount(mockStore as any, 'https://github.com/some/repo.git')
        assert.strictEqual(account, undefined)
    })
})
