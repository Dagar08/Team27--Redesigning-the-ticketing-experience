import type { Metadata } from 'next'
import { TicketBrowseClient } from '@/features/tickets/components/TicketBrowseClient'

export const metadata: Metadata = {
  title: 'Browse tickets',
}

export default function TicketsPage() {
  return <TicketBrowseClient />
}
