// Import Push SDK & Ethers
import { PushAPI} from '@pushprotocol/restapi'
import { ENV } from '@pushprotocol/restapi/src/lib/constants'

export function initiatePush(signer: any, setPushUser: any) {
  return async () => {
    // Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
    const userAlice = await PushAPI.initialize(signer, {env: ENV.STAGING})
    setPushUser(userAlice);

    // List inbox notifications
    const inboxNotifications = await userAlice.notification.list('INBOX')

    // Push channel address
    const pushChannelAdress = '0xB88460Bb2696CAb9D66013A05dFF29a28330689D'

    // Subscribe to push channel
    await userAlice.notification.subscribe(
      `eip155:5:${pushChannelAdress}` // channel address in CAIP format
    )

  }
}
