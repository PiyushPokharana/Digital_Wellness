import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWorkById } from '../services/api';

/**
 * Work Detail Page Component
 * Displays full details of a student work with embedded media viewer
 */
const WorkDetailPage = () => {
  const { id } = useParams();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch work details from API
  useEffect(() => {
    fetchWork();
  }, [id]);

  const fetchWork = async () => {
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
  };

  // Format date
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

  // Get category badge color
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

  // Render media viewer based on file type
  const renderMediaViewer = () => {
    if (!work) return null;

    switch (work.fileType) {
      case 'image':
        return (
          <div className="bg-slate-900/70 rounded-lg p-4 flex items-center justify-center border border-slate-800">
            <img
              src={work.fileUrl}
              alt={work.title}
              className="max-w-full max-h-96 rounded-lg shadow-2xl shadow-black/40"
            />
          </div>
        );

      case 'video':
        return (
          <div className="bg-slate-900/70 rounded-lg p-4 border border-slate-800">
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
          <div className="bg-slate-900/70 rounded-lg p-4 border border-slate-800">
            <iframe
              src={work.fileUrl}
              sandbox="allow-scripts allow-same-origin"
              title="Website Preview"
              className="w-full h-[600px] md:h-[800px] rounded-lg shadow-2xl bg-white"
            />
            <div className="mt-4 text-center">
              <a
                href={work.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white transition hover:brightness-110"
              >
                <span className="mr-2">↗</span>
                Open in new tab
              </a>
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div className="bg-slate-900/70 rounded-lg p-4 border border-slate-800">
            <iframe
              src={`${work.fileUrl}#toolbar=1`}
              className="w-full h-96 rounded-lg shadow-2xl shadow-black/40"
              title="PDF Viewer"
            />
            <div className="mt-4 text-center">
              <a
                href={work.fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white transition hover:brightness-110"
              >
                <span className="mr-2">📥</span>
                Download PDF
              </a>
            </div>
          </div>
        );

      case 'zip':
        return (
          <div className="bg-slate-900/70 rounded-lg p-6 text-center border border-slate-800">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-slate-300 mb-4">ZIP File</p>
            <a
              href={work.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white transition hover:brightness-110"
            >
              <span className="mr-2">📥</span>
              Download ZIP
            </a>
          </div>
        );

      default:
        return (
          <div className="bg-slate-900/70 rounded-lg p-6 text-center border border-slate-800">
            <div className="text-6xl mb-4">📎</div>
            <p className="text-slate-300 mb-4">File Preview Not Available</p>
            <a
              href={work.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white transition hover:brightness-110"
            >
              <span className="mr-2">📥</span>
              Download File
            </a>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-slate-100">
      {/* Back Button */}
      <Link
        to="/gallery"
        className="inline-flex items-center text-cyan-300 hover:text-white mb-6"
      >
        <span className="mr-2">←</span>
        Back to Gallery
      </Link>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          <p className="mt-4 text-slate-400">Loading work details...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
          <p className="text-red-200 font-semibold">Error loading work</p>
          <p className="text-red-300 mt-2">{error}</p>
          <Link
            to="/gallery"
            className="mt-4 inline-block px-6 py-2 rounded-full bg-red-500/80 text-white hover:bg-red-400 transition-colors"
          >
            Back to Gallery
          </Link>
        </div>
      )}

      {/* Work Details */}
      {work && !loading && (
        <div className="bg-slate-950/60 rounded-3xl border border-slate-800 shadow-2xl shadow-black/40 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-800 p-8 text-white">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${getCategoryColor(work.category)}`}>
                  {work.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{work.title}</h1>
                <p className="text-blue-100">{formatDate(work.timestamp)}</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Media Viewer */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Media</h2>
              {renderMediaViewer()}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {work.description}
              </p>
            </div>

            {/* Student Information */}
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Student Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Name</p>
                  <p className="text-white font-medium">{work.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Roll Number</p>
                  <p className="text-white font-medium">{work.roll}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Email</p>
                  <p className="text-white font-medium">
                    <a href={`mailto:${work.email}`} className="text-cyan-300 hover:underline">
                      {work.email}
                    </a>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">File Type</p>
                  <p className="text-white font-medium capitalize">{work.fileType}</p>
                </div>
              </div>
            </div>

            {/* Download/View Link */}
            <div className="border-t border-slate-800 pt-6">
              <h2 className="text-xl font-semibold text-white mb-4">File URL</h2>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 break-all">
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
