const YouTubeBanner: React.FC = () => {
  const youtubeUrl = "https://youtube.com/@amibykoko01?si=cGbl_bP9BiQMqoKE";

  return (
    <section className="mx-auto mt-6 w-full rounded-[28px] border border-orange-200 bg-gradient-to-br from-orange-600 via-orange-500 to-red-400 p-4 shadow-[0_12px_30px_rgba(239,68,68,0.20)] ring-1 ring-orange-200 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-2xl shadow-sm ring-1 ring-red-100">
            🎬
          </div>

          <div className="min-w-0">
            <p className="text-[15px] font-bold uppercase tracking-[0.12em] text-red-800">
              YouTube
            </p>
            <h3 className="mt-1 text-lg font-extrabold text-white md:text-xl">
              Watch our fun learning videos
            </h3>
            <p className="mt-1 text-sm text-white">
              Songs, stories, games and adventures to keep learning joyful.
            </p>
          </div>
        </div>

        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our YouTube channel"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-red-700 transition hover:bg-red-500 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-red-100"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.8 3.9-6.8 3.9Z" />
            </svg>
          </span>
          Watch now
        </a>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {['Stories 📖', 'Songs 🎶', 'Games 🎮', 'Learning 📚'].map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700 ring-1 ring-orange-100"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
};

export default YouTubeBanner;