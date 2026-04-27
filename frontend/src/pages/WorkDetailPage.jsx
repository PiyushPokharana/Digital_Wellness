import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWorkById } from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';

const TRUSTED_ROLES = new Set(['student', 'faculty_staff', 'admin']);

const WorkDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, userRole } = useAuth();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const canViewSensitiveInfo = isAuthenticated && TRUSTED_ROLES.has(userRole);

  const fetchWork = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWorkById(id);
      setWork(response.work);
    } catch (err) {
      console.error('Error fetching work:', err);
      setError(err.message || 'Failed to load work');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWork();
  }, [fetchWork]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Comic: 'border border-purple-500/40 bg-purple-500/10 text-purple-100',
      Website: 'border border-blue-500/40 bg-blue-500/10 text-blue-100',
      Magazine: 'border border-pink-500/40 bg-pink-500/10 text-pink-100',
      Skit: 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-100',
      Other: 'border border-slate-500/40 bg-slate-500/10 text-slate-100',
    };
    return colors[category] || colors.Other;
  };

  const renderMediaViewer = () => {
    if (!work) return null;

    switch (work.fileType) {
      case 'image':
        return (
          <div className="flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <img
              src={work.fileUrl}
              alt={work.title}
              className="max-h-96 max-w-full rounded-lg shadow-2xl shadow-black/40"
            />
          </div>
        );

      case 'video':
        return (
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <video
              src={work.fileUrl}
              controls
              className="w-full rounded-lg shadow-2xl shadow-black/40"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case 'website':
        return (
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6 text-center">
            <p className="mb-4 text-slate-300">
              Website previews are opened in a separate tab for safer browsing.
            </p>
            <a
              href={work.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-white transition hover:brightness-110"
            >
              <span className="mr-2">↗</span>
              Open website
            </a>
          </div>
        );

      case 'pdf':
        return (
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <iframe
              src={`${work.fileUrl}#toolbar=1`}
              className="h-96 w-full rounded-lg shadow-2xl shadow-black/40"
              title="PDF Viewer"
            />
            <div className="mt-4 text-center">
              <a
                href={work.fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-white transition hover:brightness-110"
              >
                <span className="mr-2">📥</span>
                Download PDF
              </a>
            </div>
          </div>
        );

      case 'zip':
        return (
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6 text-center">
            <div className="mb-4 text-6xl">📦</div>
            <p className="mb-4 text-slate-300">ZIP File</p>
            <a
              href={work.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-white transition hover:brightness-110"
            >
              <span className="mr-2">📥</span>
              Download ZIP
            </a>
          </div>
        );

      default:
        return (
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6 text-center">
            <div className="mb-4 text-6xl">📎</div>
            <p className="mb-4 text-slate-300">File Preview Not Available</p>
            <a
              href={work.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-white transition hover:brightness-110"
            >
              <span className="mr-2">📥</span>
              Download File
            </a>
          </div>
        );
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <Link to="/gallery" className="mb-6 inline-flex items-center text-cyan-300 hover:text-white">
        <span className="mr-2">←</span>
        Back to Gallery
      </Link>

      {loading && (
        <div className="py-12 text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-400"></div>
          <p className="mt-4 text-slate-400">Loading work details...</p>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
          <p className="font-semibold text-red-200">Error loading work</p>
          <p className="mt-2 text-red-300">{error}</p>
          <Link
            to="/gallery"
            className="mt-4 inline-block rounded-full bg-red-500/80 px-6 py-2 text-white transition-colors hover:bg-red-400"
          >
            Back to Gallery
          </Link>
        </div>
      )}

      {work && !loading && (
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/60 shadow-2xl shadow-black/40">
          <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-800 p-8 text-white">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span
                  className={`mb-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${getCategoryColor(work.category)}`}
                >
                  {work.category}
                </span>
                <h1 className="mb-2 text-3xl font-bold md:text-4xl">{work.title}</h1>
                <p className="text-blue-100">{formatDate(work.timestamp)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 p-6 md:p-8">
            <div>
              <h2 className="mb-4 text-xl font-semibold text-white">Media</h2>
              {renderMediaViewer()}
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-white">Description</h2>
              <p className="whitespace-pre-wrap leading-relaxed text-slate-300">{work.description}</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <h2 className="mb-4 text-xl font-semibold text-white">Student Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm text-slate-500">Name</p>
                  <p className="font-medium text-white">{work.name}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-slate-500">Roll Number</p>
                  <p className="font-medium text-white">
                    {canViewSensitiveInfo ? work.roll : 'Hidden for privacy'}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-slate-500">Email</p>
                  <p className="font-medium text-white">
                    {canViewSensitiveInfo ? (
                      <a href={`mailto:${work.email}`} className="text-cyan-300 hover:underline">
                        {work.email}
                      </a>
                    ) : (
                      'Hidden for privacy'
                    )}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-slate-500">File Type</p>
                  <p className="font-medium capitalize text-white">{work.fileType}</p>
                </div>
              </div>
              {!canViewSensitiveInfo && (
                <p className="mt-4 text-sm text-slate-400">
                  Sign in with an authorized IIITN account to view protected student contact details.
                </p>
              )}
            </div>

            <div className="border-t border-slate-800 pt-6">
              <h2 className="mb-4 text-xl font-semibold text-white">File URL</h2>
              <div className="break-all rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                <a
                  href={work.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:underline"
                >
                  {work.fileUrl}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkDetailPage;
