import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getWorks } from '../services/api';

const PAGE_SIZE = 12;

const GalleryPage = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    sort: 'newest',
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [filters]);

  const fetchWorks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWorks({
        ...debouncedFilters,
        page: currentPage,
        limit: PAGE_SIZE,
      });
      setWorks(response.works || []);
      setPagination({
        page: response.page || currentPage,
        totalPages: response.totalPages || 1,
        totalCount: response.totalCount || 0,
        hasNextPage: !!response.hasNextPage,
        hasPrevPage: !!response.hasPrevPage,
      });
    } catch (err) {
      setError(err.message || 'Failed to load works');
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters, currentPage]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="space-y-1">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Latest Gallery</p>
        <h1 className="text-4xl font-semibold text-white">Featured Works</h1>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by name or title"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-2 text-slate-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="all">All Categories</option>
              <option value="Comic">Comic</option>
              <option value="Website">Website</option>
              <option value="Magazine">Magazine</option>
              <option value="Skit">Skit</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">Sort By</label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-2 text-slate-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="py-12 text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-400"></div>
          <p className="mt-4 text-slate-400">Loading works...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <p className="font-semibold text-red-200">Error loading works</p>
          <p className="mt-2 text-red-300">{error}</p>
        </div>
      )}

      {!loading && !error && works.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 py-12 text-center">
          <p className="text-lg text-slate-200">No works found</p>
          <Link
            to="/upload"
            className="mt-4 inline-flex rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg"
          >
            Upload Your Work
          </Link>
        </div>
      )}

      {!loading && !error && works.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {works.map((work) => (
              <Link
                key={work._id}
                to={`/work/${work._id}`}
                className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition hover:border-cyan-500"
              >
                <div className="relative flex h-52 w-full items-center justify-center overflow-hidden bg-[#020817]">
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
                    <div className="flex flex-col items-center justify-center text-blue-400/50 transition-colors group-hover:text-blue-400">
                      <span className="mb-2 text-5xl">
                        {work.fileType === 'website'
                          ? '🌐'
                          : work.fileType === 'pdf'
                            ? '📄'
                            : work.fileType === 'zip'
                              ? '📦'
                              : '📁'}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider">{work.fileType}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1 px-3 py-2 text-center">
                  <h3 className="line-clamp-1 text-[13px] font-semibold text-white">{work.title || 'Untitled'}</h3>
                  <p className="text-[11px] font-medium text-cyan-300">View Project -&gt;</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
            <p className="text-sm text-slate-400">
              Page {pagination.page} of {pagination.totalPages} ({pagination.totalCount} total)
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={!pagination.hasPrevPage}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!pagination.hasNextPage}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GalleryPage;
