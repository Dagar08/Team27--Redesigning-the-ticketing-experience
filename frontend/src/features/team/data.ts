import type { TeamMember } from './types'

/**
 * Replace with your actual team's details.
 * Photos: drop images in `frontend/public/team/` and reference them below,
 * e.g. photoUrl: '/team/jane-doe.jpg'. Omit photoUrl to show initials instead.
 */
export const TEAM_NAME = 'Grand Prix Ticketing Redesign'

export const teamMembers: TeamMember[] = [
  {
    id: 'member-one',
    name: 'Kartikey Dagar',
    role: 'Project Manager',
    blurb: 'A passionate project manager with a focus on delivering high-quality results.',
  },
  {
    id: 'member-two',
    name: 'Blake Leonard',
    role: 'Developer',
    blurb: 'Focusing on creating efficient and scalable solutions.',
  },
  {
    id: 'member-three',
    name: 'Julius Ross',
    role: 'Developer',
    blurb: 'A dedicated developer with a passion for clean and maintainable code.',
  },
    {
    id: 'member-four',
    name: 'Toby Davies',
    role: 'UX Designer',
    blurb: 'Dedicated to making interfaces intuitive and delightful.',
    
  },
    {
    id: 'member-five',
    name: 'Matthew (Kar Wei) Kwong',
    role: 'Business Analyst',
    blurb: 'A detail-oriented business analyst with a focus on driving data-informed decisions.',
  },
]
