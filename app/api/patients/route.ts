// src/app/api/patients/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { pusherServer, PATIENT_CHANNEL, PATIENT_EVENT } from "@/lib/pusher";

export async function GET() {
  try {
    const sessions = await prisma.patientSession.findMany({
      orderBy: { lastActivity: "desc" },
    });

    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    console.error("GET /api/patients error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, status, data } = body;
    console.log("POST /api/patients received data:", data);

    if (!sessionId) {
      return NextResponse.json({ success: false, message: "sessionId is required" }, { status: 400 });
    }

    const session = await prisma.patientSession.upsert({
      where: { sessionId },
      create: {
        sessionId,
        status: status ?? "filling",
        lastActivity: new Date(),
        ...data,
      },
      update: {
        status: status ?? "filling",
        lastActivity: new Date(),
        ...data,
      },
    });

    await pusherServer.trigger(PATIENT_CHANNEL, PATIENT_EVENT, {
      sessionId: session.sessionId,
      status: session.status,
      lastActivity: session.lastActivity,
      data: {
        firstName: session.firstName,
        middleName: session.middleName,
        lastName: session.lastName,
        dateOfBirth: session.dateOfBirth,
        gender: session.gender,
        phoneNumber: session.phoneNumber,
        email: session.email,
        address: session.address,
        preferredLanguage: session.preferredLanguage,
        nationality: session.nationality,
        emergencyContactName: session.emergencyContactName,
        emergencyContactRelationship: session.emergencyContactRelationship,
        religion: session.religion,
      },
    });

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error("POST /api/patients error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
