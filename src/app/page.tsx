import { getPlatform } from "@/lib/platforms";

export default function Home() {
  const previewLinks = [
    { platformId: "website", label: "My Portfolio", bgClass: "bg-teal-50", textClass: "text-[#0891b2]", hoverBorder: "hover:border-teal-200" },
    { platformId: "twitter", label: "Twitter / X", bgClass: "bg-purple-50", textClass: "text-[#8b5cf6]", hoverBorder: "hover:border-purple-200" },
    { platformId: "github", label: "GitHub", bgClass: "bg-gray-50", textClass: "text-gray-700", hoverBorder: "hover:border-gray-300" },
  ];

  return (
    <div className="relative min-h-[80vh] overflow-visible">
      {/* Atmospheric orbs */}
      <div
        className="fixed top-[-8rem] right-[-10rem] w-[500px] h-[500px] rounded-full opacity-25 pointer-events-none z-0"
        style={{ background: '#8b5cf6', filter: 'blur(100px)' }}
        aria-hidden="true"
      />
      <div
        className="fixed top-[33%] left-[-8rem] w-[400px] h-[400px] rounded-full opacity-25 pointer-events-none z-0"
        style={{ background: '#0891b2', filter: 'blur(100px)' }}
        aria-hidden="true"
      />

      {/* Hero: 2-column layout */}
      <section className="pt-4 sm:pt-8 lg:pt-12 pb-8 lg:pb-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-center">

          {/* Left: Text */}
          <div className="flex-1 flex flex-col justify-center relative z-20 text-center lg:text-left">
            <h1 className="animate-fade-in-up delay-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight font-heading mb-4">
              Your on-chain identity
              <br />
              <span className="gradient-text-animated">One link for everything</span>
            </h1>

            <p className="animate-fade-in-up delay-2 text-[var(--text-secondary)] text-sm sm:text-base md:text-lg mb-8 max-w-xl leading-relaxed mx-auto lg:mx-0">
              Create your link-in-bio page powered by your <span className="gradient-text-animated font-semibold whitespace-nowrap">.init username</span>.
              Share links, receive <span className="gradient-text-animated font-semibold">GAS tips</span>, and connect with creators on <span className="relative font-semibold text-[var(--foreground)]">initia<span className="absolute bottom-0 h-[2.5px] rounded-[1px] bg-[var(--accent)]" style={{ left: "-4%", animation: "drawUnderline 0.8s cubic-bezier(0.22,0.61,0.36,1) 0.8s forwards", width: 0, transform: "rotate(-0.8deg)" }} /></span>.
            </p>

            <div className="animate-fade-in-up delay-3 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a
                href="/edit"
                className="btn-press btn-shimmer gradient-accent text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold shadow-[0_4px_20px_rgba(8,145,178,0.3)] hover:shadow-[0_8px_28px_rgba(8,145,178,0.35)] hover:-translate-y-0.5 transition-all duration-300 text-center text-sm"
              >
                Create Your Profile
              </a>
              <a
                href="/discover"
                className="btn-press bg-[var(--card)] border border-[var(--card-border)] text-[var(--text-secondary)] px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300 text-center text-sm"
              >
                Discover Profiles
              </a>
            </div>
          </div>

          {/* Right: Preview profile card */}
          <div className="flex-shrink-0 flex justify-center relative w-full max-w-[360px]">

            {/* The profile card */}
            <div
              className="relative w-full backdrop-blur-xl rounded-[2rem] p-2 animate-fade-in-up delay-4"
              style={{ backgroundColor: 'color-mix(in srgb, var(--card) 80%, transparent)', boxShadow: '0 20px 40px -10px rgba(139,92,246,0.15), 0 0 20px 0px rgba(8,145,178,0.05)' }}
            >
              <div className="bg-[var(--card)] rounded-[1.75rem] p-5 sm:p-6 h-full" style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.04)' }}>

                {/* Cover banner */}
                <div className="h-24 sm:h-28 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 rounded-t-[1.75rem] relative overflow-hidden group/banner" style={{ background: 'linear-gradient(to right, var(--theme-gradient-from, #0891b2), var(--theme-gradient-to, #8b5cf6))' }}>
                  <div className="absolute top-2 right-3 hidden group-hover/banner:flex items-center gap-1 rounded-full py-1 px-2.5 text-[10px] font-semibold text-white z-10 shadow-lg" style={{ background: 'linear-gradient(135deg, #0891b2, #8b5cf6)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/></svg>
                    Cover Banner
                  </div>
                  <svg className="absolute inset-0 w-full h-full opacity-20" style={{ mixBlendMode: 'overlay' }} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="dotgrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="#8b5cf6" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dotgrid)" />
                  </svg>
                </div>

                {/* Avatar */}
                <div className="relative flex justify-center -mt-14 sm:-mt-16 mb-3 group/avatar">
                  <div className="rounded-full p-[5px]" style={{ background: 'linear-gradient(135deg, #0891b2, #8b5cf6)', boxShadow: '0 8px 24px rgba(139,92,246,0.2)' }}>
                    <img
                      src="https://api.dicebear.com/9.x/notionists/svg?seed=alice"
                      alt="alice.init"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[var(--card)] object-cover bg-[var(--card)] select-none pointer-events-none"
                      draggable="false"
                    />
                    <div className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-green-400 border-2 border-[var(--card)] rounded-full" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 hidden group-hover/avatar:flex items-center gap-1 rounded-full py-1 px-2.5 text-[10px] font-semibold text-white z-10 shadow-lg whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #0891b2, #8b5cf6)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    Avatar
                  </div>
                </div>

                {/* Identity */}
                <div className="text-center mb-5 group/identity relative">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 hidden group-hover/identity:flex items-center gap-1 rounded-full py-1 px-2.5 text-[10px] font-semibold text-white z-10 shadow-lg whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #0891b2, #8b5cf6)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z"/></svg>
                    .init Identity
                  </div>
                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-[var(--foreground)]">alice.init</h2>
                  <p className="text-sm text-[var(--muted)] mt-1">Web3 builder, coffee enthusiast</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-5 p-3 rounded-2xl border border-[var(--card-border)] group/stats relative" style={{ background: 'var(--surface)' }}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 hidden group-hover/stats:flex items-center gap-1 rounded-full py-1 px-2.5 text-[10px] font-semibold text-white z-10 shadow-lg whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #0891b2, #8b5cf6)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
                    Social Stats
                  </div>
                  <div className="text-center border-r border-[var(--card-border)]">
                    <p className="text-lg sm:text-xl font-heading font-bold text-[var(--foreground)]">42</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg sm:text-xl font-heading font-bold gradient-text-animated">1.2</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">GAS Tipped</p>
                  </div>
                </div>

                {/* Link buttons */}
                <div className="flex flex-col gap-2 group/links relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 hidden group-hover/links:flex items-center gap-1 rounded-full py-1 px-2.5 text-[10px] font-semibold text-white z-10 shadow-lg whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #0891b2, #8b5cf6)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
                    Links
                  </div>
                  {previewLinks.map((link) => {
                    const platform = getPlatform(link.platformId);
                    return (
                      <div
                        key={link.platformId}
                        className={`flex items-center gap-3 p-2.5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-sm ${link.hoverBorder} hover:shadow-md transition-all cursor-default`}
                      >
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${link.bgClass} ${link.textClass} flex items-center justify-center`}>
                          <span className="text-base sm:text-lg">{platform?.icon}</span>
                        </div>
                        <span className="font-bold text-[var(--foreground)] text-sm">{link.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
