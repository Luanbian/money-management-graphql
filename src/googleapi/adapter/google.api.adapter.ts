import googleApi from '..'
import { type messageIds, type GoogleGmailAdapter, type EmailData, type IGmailAdapter } from '../protocols/google.api.protocol'

export class GoogleApiAdapter implements IGmailAdapter {
  public async getDataMessage (): Promise<EmailData[]> {
    const gmail = await this.initializeGmail()
    const messageIds = await this.getMessageId(gmail)
    const promise = messageIds.map(async ({ id }) => {
      return await gmail.users.messages.get({
        userId: 'me',
        id,
        format: 'full'
      })
    })
    const result = await Promise.all(promise)
    const payload = result.map(({ data }) => {
      return {
        data: {
          id: data.id,
          payload: data.payload
        }
      }
    })
    const data = payload.map(({ data }) => {
      return {
        body: data.payload.body.data,
        header: data.payload.headers,
        id: data.id
      }
    })
    return data
  }

  private async getMessageId (gmail: GoogleGmailAdapter): Promise<messageIds[]> {
    const { data } = await gmail.users.messages.list({
      userId: 'me',
      q: 'in:inbox'
    })
    return data.messages
  }

  private async initializeGmail (): Promise<GoogleGmailAdapter> {
    return await googleApi.getGmail()
  }
}
