"use client";

import { useEffect, useState } from "react";
import { getPusherClient, PATIENT_CHANNEL, PATIENT_EVENT } from "@/lib/pusher";
import { PatientSession } from "@/lib/type";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Users, Radio, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

function DetailItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-basic-gray-20 pb-3">
      <span className="hl-12px-500 text-basic-gray-60">{label}</span>
      <span className="hl-14px-400 text-basic-base-black">{value || "—"}</span>
    </div>
  );
}

function hasName(data: PatientSession["data"]) {
  return !!(data.firstName?.trim() || data.lastName?.trim());
}

function getFullName(data: PatientSession["data"]) {
  return [data.firstName, data.lastName].filter(Boolean).join(" ") || "—";
}

function getInitials(firstName?: string, lastName?: string) {
  if (!firstName && !lastName) return "--";
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

function getShortId(sessionId: string) {
  const clean = sessionId.replace(/[^a-zA-Z0-9]/g, "");
  if (clean.length < 5) return `#${clean}`;
  return `#${clean.slice(0, 3)}-${clean.slice(3, 5)}`.toUpperCase();
}

function getActionText(status: string) {
  return (
    {
      submitted: "completed the intake form.",
      filling: "is actively filling the form.",
      idle: "updated their information.",
    }[status] ?? "updated their information."
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    {
      submitted: "bg-green-100 text-green-800",
      filling: "bg-[#7BF4D4] text-ci-tertiary",
      idle: "bg-basic-gray-30 text-basic-gray-70",
    }[status] ?? "bg-basic-gray-30 text-basic-gray-70";

  const label =
    {
      submitted: "Submitted",
      filling: "Actively Filling",
      idle: "Inactive",
    }[status] ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 hl-12px-500",
        styles,
      )}
    >
      {status === "submitted" ? (
        <CheckCircle className="h-3.5 w-3.5 text-green-700" strokeWidth={2.5} />
      ) : (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            status === "filling" && "bg-ci-tertiary",
            status === "idle" && "bg-basic-gray-50",
          )}
        />
      )}
      {label}
    </span>
  );
}

