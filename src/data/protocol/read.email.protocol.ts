import { type EmailData } from '../../googleapi/protocols/google.api.protocol'

export interface IReadEmail {
  perform: () => Promise<Email[]>
}

export interface Filtered {
  message: EmailData
  subject: string
}

export interface Email {
  body: string
  subject: string
  id: string
}
