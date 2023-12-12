import { type EmailData, type IGmailAdapter } from '../../googleapi/protocols/google.api.protocol'
import { htmlToText } from 'html-to-text'
import { makeGmailAdapter } from '../../main/factories/adapter.factory'

export class ReadEmail {
  constructor (private readonly gmail: IGmailAdapter) {}

  public async perform (): Promise<Array<{
    body: string
    subject: string
  }>> {
    const messages = await this.gmail.getDataMessage()
    const filteredMessages = await this.filterByKeyword(messages)
    return filteredMessages.map(msg => {
      return {
        body: this.getBody(msg.message),
        subject: msg.subject
      }
    })
  }

  private async filterByKeyword (messages: EmailData[]): Promise<Array<{
    message: EmailData
    subject: string
  }>> {
    const keywords: string[] = ['interrompeu']
    const filterMessages = await Promise.all(messages.map(async (msg) => {
      const subject = await this.getHeader(msg, 'Subject')
      const hasKeyword = keywords.some(keyword => subject.toLowerCase().includes(keyword))
      return { message: msg, hasKeyword, subject }
    }))
    return filterMessages
      .filter(({ hasKeyword }) => hasKeyword)
      .map(({ message, subject }) => {
        return {
          message,
          subject
        }
      })
  }

  private async getHeader (message: EmailData, name: string): Promise<string> {
    return message.header.find((head) => head.name === name)?.value as string
  }

  private getBody (msg: EmailData): string {
    const body = msg.body
    const decoded = Buffer.from(body, 'base64').toString()
    const readable = htmlToText(decoded)
    return readable
  }
}
const gmail = makeGmailAdapter()
const usecase = new ReadEmail(gmail)
usecase.perform().then(() => { console.log('object') }).catch(() => {})
