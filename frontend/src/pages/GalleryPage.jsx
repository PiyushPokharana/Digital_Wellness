import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWorks } from '../services/api';

const GalleryPage = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    sort: 'newest',
  });

  useEffect(() => {
    fetchWorks();
  }, [filters]);

  const fetchWorks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWorks(filters);
      setWorks(response.works || []);
    } catch (err) {
      setError(err.message || 'Failed to load works');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-slate-100">

      {/* Heading */}
      <div className="space-y-1">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Latest Gallery</p>
        <h1 className="text-4xl font-semibold text-white">Featured Works</h1>
      </div>

      {/* Filters */}
      <div className="backdrop-blur rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/40">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by name or title"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
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
            <label className="block text-sm font-medium text-slate-400 mb-2">Sort By</label>
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

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-400"></div>
          <p className="mt-4 text-slate-400">Loading works...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <p className="text-red-200 font-semibold">Error loading works</p>
          <p className="text-red-300 mt-2">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && works.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40">
          <p className="text-slate-200 text-lg">No works found</p>
          <Link
            to="/upload"
            className="mt-4 inline-flex rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg"
          >
            Upload Your Work
          </Link>
        </div>
      )}

      {/* Gallery Grid - matching home page format */}
      {!loading && !error && works.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {works.map((work) => (
            <Link
              key={work._id}
              to={`/work/${work._id}`}
              className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-500 transition group"
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
                  {work.title || 'Untitled'}
                </h3>
                <p className="text-[11px] text-cyan-300 font-medium">
                  View Project →
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
};

export default GalleryPage;
