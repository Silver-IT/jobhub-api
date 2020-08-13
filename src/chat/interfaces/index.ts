export interface PendingMessage {
  message: string;
  createdAt: string;
  email: string;
  project: string;
  chatId?: string;
  recipientName: string;
  senderName: string;
  messageIds: string[];
}