export default function StaffView({
  initialSessions,
}: {
  initialSessions: PatientSession[];
}) {
  const [sessions, setSessions] = useState<Map<string, PatientSession>>(
    new Map(initialSessions.map((s) => [s.sessionId, s])),
  );
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(PATIENT_CHANNEL);

    channel.bind(PATIENT_EVENT, (payload: PatientSession) => {
      setSessions((prev) => {
        const next = new Map(prev);
        next.set(payload.sessionId, payload);
        return next;
      });
    });

    return () => {
      channel.unbind(PATIENT_EVENT);
      pusher.unsubscribe(PATIENT_CHANNEL);
    };
  }, []);

  const sorted = [...sessions.values()].sort(
    (a, b) =>
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime(),
  );

  const namedSessions = sorted.filter((s) => hasName(s.data));
  const selectedSession = selectedSessionId
    ? sessions.get(selectedSessionId)
    : null;

  return (
    <div className="min-h-screen bg-basic-gray-10 p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="hl-24px-600 sm:hl-32px-600 text-basic-base-black tracking-tight">
              Staff Monitoring Dashboard
            </h1>
            <p className="hl-13px-400 sm:hl-14px-400 text-basic-gray-60 mt-1">
              Real-time status of current patient intake forms and triage
              activity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <div className="w-full bg-basic-base-white border border-basic-gray-30 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between border-b border-basic-gray-20">
                <div className="flex items-center gap-2 text-basic-gray-70 hl-12px-700 tracking-wide uppercase">
                  <Users className="w-4 h-4 text-basic-gray-60 shrink-0" />
                  Active Patients ({namedSessions.length})
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-basic-gray-20 hover:bg-transparent">
                      <TableHead className="px-4 sm:px-6 py-4 hl-12px-700 text-basic-gray-50 uppercase tracking-wider">
                        Patient Name
                      </TableHead>
                      <TableHead className="px-4 sm:px-6 py-4 hl-12px-700 text-basic-gray-50 uppercase tracking-wider">
                        Current Status
                      </TableHead>
                      <TableHead className="px-4 sm:px-6 py-4 hl-12px-700 text-basic-gray-50 uppercase tracking-wider">
                        Last Update
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-basic-gray-20">
                    {namedSessions.length === 0 ? (
                      <TableRow className="hover:bg-transparent border-0">
                        <TableCell
                          colSpan={3}
                          className="px-6 py-12 text-center"
                        >
                          <p className="hl-14px-400 text-basic-gray-50">
                            No patient sessions yet
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      namedSessions.map((session) => {
                        const { data, status, lastActivity } = session;
                        const fullName = getFullName(data);
                        const initials = getInitials(
                          data.firstName,
                          data.lastName,
                        );
                        const shortId = getShortId(session.sessionId);

                        return (
                          <TableRow
                            key={session.sessionId}
                            className="hover:bg-basic-gray-10 transition-colors border-0 cursor-pointer"
                            onClick={() =>
                              setSelectedSessionId(session.sessionId)
                            }
                          >
                            <TableCell className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-ci-secondary text-ci-primary flex items-center justify-center hl-13px-600 shrink-0">
                                  {initials}
                                </div>
                                <div>
                                  <div className="hl-14px-500 text-basic-base-black">
                                    {fullName}
                                  </div>
                                  <div className="hl-12px-400 text-basic-gray-50 mt-0.5">
                                    ID: {shortId}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={status} />
                            </TableCell>
                            <TableCell className="px-4 sm:px-6 py-4 whitespace-nowrap hl-13px-400 text-basic-gray-60">
                              {formatDistanceToNow(new Date(lastActivity), {
                                addSuffix: true,
                              }).replace("about ", "")}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="bg-basic-base-white border border-basic-gray-30 rounded-2xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <div className="flex items-center gap-2 text-basic-gray-70 hl-12px-700 tracking-wide uppercase">
                  <Radio className="w-4 h-4 text-basic-gray-60 shrink-0" />
                  Live Feed
                </div>
              </div>

              <div className="space-y-5 sm:space-y-6 relative before:absolute before:inset-0 before:ml-2 before:h-full before:w-px before:bg-basic-gray-30">
                {namedSessions.length === 0 ? (
                  <div className="pl-6 hl-14px-400 text-basic-gray-50">
                    No recent activity.
                  </div>
                ) : (
                  namedSessions.slice(0, 4).map((session, i) => {
                    const { data, status } = session;
                    const fullName = getFullName(data);
                    const actionText = getActionText(status);
                    const dotColor =
                      status === "submitted"
                        ? "bg-green-500"
                        : status === "filling"
                          ? "bg-ci-primary"
                          : "bg-ci-tertiary";

                    return (
                      <div
                        key={`${session.sessionId}-feed-${i}`}
                        className="relative pl-6"
                      >
                        <div
                          className={cn(
                            "absolute left-[5px] top-1.5 w-1.5 h-1.5 rounded-full ring-4 ring-basic-base-white -translate-x-1/2 shrink-0",
                            dotColor,
                          )}
                        />
                        <div className="hl-12px-500 text-ci-primary mb-1">
                          {new Date(session.lastActivity).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                        <div className="hl-13px-400 text-basic-gray-60 leading-relaxed">
                          <span className="hl-13px-600 text-basic-base-black">
                            {fullName}
                          </span>{" "}
                          {actionText}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Sheet
        open={!!selectedSessionId}
        onOpenChange={(open) => !open && setSelectedSessionId(null)}
      >
        <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-basic-base-white border-l border-basic-gray-30">
          <SheetHeader className="mb-6">
            <SheetTitle className="hl-20px-600 text-basic-base-black">
              Patient Details
            </SheetTitle>
            <SheetDescription className="hl-13px-400 text-basic-gray-60">
              Live view of the patient&apos;s form data.
            </SheetDescription>
          </SheetHeader>

          {selectedSession && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <StatusBadge status={selectedSession.status} />
              </div>
              <DetailItem
                label="First Name"
                value={selectedSession.data.firstName}
              />
              <DetailItem
                label="Middle Name"
                value={selectedSession.data.middleName}
              />
              <DetailItem
                label="Last Name"
                value={selectedSession.data.lastName}
              />
              <DetailItem
                label="Date of Birth"
                value={selectedSession.data.dateOfBirth}
              />
              <DetailItem label="Gender" value={selectedSession.data.gender} />
              <DetailItem
                label="Phone Number"
                value={selectedSession.data.phoneNumber}
              />
              <DetailItem label="Email" value={selectedSession.data.email} />
              <DetailItem
                label="Address"
                value={selectedSession.data.address}
              />
              <DetailItem
                label="Preferred Language"
                value={selectedSession.data.preferredLanguage}
              />
              <DetailItem
                label="Nationality"
                value={selectedSession.data.nationality}
              />
              <DetailItem
                label="Emergency Contact"
                value={selectedSession.data.emergencyContactName}
              />
              <DetailItem
                label="Emergency Relationship"
                value={selectedSession.data.emergencyContactRelationship}
              />
              <DetailItem
                label="Religion"
                value={selectedSession.data.religion}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
