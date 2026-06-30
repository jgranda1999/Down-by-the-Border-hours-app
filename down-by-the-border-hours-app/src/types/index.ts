import type { HourLog, Profile } from './database'

export type {
  Database,
  Profile,
  ProfileInsert,
  ProfileUpdate,
  HourLog,
  HourLogInsert,
  HourLogUpdate,
} from './database'

export type UserRole = 'volunteer' | 'admin'

export type HourLogWithVolunteer = HourLog & {
  volunteer: Profile
}
