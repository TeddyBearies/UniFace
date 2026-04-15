import { NextResponse } from "next/server";
import {
  buildInstructorReportCsv,
  getInstructorReportData,
} from "@/features/attendance/instructor-records.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const courseId = url.searchParams.get("courseId") || "";
    const fromDate = url.searchParams.get("fromDate") || "";
    const toDate = url.searchParams.get("toDate") || "";

    const reportData = await getInstructorReportData({
      courseId,
      fromDate,
      toDate,
      generated: true,
    });

    const csvContent = buildInstructorReportCsv(reportData.csvRows);
    const filenameDate = new Date().toISOString().slice(0, 10);
    const filename = `admin-attendance-report-${filenameDate}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to export admin report CSV:", error);
    const errorMessage = error instanceof Error ? error.message : "";
    const status = errorMessage === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: "Failed to export report." }, { status });
  }
}
