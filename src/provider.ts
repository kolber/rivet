import { EventEmitter } from 'eventemitter3'
import { type EIP1193Provider, UnknownRpcError } from 'viem'

import { UserRejectedRequestError } from '~/errors'
import type { Messenger } from '~/messengers'
import type { RpcRequest } from '~/messengers/schema'

const providerCache = new Map<string, EIP1193Provider>()
export function getProvider({
  messenger,
  rpcUrl,
}: { messenger: Messenger; rpcUrl?: string }): EIP1193Provider {
  const cachedProvider = rpcUrl
    ? providerCache.get(`${messenger.name}.${rpcUrl}`)
    : undefined
  if (cachedProvider) return cachedProvider

  const emitter = new EventEmitter()

  // Workaround for id conflicts between inpage & wallet.
  let _id = Math.floor(Math.random() * 10000)

  messenger.reply('accountsChanged', async (accounts) => {
    emitter.emit('accountsChanged', accounts)
  })

  messenger.reply('chainChanged', async (chainId) => {
    emitter.emit('chainChanged', chainId)
  })

  messenger.reply('connect', async ({ chainId }) => {
    emitter.emit('connect', { chainId })
  })

  const provider: EIP1193Provider = {
    on: emitter.on.bind(emitter),
    removeListener: emitter.removeListener.bind(emitter),
    async request({ method, params }) {
      const id = _id++
      const { result, error, ...response } = await messenger.send(
        'request',
        {
          request: {
            method,
            params,
            id,
          } as RpcRequest,
          rpcUrl,
        },
        { id },
      )
      if (response.id !== id) return
      if (error) {
        if (error.code === UserRejectedRequestError.code)
          throw new UserRejectedRequestError(error)
        throw new UnknownRpcError(error)
      }
      return result
    },
  }
  if (rpcUrl) providerCache.set(rpcUrl, provider)
  return provider
}
