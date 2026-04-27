import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { db, collection, query, where, onSnapshot, doc, updateDoc } from '../../firebase.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminPage() {
  const { isLoading, userRole } = useAuth();
  const [pendings, setPendings] = useState([]);
  const [actionError, setActionError] = useState(null);
  const [actionStatus, setActionStatus] = useState('');
  const [activeAction, setActiveAction] = useState(null);
  const [pendingDecision, setPendingDecision] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      where('approved', '==', false),
      where('rejected', '==', false),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr = [];
        snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
        setPendings(arr);
      },
      (err) => {
        console.error('admin snapshot err', err);
        setActionError('Failed to load pending uploads.');
      },
    );

    return () => unsub();
  }, []);

  const performModeration = async (id, decision) => {
    try {
      setActiveAction(id);
      setActionError(null);
      setActionStatus('');
      if (decision === 'approve') {
        await updateDoc(doc(db, 'projects', id), { approved: true, rejected: false });
        setActionStatus('Submission approved.');
      } else {
        await updateDoc(doc(db, 'projects', id), { rejected: true, approved: false });
        setActionStatus('Submission rejected.');
      }
    } catch (err) {
      console.error(err);
      setActionError(decision === 'approve' ? 'Approve failed' : 'Reject failed');
    } finally {
      setActiveAction(null);
      setPendingDecision(null);
    }
  };

  const requestApprove = (id) => setPendingDecision({ id, decision: 'approve' });
  const requestReject = (id) => setPendingDecision({ id, decision: 'reject' });

  if (isLoading) {
    return null;
  }

  if (userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 text-slate-100">
      <h2 className="mb-6 text-2xl font-semibold">Admin - Pending Uploads</h2>

      {actionError && (
        <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-red-200">
          {actionError}
        </div>
      )}

      {actionStatus && (
        <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200">
          {actionStatus}
        </div>
      )}

      {pendingDecision && (
        <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-amber-100">
          <p className="text-sm">
            Confirm {pendingDecision.decision === 'approve' ? 'approval' : 'rejection'} for this
            submission?
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => performModeration(pendingDecision.id, pendingDecision.decision)}
              className="rounded bg-amber-400 px-3 py-1 text-sm font-semibold text-black"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setPendingDecision(null)}
              className="rounded border border-amber-400/70 px-3 py-1 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {pendings.length === 0 && <div className="text-slate-400">No pending uploads.</div>}

      <div className="space-y-4">
        {pendings.map((p) => (
          <div key={p.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-28 items-center justify-center overflow-hidden rounded bg-black">
                {p.type === 'image' ? (
                  <img
                    src={p.link || '/placeholder.png'}
                    alt={p.title}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-slate-300">{String(p.type || 'file').toUpperCase()}</div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-sm text-slate-300">{p.desc}</p>
                <p className="mt-2 text-xs text-slate-400">By: {p.uploaderEmail}</p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => requestApprove(p.id)}
                    disabled={activeAction === p.id || !!pendingDecision}
                    className="rounded bg-emerald-500 px-3 py-1 text-black disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {activeAction === p.id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => requestReject(p.id)}
                    disabled={activeAction === p.id || !!pendingDecision}
                    className="rounded bg-red-600 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {activeAction === p.id ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
