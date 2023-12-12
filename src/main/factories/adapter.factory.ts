import { GoogleApiAdapter } from '../../googleapi/adapter/google.api.adapter'
import { type IGmailAdapter } from '../../googleapi/protocols/google.api.protocol'

export const makeGmailAdapter = (): IGmailAdapter => {
  return new GoogleApiAdapter()
}
