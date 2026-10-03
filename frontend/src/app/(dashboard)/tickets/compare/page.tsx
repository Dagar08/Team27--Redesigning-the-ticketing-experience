import type { Metadata } from 'next'
import { TicketCompareClient } from '@/features/tickets/components/TicketCompareClient'

export const metadata: Metadata = {
  title: 'Compare tickets',
}

export default function TicketComparePage() {
  return <TicketCompareClient />
}