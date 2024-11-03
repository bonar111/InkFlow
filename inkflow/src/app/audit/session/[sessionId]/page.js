// src/app/audit/session/[sessionId]/page.js

import SessionAuditForm from '../../../../components/Audits/SessionAuditForm';

export default async function SessionAuditPage({ params }) {
  const { sessionId } = await params;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nie rozliczone sesje</h1>
      <SessionAuditForm sessionId={sessionId} />
    </main>
  );
}
