import prisma from "@/lib/prisma";
import StaffView from "@/components/staff/StaffView";
import { PatientSession, PatientStatus } from "@/lib/type";

export const metadata = {
  title: "Staff Dashboard",
};

export const dynamic = "force-dynamic";
async function getSessions(): Promise<PatientSession[]> {
  const rows = await prisma.patientSession.findMany({
    orderBy: { lastActivity: "desc" },
  });
  return (rows as any[]).map((row) => ({
    sessionId: row.sessionId,
    status: row.status as PatientStatus,
    lastActivity: row.lastActivity.toISOString(),
    data: {
      firstName: row.firstName ?? undefined,
      middleName: row.middleName ?? undefined,
      lastName: row.lastName ?? undefined,
      dateOfBirth: row.dateOfBirth ?? undefined,
      gender: row.gender ?? undefined,
      phoneNumber: row.phoneNumber ?? undefined,
      email: row.email ?? undefined,
      address: row.address ?? undefined,
      preferredLanguage: row.preferredLanguage ?? undefined,
      nationality: row.nationality ?? undefined,
      emergencyContactName: row.emergencyContactName ?? undefined,
      emergencyContactRelationship:
        row.emergencyContactRelationship ?? undefined,
      religion: row.religion ?? undefined,
    },
  }));
}
export default async function StaffPage() {
  const initialSessions = await getSessions();
  return <StaffView initialSessions={initialSessions} />;
}
