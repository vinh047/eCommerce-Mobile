// src/app/api/cron/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Gửi lệnh "SELECT 1" để đánh thức Database
    await prisma.$queryRaw`SELECT 1`;
    
    console.log("Cron Job: Database ping success!");
    return NextResponse.json({ message: "Database Awake!", time: new Date().toISOString() });
  } catch (error: any) {
    console.error("Cron Job: Database ping failed", error);
    return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
  }
}