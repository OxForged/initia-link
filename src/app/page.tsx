import { getPlatform } from "@/lib/platforms";

export default function Home() {
  const previewLinks = [
    { platformId: "website", label: "My Portfolio", gradient: "gradient-primary", shadow: "rgba(244,63,94,0.2)" },
    { platformId: "twitter", label: "Twitter / X", gradient: "gradient-secondary", shadow: "rgba(251,146,60,0.2)" },
    { platformId: "github", label: "GitHub", gradient: "gradient-accent", shadow: "rgba(244,114,182,0.2)" },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[75vh] text-center overflow-hidden">
      {/* Floating gradient orbs - atmospheric background */}
      <div className="orb orb-pink w-72 h-72 -top-20 -left-32" aria-hidden="true" />
      <div className="orb orb-orange w-56 h-56 top-40 -right-24" aria-hidden="true" />
      <div className="orb orb-rose w-48 h-48 bottom-10 left-1/4" aria-hidden="true" />

      {/* Hero heading */}
      <h1
        className="animate-fade-in-up delay-0 text-5xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tight"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
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
          className="btn-press btn-shimmer gradient-primary text-white px-8 py-3.5 rounded-xl font-semibold shadow-[0_4px_20px_rgba(244,63,94,0.35)] hover:shadow-[0_8px_32px_rgba(244,63,94,0.45)] hover:scale-105 transition-all duration-300"
        >
          Create Your Profile
        </a>
        <a
          href="/discover"
          className="btn-press bg-white border-2 border-[#f0d0c0] text-[#666] px-8 py-3.5 rounded-xl font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] hover:scale-105 transition-all duration-300"
        >
          Discover Profiles
        </a>
      </div>

      {/* Preview card with float animation */}
      <div className="animate-fade-in-up delay-5 mt-20 w-full max-w-sm">
        <div className="animate-float-slow bg-white rounded-2xl p-8 text-center shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_48px_rgba(244,114,182,0.15)] transition-shadow duration-500">
          {/* Avatar with glow pulse */}
          <div className="w-16 h-16 rounded-full gradient-animated mx-auto mb-3 animate-pulse-glow" />
          <h3
            className="text-lg font-bold text-[var(--foreground)]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            alice.init
          </h3>
          <p className="text-[#888] text-sm mt-1 mb-6">Web3 builder, coffee enthusiast</p>
          <div className="flex flex-col gap-3">
            {previewLinks.map((link, idx) => {
              const platform = getPlatform(link.platformId);
              return (
                <div
                  key={link.platformId}
                  className={`animate-fade-in-up delay-${6 + idx} btn-shimmer ${link.gradient} rounded-xl py-3 px-4 text-sm text-white font-medium shadow-[0_2px_8px_${link.shadow}] hover-lift cursor-default flex items-center justify-center gap-2.5`}
                >
                  <span className="opacity-90">{platform?.icon}</span>
                  <span>{link.label}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[#bbb] mt-5 animate-fade-in delay-8">Preview - this could be you</p>
        </div>
      </div>
    </div>
  );
}
