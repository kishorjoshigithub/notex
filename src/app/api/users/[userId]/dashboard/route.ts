import { getUserById } from "@/firebase/auth";
import { getDashboardData } from "@/firebase/dashboard";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ message: "No User Found" }, { status: 404 });
    }

    const dashboardData = await getDashboardData({ userId });

    return NextResponse.json(
      {
        message: "Dashboard data fetched successfully",
        data: dashboardData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
