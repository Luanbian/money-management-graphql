import * as fs from 'fs/promises'
import * as path from 'path'
import { authenticate } from '@google-cloud/local-auth'
import { google } from 'googleapis'
import { type OAuth2Client } from 'google-auth-library'

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
const TOKEN_PATH = path.join(__dirname, '../../token.json')
const CREDENTIALS_PATH = path.join(__dirname, '../../credentials.json')

async function loadSavedCredentialsIfExist (): Promise<any> {
  try {
    const content = await fs.readFile(TOKEN_PATH)
    const credentials = JSON.parse(content.toString())
    return google.auth.fromJSON(credentials)
  } catch (err) {
    return null
  }
}

async function saveCredentials (client: OAuth2Client): Promise<void> {
  const content = await fs.readFile(CREDENTIALS_PATH)
  const keys = JSON.parse(content.toString())
  const key = keys.installed ?? keys.web
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token
  })
  await fs.writeFile(TOKEN_PATH, payload)
}

async function authorize (): Promise<OAuth2Client> {
  let client = await loadSavedCredentialsIfExist()
  if (client !== null) {
    return client
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH
  })
  if (client.credentials !== null) {
    await saveCredentials(client)
  }
  return client
}

async function listLabels (auth: OAuth2Client): Promise<any> {
  const gmail = google.gmail({ version: 'v1', auth })
  const res = await gmail.users.messages.list({
    userId: 'me'
  })
  console.log(res.data)
  return res
}

authorize().then(listLabels).catch(console.error)
