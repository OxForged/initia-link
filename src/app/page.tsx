import { getPlatform } from "@/lib/platforms";

export default function Home() {
  const previewLinks = [
    { platformId: "website", label: "My Portfolio", gradient: "gradient-primary", shadow: "rgba(8,145,178,0.2)" },
    { platformId: "twitter", label: "Twitter / X", gradient: "gradient-secondary", shadow: "rgba(139,92,246,0.2)" },
    { platformId: "github", label: "GitHub", gradient: "gradient-accent", shadow: "rgba(8,145,178,0.15)" },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[75vh] text-center overflow-hidden">
      {/* Floating gradient orbs - atmospheric background */}
      <div className="orb orb-pink w-72 h-72 -top-20 -left-32" aria-hidden="true" />
      <div className="orb orb-orange w-56 h-56 top-40 -right-24" aria-hidden="true" />
      <div className="orb orb-rose w-48 h-48 bottom-10 left-1/4" aria-hidden="true" />

      {/* Hero heading */}
      <h1
        className="animate-fade-in-up delay-0 text-5xl md:text-6xl font-bold mb-4 leading-tight tracking-tight font-heading"
      >
        Your on-chain identity.
        <br />
        <span className="gradient-text-animated">One link for everything.</span>
      </h1>

      {/* Subtitle */}
      <p className="animate-fade-in-up delay-2 text-[#888] text-lg mb-10 max-w-xl leading-relaxed">
        Create your link-in-bio page powered by your .init username.
        Share links, receive INIT tips, and connect with creators on Initia.
      </p>

      {/* CTA buttons */}
      <div className="animate-fade-in-up delay-3 flex gap-4">
        <a
          href="/edit"
          className="btn-press btn-shimmer gradient-primary text-white px-8 py-3.5 rounded-xl font-semibold shadow-[0_4px_20px_rgba(8,145,178,0.3)] hover:shadow-[0_8px_32px_rgba(8,145,178,0.4)] hover:scale-105 transition-all duration-300"
        >
          Create Your Profile
        </a>
        <a
          href="/discover"
          className="btn-press bg-white border-2 border-[#d1e8ed] text-[#555] px-8 py-3.5 rounded-xl font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] hover:scale-105 transition-all duration-300"
        >
          Discover Profiles
        </a>
      </div>

      {/* Preview card */}
      <div className="animate-fade-in-up delay-5 mt-16 w-full max-w-xs">
        <div className="card-tilt bg-white rounded-2xl p-6 text-center shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
          {/* Avatar with gradient ring */}
          <div className="avatar-ring-gradient mx-auto mb-3 w-fit">
            <div className="w-14 h-14 rounded-full gradient-animated" />
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
