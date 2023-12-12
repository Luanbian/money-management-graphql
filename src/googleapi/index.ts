import { type OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import * as fs from 'fs/promises'
import * as path from 'path'
import { authenticate } from '@google-cloud/local-auth'
import { type GoogleGmailAdapter, type IGoogleApi } from './protocols/google.api.protocol'

export class GoogleApi implements IGoogleApi {
  private readonly Token_PATH = path.join(__dirname, '../../token.json')
  private readonly scope = ['https://www.googleapis.com/auth/gmail.readonly']
  private readonly credentials = path.join(__dirname, '../../credentials.json')

  public async getGmail (): Promise<GoogleGmailAdapter> {
    const auth = await this.authorize()
    const gmail = google.gmail({ version: 'v1', auth })
    return {
      users: {
        messages: {
          list: async (props) => await gmail.users.messages.list(props),
          get: async (props) => await gmail.users.messages.get(props)
        }
      }
    } as GoogleGmailAdapter
  }

  private async authorize (): Promise<OAuth2Client> {
    let client = await this.loadSavedCredentialsIfExist()
    if (client !== null) {
      return client
    }
    client = await authenticate({
      scopes: this.scope,
      keyfilePath: this.credentials
    })
    if (client.credentials !== null) {
      await this.saveCredentials(client)
    }
    return client
  }

  private async loadSavedCredentialsIfExist (): Promise<any> {
    const content = await fs.readFile(this.Token_PATH)
    const credentials = JSON.parse(content.toString())
    return google.auth.fromJSON(credentials)
  }

  private async saveCredentials (client: OAuth2Client): Promise<void> {
    const content = await fs.readFile(this.credentials)
    const keys = JSON.parse(content.toString())
    const key = keys.installed ?? keys.web
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token
    })
    await fs.writeFile(this.Token_PATH, payload)
  }
}
const googleApi = new GoogleApi()
export default googleApi
