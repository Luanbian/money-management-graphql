import { type gmail_v1 } from 'googleapis'

export interface IGoogleApi {
  getGmail: () => Promise<gmail_v1.Gmail>
}
