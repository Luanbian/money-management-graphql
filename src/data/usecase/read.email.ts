import { type EmailData, type IGmailAdapter } from '../../googleapi/protocols/google.api.protocol'
import { htmlToText } from 'html-to-text'
import { makeGmailAdapter } from '../../main/factories/adapter.factory'
import { type Filtered, type Email, type IReadEmail } from '../protocol/read.email.protocol'

export class ReadEmail implements IReadEmail {
  constructor (private readonly gmail: IGmailAdapter) {}

  public async perform (): Promise<Email[]> {
    const messages = await this.gmail.getDataMessage()
    const filteredMessages = await this.filterByKeyword(messages)
    return filteredMessages.map(msg => {
      return {
        id: msg.message.id,
        body: this.getBody(msg.message),
        subject: msg.subject
      }
    })
  }

  private async filterByKeyword (messages: EmailData[]): Promise<Filtered[]> {
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
