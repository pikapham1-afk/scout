import { db } from "./firebase";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import type { Report } from "@/components/type/report";

export const reportsRef = collection(
  db,
  "reports"
);

export async function addReport(
  report: Omit<Report, "id">
) {

  console.log("🔥 addReport()", report);

  const doc = await addDoc(
    reportsRef,
    report
  );

  console.log("✅ Document ID:", doc.id);

}

export function listenReports(
  callback: (reports: Report[]) => void
) {

  const q = query(
    reportsRef,
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {

    const reports: Report[] = snapshot.docs.map((doc) => ({

      id: doc.id,

      ...(doc.data() as Omit<Report, "id">),

    }));

   const validReports = reports.filter(
  (report) => report.expiresAt > Date.now()
);

callback(validReports);

  });

}