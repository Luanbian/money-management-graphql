export interface IGoogleApi {
  getGmail: () => Promise<GoogleGmailAdapter>
}

export interface IGmailAdapter {
  getDataMessage: () => Promise<EmailData[]>
}

export interface GmailGetMethod {
  data: {
    id: string
    payload: {
      headers: Array<{ name?: string | null, value?: string | null }>
      body: {
        data: string
      }
    }
  }
}

export interface EmailData {
  body: string
  header: Array<{
    name?: string | null
    value?: string | null
  }>
  id: string
}

export interface messageIds {
  id: string
  threadId: string
}

export interface GoogleGmailAdapter {
  users: {
    messages: {
      get: (props: { userId: string, id: string, format: string }) => Promise<GmailGetMethod>
      list: (props: { userId: string, q: string }) => Promise<{ data: { messages: messageIds[] } }>
    }
  }
}
