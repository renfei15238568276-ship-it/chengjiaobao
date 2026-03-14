import { exportCustomersCsv } from "@/lib/customer-service";

export async function GET() {
  const csv = await exportCustomersCsv();

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="customers.csv"',
    },
  });
}
