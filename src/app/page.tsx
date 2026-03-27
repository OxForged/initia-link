export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-5xl font-bold mb-4">
        Your on-chain identity.
        <br />
        <span className="text-[var(--accent)]">One link for everything.</span>
      </h1>
      <p className="text-[var(--muted)] text-lg mb-8 max-w-xl">
        Create your link-in-bio page powered by your .init username.
        Share links, receive INIT tips, and connect with creators on Initia.
      </p>
      <div className="flex gap-4">
        <a
          href="/edit"
          className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Create Your Profile
        </a>
        <a
          href="/discover"
          className="border border-[var(--card-border)] hover:border-[var(--accent)] px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Discover Profiles
        </a>
      </div>

      <div className="mt-16 w-full max-w-sm">
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--accent)] mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
            A
          </div>
          <h3 className="text-lg font-semibold">alice.init</h3>
          <p className="text-[var(--muted)] text-sm mt-1 mb-6">Web3 builder, coffee enthusiast</p>
          <div className="flex flex-col gap-3">
            <div className="bg-[var(--background)] border border-[var(--card-border)] rounded-lg py-3 px-4 text-sm hover:border-[var(--accent)] transition-colors cursor-pointer">
              My Portfolio
            </div>
            <div className="bg-[var(--background)] border border-[var(--card-border)] rounded-lg py-3 px-4 text-sm hover:border-[var(--accent)] transition-colors cursor-pointer">
              Twitter / X
            </div>
            <div className="bg-[var(--background)] border border-[var(--card-border)] rounded-lg py-3 px-4 text-sm hover:border-[var(--accent)] transition-colors cursor-pointer">
              GitHub
            </div>
          </div>
          <p className="text-xs text-[var(--muted)] mt-4">Preview - this could be you</p>
        </div>
      </div>
    </div>
  );
}
