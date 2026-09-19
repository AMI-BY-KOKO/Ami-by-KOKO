const YouTubeBanner: React.FC = () => {
  const youtubeUrl: string = "https://youtube.com/@amibykoko01?si=cGbl_bP9BiQMqoKE";

  return (
    <section className="relative lg:mx-auto sm:mx-6 md:mx-10 mx-4 my-8 max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-400 via-purple-500 to-pink-500 px-6 py-10 shadow-2xl md:px-12 md:py-12">

      {/* =========================
          Decorative Background
      ========================== */}

      {/* Sun */}
      <div
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-yellow-300 opacity-80 blur-[1px]"
        aria-hidden="true"
      />

      {/* Clouds */}
      <div
        className="absolute left-6 top-5 text-5xl opacity-70 animate-pulse"
        aria-hidden="true"
      >
        ☁️
      </div>

      <div
        className="absolute right-32 top-16 text-4xl opacity-60 animate-pulse"
        aria-hidden="true"
      >
        ☁️
      </div>

      <div
        className="absolute bottom-4 left-1/3 text-4xl opacity-50"
        aria-hidden="true"
      >
        ☁️
      </div>

      {/* Floating Stars */}
      <div
        className="absolute left-[15%] top-[25%] animate-bounce text-2xl"
        aria-hidden="true"
      >
        ⭐
      </div>

      <div
        className="absolute right-[20%] top-[35%] animate-pulse text-xl"
        aria-hidden="true"
      >
        ✨
      </div>

      <div
        className="absolute bottom-[20%] right-[8%] animate-bounce text-2xl"
        aria-hidden="true"
      >
        🌟
      </div>

      <div
        className="absolute bottom-[15%] left-[8%] animate-pulse text-xl"
        aria-hidden="true"
      >
        ⭐
      </div>

      {/* =========================
          Main Content
      ========================== */}

      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">

        {/* Text Area */}
        <div className="max-w-2xl text-center md:text-left">

          {/* Small Label */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white shadow-md backdrop-blur-sm">
            <span aria-hidden="true">🎬</span>
            <span>Our YouTube Channel</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-black leading-tight text-white drop-shadow-md md:text-5xl">
            Come Have Some
            <span className="block text-yellow-300">
              Fun With Us! 🚀
            </span>
          </h2>

          {/* Description */}
          <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-white/95 md:text-lg">
            Discover fun stories, exciting adventures, learning videos,
            songs, games and lots of smiles on our YouTube channel! 🌈
          </p>

          {/* Fun Features */}
          <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
              📚 Learn
            </span>

            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
              🎵 Sing
            </span>

            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
              🧩 Play
            </span>

            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
              🚀 Explore
            </span>
          </div>
        </div>

        {/* =========================
            YouTube Button
        ========================== */}

        <div className="relative shrink-0">

          {/* Glow behind button */}
          <div
            className="absolute inset-0 scale-110 rounded-full bg-yellow-300 opacity-40 blur-2xl"
            aria-hidden="true"
          />

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our YouTube channel"
            className="
              group
              relative
              flex
              items-center
              gap-3
              rounded-full
              border-4
              border-white
              bg-red-600
              px-7
              py-4
              text-lg
              font-black
              text-white
              shadow-[0_8px_0_#991b1b]
              transition-all
              duration-200
              hover:-translate-y-1
              hover:scale-105
              hover:bg-red-500
              hover:shadow-[0_10px_0_#991b1b]
              active:translate-y-1
              active:shadow-[0_4px_0_#991b1b]
              focus:outline-none
              focus:ring-4
              focus:ring-yellow-300
            "
          >
            {/* YouTube Icon */}
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 transition-transform duration-200 group-hover:rotate-6"
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.8 3.9-6.8 3.9Z" />
              </svg>
            </span>

            <span>Watch Us!</span>

            <span
              className="text-2xl transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </a>
        </div>
      </div>

      {/* Bottom Rainbow Decoration */}
      <div
        className="absolute bottom-0 left-0 h-2 w-full bg-gradient-to-r from-yellow-300 via-green-300 to-blue-300"
        aria-hidden="true"
      />
    </section>
  );
};

export default YouTubeBanner;