import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { getWorks } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import LoginButton from '../components/LoginButton.jsx';

/**
 * Home Page Component
 * Gallery-first landing experience with quick upload rail
 */
const HomePage = () => {
  const { canUpload } = useAuth();
  const navigate = useNavigate();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      navigate('/upload', { state: { droppedFile: acceptedFiles[0] } });
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await getWorks({ sort: 'newest' });
        setWorks(response.works || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Unable to load gallery right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const featuredWorks = useMemo(() => works.slice(0, 5), [works]);

  return (
    <div className="relative overflow-hidden text-slate-100">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0f2a5c]/20 via-[#0a192f] to-[#020817]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <header className="space-y-6">
          <p className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
            Digital Wellness
          </p>
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl">
                Your Guide to Mindful Tech Use & Digital Wellness.
              </h1>
              <p className="text-lg text-slate-400">
                Boost Productivity With Focused Digital Use
              </p>
            </div>
            <div className="rounded-2xl border border-[#1e3a8a]/30 bg-[#0a192f]/70 p-6 shadow-2xl shadow-blue-500/10">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400/70">
                Quick actions
              </p>
              <div className="mt-4 space-y-3">
                {canUpload ? (
                  <div
                    {...getRootProps()}
                    className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-6 transition cursor-pointer ${
                      isDragActive
                        ? 'border-blue-400 bg-blue-500/20'
                        : 'border-[#1e3a8a]/50 bg-[#0f2a5c]/30 hover:border-blue-400/80 hover:bg-[#0f2a5c]/50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <span className="text-2xl mb-1">📥</span>
                    <span className="font-semibold text-blue-50 text-center">
                      {isDragActive ? 'Drop it here!' : 'Drag & drop to upload'}
                    </span>
                    <span className="text-xs text-blue-300/70 mt-1">or click to browse</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-slate-700/70 px-5 py-4 space-y-3">
                    <p className="text-sm text-slate-400 text-center">
                      Login with your IIITN email to upload
                    </p>
                    <LoginButton />
                  </div>
                )}
                <Link
                  to="/gallery"
                  className="flex items-center justify-between rounded-xl border border-[#1e3a8a]/40 bg-[#0a192f]/50 px-5 py-3 font-semibold text-blue-100 transition hover:border-blue-400/60 hover:bg-[#0f2a5c]/40"
                >
                  View full gallery
                  <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Latest gallery</p>
              <h2 className="text-3xl font-semibold text-white">Featured rows</h2>
            </div>
            <span className="text-sm text-slate-500">
              {works.length > 0 ? `${works.length} total submissions` : 'Fetching works...'}
            </span>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {loading && (
              <>
                {[...Array(5)].map((_, idx) => (
                  <div
                    key={`skeleton-${idx}`}
                    className="h-52 w-full animate-pulse rounded-xl bg-slate-800/50"
                  ></div>
                ))}
              </>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-200 col-span-full">
                {error}
              </div>
            )}

            {!loading && !error && featuredWorks.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center col-span-full">
                <p className="text-lg font-semibold text-slate-100">No submissions yet.</p>
                <p className="mt-2 text-slate-400">Be the first to showcase your project!</p>
                {canUpload ? (
                  <Link
                    to="/upload"
                    className="mt-6 inline-flex items-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/30 transition"
                  >
                    Upload now
                  </Link>
                ) : (
                  <div className="mt-6 flex justify-center">
                    <LoginButton />
                  </div>
                )}
              </div>
            )}

            {!loading &&
              !error &&
              featuredWorks.map((work) => (
                <Link
                  key={work._id}
                  to={`/work/${work._id}`}
                  className="bg-[#0a192f] rounded-xl overflow-hidden border border-[#1e3a8a]/40 hover:border-blue-400 transition group shadow-lg shadow-black/20"
                >
                  <div className="w-full h-52 bg-[#020817] flex items-center justify-center overflow-hidden relative">
                    {work.fileType === 'image' ? (
                      <img
                        src={work.fileUrl}
                        alt={work.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : work.fileType === 'video' ? (
                      <video
                        src={work.fileUrl}
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onMouseOver={(e) => e.target.play()}
                        onMouseOut={(e) => e.target.pause()}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-blue-400/50 group-hover:text-blue-400 transition-colors">
                        <span className="text-5xl mb-2">
                          {work.fileType === 'website' ? '🌐' : work.fileType === 'pdf' ? '📄' : work.fileType === 'zip' ? '📦' : '📁'}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          {work.fileType}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-2 text-center space-y-1">
                    <h3 className="text-[13px] font-semibold text-white line-clamp-1">
                      {work.title || "Untitled"}
                    </h3>
                    <p className="text-[11px] text-cyan-300 font-medium">
                      View Project →
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
