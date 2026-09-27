import type { ReactNode } from 'react'
import { TicketExplorerProvider } from '@/features/tickets/components/TicketExplorerProvider'

export default function TicketsLayout({ children }: { children: ReactNode }) {
  return <TicketExplorerProvider>{children}</TicketExplorerProvider>
}
