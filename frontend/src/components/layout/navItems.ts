import { LayoutDashboard, Settings, Ticket, User, Users, type LucideIcon } from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  /** Shorter label for the mobile tab bar. */
  shortLabel?: string
  icon: LucideIcon
}

/** Main navigation, shared by the desktop Sidebar and the MobileNav tab bar. Add links here. */
export const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', shortLabel: 'Home', icon: LayoutDashboard },
  { href: '/tickets', label: 'Tickets', icon: Ticket },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}
