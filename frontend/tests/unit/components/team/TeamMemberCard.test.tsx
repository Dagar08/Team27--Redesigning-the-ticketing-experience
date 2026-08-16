import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TeamMemberCard } from '@/components/team/TeamMemberCard'
import type { TeamMember } from '@/features/team/types'

const baseMember: TeamMember = {
  id: 'jane-doe',
  name: 'Jane Doe',
  role: 'Developer',
  blurb: 'Builds things.',
}

describe('TeamMemberCard', () => {
  it('renders the name, role, and blurb', () => {
    render(<TeamMemberCard member={baseMember} />)

    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Developer')).toBeInTheDocument()
    expect(screen.getByText('Builds things.')).toBeInTheDocument()
  })

  it('falls back to initials when no photoUrl is provided', () => {
    render(<TeamMemberCard member={baseMember} />)

    expect(screen.getByText('JD')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders a photo instead of initials when photoUrl is provided', () => {
    render(<TeamMemberCard member={{ ...baseMember, photoUrl: '/team/jane-doe.jpg' }} />)

    expect(screen.queryByText('JD')).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Jane Doe' })).toBeInTheDocument()
  })

  it('derives initials from a single-word name', () => {
    render(<TeamMemberCard member={{ ...baseMember, name: 'Madonna' }} />)

    expect(screen.getByText('M')).toBeInTheDocument()
  })
})
