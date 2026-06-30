import { supabase } from '@/lib/supabase'
import type { HourLog, HourLogInsert, HourLogUpdate, HourLogWithVolunteer } from '@/types'

export interface ListHourLogsOptions {
  volunteerId?: string
  school?: string
  eventSearch?: string
  from?: string
  to?: string
  limit?: number
}

export async function listHourLogs(
  opts: ListHourLogsOptions = {},
): Promise<HourLogWithVolunteer[]> {
  let query = supabase
    .from('hour_logs')
    .select('*, volunteer:profiles!hour_logs_volunteer_id_fkey(*)')
    .order('event_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (opts.volunteerId) {
    query = query.eq('volunteer_id', opts.volunteerId)
  }
  if (opts.from) {
    query = query.gte('event_date', opts.from)
  }
  if (opts.to) {
    query = query.lte('event_date', opts.to)
  }
  if (opts.eventSearch?.trim()) {
    query = query.ilike('event_name', `%${opts.eventSearch.trim()}%`)
  }
  if (opts.limit) {
    query = query.limit(opts.limit)
  }

  const { data, error } = await query

  if (error) throw error

  let logs = data as HourLogWithVolunteer[]

  if (opts.school?.trim()) {
    const schoolNeedle = opts.school.trim().toLowerCase()
    logs = logs.filter((log) =>
      log.volunteer?.school?.toLowerCase().includes(schoolNeedle),
    )
  }

  return logs
}

export async function listHourLogsForVolunteer(
  volunteerId: string,
  opts?: { limit?: number },
): Promise<HourLog[]> {
  let query = supabase
    .from('hour_logs')
    .select('*')
    .eq('volunteer_id', volunteerId)
    .order('event_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (opts?.limit) {
    query = query.limit(opts.limit)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getHourLog(logId: string): Promise<HourLog> {
  const { data, error } = await supabase
    .from('hour_logs')
    .select('*')
    .eq('id', logId)
    .single()

  if (error) throw error
  return data
}

export async function createHourLog(input: HourLogInsert): Promise<HourLog> {
  const { data, error } = await supabase
    .from('hour_logs')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateHourLog(
  logId: string,
  updates: HourLogUpdate,
): Promise<HourLog> {
  const { data, error } = await supabase
    .from('hour_logs')
    .update(updates)
    .eq('id', logId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteHourLog(logId: string): Promise<void> {
  const { error } = await supabase.from('hour_logs').delete().eq('id', logId)

  if (error) throw error
}

export function sumHours(logs: Pick<HourLog, 'hours'>[]): number {
  const total = logs.reduce((sum, log) => sum + Number(log.hours), 0)
  return Math.round(total * 100) / 100
}

export interface AdminDashboardStats {
  volunteerCount: number
  hoursThisMonth: number
  recentLogs: HourLogWithVolunteer[]
}

function getMonthStartDate(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const monthStart = getMonthStartDate()

  const [volunteerResult, monthLogs, recentLogs] = await Promise.all([
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'volunteer'),
    supabase.from('hour_logs').select('hours').gte('event_date', monthStart),
    listHourLogs({ limit: 8 }),
  ])

  if (volunteerResult.error) throw volunteerResult.error
  if (monthLogs.error) throw monthLogs.error

  return {
    volunteerCount: volunteerResult.count ?? 0,
    hoursThisMonth: sumHours(monthLogs.data ?? []),
    recentLogs,
  }
}
