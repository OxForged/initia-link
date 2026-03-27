export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-5xl font-extrabold mb-4 leading-tight">
        Your on-chain identity.
        <br />
        <span className="gradient-primary gradient-text">One link for everything.</span>
      </h1>
      <p className="text-[#888] text-lg mb-8 max-w-xl">
        Create your link-in-bio page powered by your .init username.
        Share links, receive INIT tips, and connect with creators on Initia.
      </p>
      <div className="flex gap-4">
        <a
          href="/edit"
          className="gradient-primary text-white px-7 py-3 rounded-xl font-semibold shadow-[0_4px_16px_rgba(244,63,94,0.3)] hover:opacity-90 transition-opacity"
        >
          Create Your Profile
        </a>
        <a
          href="/discover"
          className="bg-white border-2 border-[#f0d0c0] text-[#666] px-7 py-3 rounded-xl font-semibold hover:border-[var(--accent)] transition-colors"
        >
          Discover Profiles
        </a>
      </div>

      <div className="mt-16 w-full max-w-sm">
        <div className="bg-white rounded-2xl p-8 text-center shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
          <div className="w-16 h-16 rounded-full gradient-accent mx-auto mb-3"></div>
          <h3 className="text-lg font-bold text-[var(--foreground)]">alice.init</h3>
          <p className="text-[#888] text-sm mt-1 mb-6">Web3 builder, coffee enthusiast</p>
          <div className="flex flex-col gap-3">
            <div className="gradient-primary rounded-xl py-3 px-4 text-sm text-white font-medium shadow-[0_2px_8px_rgba(244,63,94,0.2)]">
              My Portfolio
            </div>
            <div className="gradient-secondary rounded-xl py-3 px-4 text-sm text-white font-medium shadow-[0_2px_8px_rgba(251,146,60,0.2)]">
              Twitter / X
            </div>
            <div className="gradient-accent rounded-xl py-3 px-4 text-sm text-white font-medium shadow-[0_2px_8px_rgba(244,114,182,0.2)]">
              GitHub
            </div>
          </div>
          <p className="text-xs text-[#bbb] mt-4">Preview - this could be you</p>
        </div>
      </div>
    </div>
  );
}
