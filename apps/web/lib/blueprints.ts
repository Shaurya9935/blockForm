import { normalizeOptions, type SelectOption } from './utils'
import type { BlockType } from '~/components/builder/builder-left-sidebar'

export interface BlueprintFieldDefinition {
  type: BlockType
  label: string
  labelKey: string
  description?: string
  placeholder?: string
  isRequired?: boolean
  options?: string[] | SelectOption[]
  maxRating?: number
  minValue?: number
  maxValue?: number
}

export interface BlueprintDefinition {
  id: string
  name: string
  title: string
  emoji: string
  category: string
  desc: string
  accent: string
  fieldsCount: number
  theme: 'overworld' | 'nether' | 'aura' | 'default'
  experience: 'journey' | 'scroll'
  fields: BlueprintFieldDefinition[]
}

export const BLUEPRINTS: BlueprintDefinition[] = [
  {
    id: 'event-feedback',
    name: 'Event Feedback',
    title: 'Event Feedback & Experience Survey',
    emoji: '🎤',
    category: 'Events',
    desc: 'Post-event satisfaction survey with ratings, highlights, logistics review, and future interest.',
    accent: '#6abf3c',
    fieldsCount: 7,
    theme: 'overworld',
    experience: 'journey',
    fields: [
      {
        type: 'TEXT',
        label: 'Attendee Name',
        labelKey: 'attendee_name',
        description: 'Optional — leave blank if you wish to submit feedback anonymously.',
        placeholder: 'e.g. Alex Morgan',
        isRequired: false,
      },
      {
        type: 'EMAIL',
        label: 'Email Address',
        labelKey: 'attendee_email',
        description: 'Optional — for receiving session slides and future event invitations.',
        placeholder: 'alex@example.com',
        isRequired: false,
      },
      {
        type: 'RATING',
        label: 'How would you rate your overall event experience?',
        labelKey: 'overall_rating',
        description: '1 being poor and 5 being exceptional.',
        isRequired: true,
        maxRating: 5,
      },
      {
        type: 'TEXT',
        label: 'What was your favorite session, keynote, or workshop?',
        labelKey: 'favorite_session',
        description: 'Tell us which part of the event was most valuable to you.',
        placeholder: 'e.g. AI Keynote, Hands-on Workshop, Networking session...',
        isRequired: true,
      },
      {
        type: 'SELECT',
        label: 'How was the event organization, venue, and timing?',
        labelKey: 'event_logistics',
        description: 'Help us improve our event management and facilities.',
        isRequired: true,
        options: [
          'Excellent — Seamless & on schedule',
          'Good — Well organized with minor delays',
          'Average — Met basic expectations',
          'Needs Improvement — Could be better organized',
        ],
      },
      {
        type: 'TEXT',
        label: 'What could we do to make future events even better?',
        labelKey: 'suggestions_feedback',
        description: 'Share any ideas for topics, speakers, catering, or activities.',
        placeholder: 'Share your honest thoughts and recommendations...',
        isRequired: false,
      },
      {
        type: 'SELECT',
        label: 'Would you attend our upcoming events or recommend them?',
        labelKey: 'future_attendance',
        description: 'Let us know if you want to stay in the loop for future editions!',
        isRequired: true,
        options: [
          'Definitely Yes 🚀',
          'Likely / Depends on topic 👍',
          'Not sure yet 🤔',
          'Probably Not ❌',
        ],
      },
    ],
  },
  {
    id: 'college-registration',
    name: 'College Registration',
    title: 'College Fest 2026 Registration',
    emoji: '🏫',
    category: 'Events',
    desc: 'Collect student info, department, year, technical tracks, and event consent.',
    accent: '#c9a84c',
    fieldsCount: 6,
    theme: 'overworld',
    experience: 'journey',
    fields: [
      {
        type: 'TEXT',
        label: 'Full Name',
        labelKey: 'full_name',
        description: 'Enter your full name as it appears on your student ID.',
        placeholder: 'John Doe',
        isRequired: true,
      },
      {
        type: 'EMAIL',
        label: 'Student / College Email',
        labelKey: 'student_email',
        description: 'We will send registration confirmation and entry pass here.',
        placeholder: 'john@college.edu',
        isRequired: true,
      },
      {
        type: 'SELECT',
        label: 'Which department are you from?',
        labelKey: 'department',
        description: 'Select your academic branch.',
        isRequired: true,
        options: [
          'Computer Science (CSE)',
          'AI & Machine Learning',
          'Electronics (ECE)',
          'Mechanical Engineering',
          'Civil Engineering',
          'Management (MBA)',
          'Other Department',
        ],
      },
      {
        type: 'SELECT',
        label: 'Current Academic Year',
        labelKey: 'academic_year',
        description: 'Select your current year of study.',
        isRequired: true,
        options: ['1st Year (Fresher)', '2nd Year (Sophomore)', '3rd Year (Junior)', '4th Year (Senior)'],
      },
      {
        type: 'CHECKBOX',
        label: 'What event tracks are you interested in?',
        labelKey: 'event_tracks',
        description: 'Select all activities you plan to participate in.',
        isRequired: true,
        options: [
          'Hackathon ⚡',
          'Competitive Gaming & Esports 🎮',
          'Music & Cultural Night 🎸',
          'Workshops & Keynotes 💡',
          'Design & UI/UX Challenge 🎨',
        ],
      },
      {
        type: 'TEXT',
        label: 'Discord or GitHub Handle (Optional)',
        labelKey: 'social_handle',
        description: 'Connect with other participants before the event.',
        placeholder: '@username',
        isRequired: false,
      },
    ],
  },
  {
    id: 'customer-survey',
    name: 'Customer Survey',
    title: 'Product CSAT & Customer Satisfaction Survey',
    emoji: '📋',
    category: 'Survey',
    desc: 'Understand what your customers really need, satisfaction scores, and feature requests.',
    accent: '#60a5fa',
    fieldsCount: 6,
    theme: 'default',
    experience: 'journey',
    fields: [
      {
        type: 'TEXT',
        label: 'Your Name & Organization',
        labelKey: 'customer_name',
        description: 'Let us know who is providing feedback.',
        placeholder: 'Jane Doe, Acme Corp',
        isRequired: true,
      },
      {
        type: 'EMAIL',
        label: 'Work Email Address',
        labelKey: 'work_email',
        description: 'For product team follow-up if needed.',
        placeholder: 'jane@acme.com',
        isRequired: true,
      },
      {
        type: 'RATING',
        label: 'How satisfied are you with our product overall?',
        labelKey: 'product_csat',
        description: '1 being completely dissatisfied and 5 being extremely satisfied.',
        isRequired: true,
        maxRating: 5,
      },
      {
        type: 'SELECT',
        label: 'Which feature do you use most frequently?',
        labelKey: 'primary_feature',
        description: 'Help us prioritize our core development.',
        isRequired: true,
        options: [
          'Visual Workflow Canvas',
          'Interactive Theme Engine',
          'Real-time Live Preview',
          'Response Collection & Analytics',
          'Webhooks & Integrations',
        ],
      },
      {
        type: 'TEXT',
        label: 'What is the biggest improvement or missing feature you need?',
        labelKey: 'feature_requests',
        description: 'Tell us what would make your workflow 10x better.',
        placeholder: 'Describe the feature or workflow you would like to see...',
        isRequired: false,
      },
      {
        type: 'SELECT',
        label: 'How likely are you to recommend us to a friend or colleague?',
        labelKey: 'nps_score',
        description: 'Net Promoter Score (NPS)',
        isRequired: true,
        options: [
          '10 — Extremely Likely 🌟',
          '8-9 — Very Likely 👍',
          '6-7 — Neutral 😐',
          'Below 6 — Unlikely ❌',
        ],
      },
    ],
  },
  {
    id: 'gaming-community',
    name: 'Gaming Community',
    title: 'Gaming Squad & Tournament Registration',
    emoji: '🎮',
    category: 'Community',
    desc: 'Polls and surveys for your gaming squad, tournament signups, and preferred schedules.',
    accent: '#a78bfa',
    fieldsCount: 6,
    theme: 'nether',
    experience: 'journey',
    fields: [
      {
        type: 'TEXT',
        label: 'Gamer Tag / In-Game Name',
        labelKey: 'gamer_tag',
        description: 'Your public gamer handle.',
        placeholder: 'e.g. ShadowHunter_99',
        isRequired: true,
      },
      {
        type: 'TEXT',
        label: 'Discord ID & Email',
        labelKey: 'discord_contact',
        description: 'For tournament coordination and match room invites.',
        placeholder: 'discord_handle / you@email.com',
        isRequired: true,
      },
      {
        type: 'CHECKBOX',
        label: 'Which games do you want to compete in?',
        labelKey: 'games_list',
        description: 'Select all game titles you play.',
        isRequired: true,
        options: [
          'Valorant 🎯',
          'Minecraft Bedwars / Build Battle ⛏️',
          'Counter-Strike 2 💣',
          'Rocket League 🏎️',
          'Apex Legends / BGMI 🏆',
          'League of Legends ⚔️',
        ],
      },
      {
        type: 'SELECT',
        label: 'Your Competitive Tier / Skill Level',
        labelKey: 'skill_level',
        description: 'Help us balance tournament brackets.',
        isRequired: true,
        options: [
          'Casual / Just for fun 🎉',
          'Intermediate / Ranked player 🥈',
          'Competitive / High Tier 🥇',
          'Semi-Pro / Tournament veteran 👑',
        ],
      },
      {
        type: 'SELECT',
        label: 'Preferred Tournament Timings',
        labelKey: 'preferred_timings',
        description: 'When are you most active to play?',
        isRequired: true,
        options: [
          'Weekdays Evening (7:00 PM – 10:00 PM)',
          'Saturday Afternoon (2:00 PM – 6:00 PM)',
          'Sunday Tournament Night (6:00 PM – 11:00 PM)',
          'Flexible anytime on weekends',
        ],
      },
      {
        type: 'SELECT',
        label: 'Do you have a pre-made team or are you joining as a solo agent?',
        labelKey: 'team_status',
        description: 'We can match solo players into balanced squads.',
        isRequired: true,
        options: [
          'Full 5-player Squad ready',
          'Duo / Trio looking for teammates',
          'Solo player — Match me with a squad',
        ],
      },
    ],
  },
]

export const BLUEPRINTS_MAP = new Map<string, BlueprintDefinition>(
  BLUEPRINTS.map((bp) => [bp.id, bp])
)

export function getBlueprintById(id: string): BlueprintDefinition | undefined {
  if (!id) return undefined
  const normalized = id.toLowerCase().trim()
  return (
    BLUEPRINTS_MAP.get(normalized) ||
    BLUEPRINTS.find(
      (b) =>
        b.id.toLowerCase() === normalized ||
        b.name.toLowerCase().replace(/\s+/g, '-') === normalized ||
        b.title.toLowerCase().includes(normalized)
    )
  )
}
