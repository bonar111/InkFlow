// src/app/audit/session/[sessionId]/page.js

import SessionAuditForm from '../../../../components/Audits/SessionAuditForm';

export default function SessionAuditPage({ params }) {
  const { sessionId } = params;

  return (
    <main className="p-4">
      <SessionAuditForm sessionId={sessionId} />
    </main>
  );
}
