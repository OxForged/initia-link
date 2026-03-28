import { getPlatform } from "@/lib/platforms";

export default function Home() {
  const previewLinks = [
    { platformId: "website", label: "My Portfolio", gradient: "gradient-primary", shadow: "rgba(8,145,178,0.2)" },
    { platformId: "twitter", label: "Twitter / X", gradient: "gradient-secondary", shadow: "rgba(139,92,246,0.2)" },
    { platformId: "github", label: "GitHub", gradient: "gradient-accent", shadow: "rgba(8,145,178,0.15)" },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[75vh] text-center overflow-visible">
      {/* Floating gradient orbs - atmospheric background */}
      <div className="orb orb-pink w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 -top-20 -left-16 sm:-left-32" aria-hidden="true" />
      <div className="orb orb-orange w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 top-40 -right-12 sm:-right-24" aria-hidden="true" />
      <div className="orb orb-rose w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 bottom-10 left-1/4" aria-hidden="true" />

      {/* Hero heading */}
      <h1
        className="animate-fade-in-up delay-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight tracking-tight font-heading"
      >
        Your on-chain identity
        <br />
        <span className="gradient-text-animated">One link for everything</span>
      </h1>

      {/* Subtitle */}
      <p className="animate-fade-in-up delay-2 text-[#555] text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-xl leading-relaxed px-2">
        Create your link-in-bio page powered by your <span className="gradient-text-animated font-semibold">.init username</span>.
        Share links, receive <span className="gradient-text-animated font-semibold">INIT tips</span>, and connect with creators on <span className="relative font-semibold text-[var(--foreground)]">Initia<span className="absolute bottom-0 h-[2.5px] rounded-[1px] bg-[var(--accent)]" style={{ left: "-4%", animation: "drawUnderline 0.8s cubic-bezier(0.22,0.61,0.36,1) 0.8s forwards", width: 0, transform: "rotate(-0.8deg)" }} /></span>.
      </p>

      {/* CTA buttons */}
      <div className="animate-fade-in-up delay-3 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
        <a
          href="/edit"
          className="btn-press btn-shimmer gradient-primary text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold shadow-[0_4px_20px_rgba(8,145,178,0.3)] hover:shadow-[0_8px_32px_rgba(8,145,178,0.4)] hover:scale-105 transition-all duration-300 text-center"
        >
          Create Your Profile
        </a>
        <a
          href="/discover"
          className="btn-press bg-white border-2 border-[#d1e8ed] text-[#555] px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] hover:scale-105 transition-all duration-300 text-center"
        >
          Discover Profiles
        </a>
      </div>

      {/* Preview card */}
      <div className="animate-fade-in-up delay-5 mt-10 sm:mt-16 w-full max-w-xs">
        <div className="card-tilt bg-white rounded-2xl p-6 text-center shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
          {/* Avatar with gradient ring */}
          <div className="avatar-ring-gradient mx-auto mb-3 w-fit">
            <img src="https://api.dicebear.com/9.x/notionists/svg?seed=alice" alt="alice.init" className="w-14 h-14 rounded-full bg-[#e0f2fe] select-none pointer-events-none" draggable="false" />
          </div>
          <h3
            className="text-lg font-bold text-[var(--foreground)] font-heading"
              >
            alice.init
          </h3>
          <p className="text-[#888] text-sm mt-1">Web3 builder, coffee enthusiast</p>

          {/* Social stats */}
          <div className="flex justify-center gap-4 text-xs mt-2 mb-5">
            <span><b className="text-[var(--foreground)]">42</b> <span className="text-[var(--muted)]">followers</span></span>
            <span><b className="text-[var(--foreground)]">1.2</b> <span className="text-[var(--muted)]">INIT tipped</span></span>
          </div>

          {/* Link buttons */}
          <div className="flex flex-col gap-2.5">
            {previewLinks.map((link, idx) => {
              const platform = getPlatform(link.platformId);
              return (
                <div
                  key={link.platformId}
                  className={`animate-fade-in-up btn-shimmer ${link.gradient} rounded-xl py-2.5 px-4 text-sm text-white font-medium hover-lift cursor-default flex items-center justify-center gap-2.5`}
                  style={{
                    animationDelay: `${800 + idx * 150}ms`,
                    boxShadow: `0 2px 8px ${link.shadow}`,
                  }}
                >
                  <span className="opacity-90">{platform?.icon}</span>
                  <span>{link.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
