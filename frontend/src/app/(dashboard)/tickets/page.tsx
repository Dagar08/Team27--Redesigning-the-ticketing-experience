import type { Metadata } from 'next'
import { TicketBrowseClient } from '@/features/tickets/components/TicketBrowseClient'

export const metadata: Metadata = {
  title: 'Tickets',
}

export default function TicketsPage() {
  return <TicketBrowseClient />
}
