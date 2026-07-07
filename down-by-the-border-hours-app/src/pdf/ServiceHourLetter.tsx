import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import { formatProfileName } from '@/lib/api/profiles'
import { BRAND_COLORS } from '@/lib/brand'
import { formatDate } from '@/lib/utils/dates'
import { formatHours } from '@/lib/utils/hours'
import type { HourLog, Profile } from '@/types'

export interface ServiceHourLetterProps {
  volunteer: Profile
  logs: HourLog[]
  dateRangeLabel: string
  totalHours: number
  adminName: string
  adminTitle?: string
  generatedDate: string
  logoSrc: string
}

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    color: BRAND_COLORS.ink,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
  },
  logoPlaceholder: {
    height: 56,
    maxWidth: 120,
    objectFit: 'contain',
  },
  orgName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: BRAND_COLORS.blue,
  },
  orgTagline: {
    fontSize: 10,
    color: BRAND_COLORS.muted,
    marginTop: 4,
  },
  salutation: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 16,
  },
  paragraph: {
    marginBottom: 12,
  },
  metaRow: {
    marginBottom: 6,
  },
  metaLabel: {
    fontFamily: 'Helvetica-Bold',
  },
  table: {
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: BRAND_COLORS.blueLight,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
  },
  tableRowLast: {
    flexDirection: 'row',
  },
  colDate: {
    width: '22%',
    padding: 8,
  },
  colEvent: {
    width: '48%',
    padding: 8,
  },
  colHours: {
    width: '30%',
    padding: 8,
    textAlign: 'right',
  },
  tableHeaderText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 28,
  },
  totalLabel: {
    fontFamily: 'Helvetica-Bold',
    marginRight: 12,
  },
  signatureBlock: {
    marginTop: 12,
  },
  signatureLine: {
    width: 220,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.ink,
    marginBottom: 8,
    marginTop: 36,
  },
  footer: {
    marginTop: 24,
    fontSize: 9,
    color: BRAND_COLORS.muted,
  },
})

function ServiceHourLetter({
  volunteer,
  logs,
  dateRangeLabel,
  totalHours,
  adminName,
  adminTitle,
  generatedDate,
  logoSrc,
}: ServiceHourLetterProps) {
  const studentName = formatProfileName(volunteer)
  const school = volunteer.school?.trim() || 'Not listed'

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.orgName}>Down By The Border</Text>
            <Text style={styles.orgTagline}>Volunteer service verification</Text>
          </View>
          <Image src={logoSrc} style={styles.logoPlaceholder} />
        </View>

        <Text style={styles.salutation}>To Whom It May Concern,</Text>

        <Text style={styles.paragraph}>
          This letter confirms volunteer service hours completed by the student named
          below through Down By The Border, a nonprofit serving high school volunteers
          in the Rio Grande Valley.
        </Text>

        <View style={styles.metaRow}>
          <Text>
            <Text style={styles.metaLabel}>Student: </Text>
            {studentName}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Text>
            <Text style={styles.metaLabel}>School: </Text>
            {school}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Text>
            <Text style={styles.metaLabel}>Service period: </Text>
            {dateRangeLabel}
          </Text>
        </View>

        <Text style={[styles.paragraph, { marginTop: 16 }]}>
          Approved volunteer hours during this period:
        </Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colDate, styles.tableHeaderText]}>Date</Text>
            <Text style={[styles.colEvent, styles.tableHeaderText]}>Event</Text>
            <Text style={[styles.colHours, styles.tableHeaderText]}>Hours</Text>
          </View>
          {logs.map((log, index) => (
            <View
              key={log.id}
              style={index === logs.length - 1 ? styles.tableRowLast : styles.tableRow}
            >
              <Text style={styles.colDate}>{formatDate(log.event_date)}</Text>
              <Text style={styles.colEvent}>{log.event_name}</Text>
              <Text style={styles.colHours}>{formatHours(Number(log.hours))}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total hours:</Text>
          <Text>{formatHours(totalHours)}</Text>
        </View>

        <Text style={styles.paragraph}>
          If you have questions about this record, please contact Down By The Border.
        </Text>

        <View style={styles.signatureBlock}>
          <View style={styles.signatureLine} />
          <Text>{adminName}</Text>
          {adminTitle ? <Text>{adminTitle}</Text> : null}
          <Text>Down By The Border</Text>
        </View>

        <Text style={styles.footer}>Generated on {generatedDate}</Text>
      </Page>
    </Document>
  )
}

export default ServiceHourLetter
