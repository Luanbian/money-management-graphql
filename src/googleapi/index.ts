import { type OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import * as fs from 'fs/promises'
import * as path from 'path'
import { authenticate } from '@google-cloud/local-auth'

export class GoogleApi {
  private readonly Token_PATH = path.join(__dirname, '../../token.json')
  private readonly scope = ['https://www.googleapis.com/auth/gmail.readonly']
  private readonly credentials = path.join(__dirname, '../../credentials.json')

  public async list (): Promise<any> {
    const auth = await this.authorize()
    const gmail = google.gmail({ version: 'v1', auth })
    const res = await gmail.users.messages.list({
      userId: 'me'
    })
    return res
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
