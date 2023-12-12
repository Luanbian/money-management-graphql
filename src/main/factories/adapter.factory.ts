import { GoogleApi } from '../../googleapi'
import { type IGoogleApi } from '../../googleapi/protocols/google.api.protocol'

export const makeGoogleApiConfig = (): IGoogleApi => {
  return new GoogleApi()
}
