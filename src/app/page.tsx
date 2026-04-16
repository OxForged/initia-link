import React from "react";

export default function Home() {
  return (
    <div className="relative">

      {/* ── HERO ── */}
      <section className="relative pt-16 pb-20" style={{ overflow: "visible" }}>


        {/* Sticker: purple blob */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "48px",
            right: "-24px",
            width: "96px",
            height: "96px",
            background: "#8b5cf6",
            border: "2px solid var(--foreground)",
            borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
            boxShadow: "5px 5px 0 var(--foreground)",
            transform: "rotate(12deg)",
            opacity: 0.85,
          }}
        />

        <div className="flex flex-col lg:flex-row gap-12 items-center">

          {/* Left: copy */}
          <div className="flex-1 flex flex-col justify-center relative z-10 text-center lg:text-left">

            {/* Headline */}
            <h1
              className="font-heading"
              style={{
                fontSize: "clamp(22px, 2.8vw, 40px)",
                lineHeight: 1.05,
                fontWeight: 900,
                letterSpacing: "-0.025em",
                margin: "0 0 24px",
              }}
            >
              Your <em style={{ fontStyle: "italic", color: "#0891b2" }}>on-chain</em> identity.
              <br />
              <span className="lp-underline-word">One link</span> for everything.
            </h1>

            {/* Subtext */}
            <p
              className="mx-auto lg:mx-0"
              style={{
                fontSize: "16px",
                lineHeight: 1.6,
                color: "var(--text-secondary)",
                maxWidth: "440px",
                margin: "0 0 32px",
              }}
            >
              Create your link-in-bio powered by your{" "}
              <strong style={{ color: "var(--foreground)", fontWeight: 700, position: "relative", display: "inline-block" }}>
                .init username
                <svg
                  aria-hidden="true"
                  style={{ position: "absolute", left: 0, bottom: "-5px", width: "100%", height: "10px", overflow: "visible" }}
                  viewBox="0 0 200 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 2,7 C 60,4 140,3 198,6"
                    fill="none"
                    stroke="#0891b2"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    style={{
                      strokeDasharray: 205,
                      strokeDashoffset: 205,
                      animation: "drawStroke 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards",
                    }}
                  />
                </svg>
              </strong>
              . Share links, receive{" "}
              <strong style={{ color: "#0891b2", fontWeight: 700 }}>
                GAS tips
              </strong>
              , and build your on-chain presence on Initia.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a href="/edit" className="btn-fizz btn-fizz-primary">
                Create Your Profile
              </a>
              <a href="/discover" className="btn-fizz btn-fizz-ghost">
                Discover Profiles
              </a>
            </div>
          </div>

          {/* Right: profile card mockup */}
          <div
            className="flex-shrink-0 w-full mx-auto lg:mx-0"
            style={{ maxWidth: "320px", transform: "rotate(1.5deg)" }}
          >
            {/* Card: no overflow:hidden so avatar can float over banner */}
            <div className="fizz-card" style={{ position: "relative" }}>

              {/* Banner — clips own corners */}
              <div
                style={{
                  height: "88px",
                  background: "linear-gradient(135deg, #0891b2, #8b5cf6)",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "26px 26px 0 0",
                }}
              >
                <svg
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0.18,
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="lp-dots"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="2" cy="2" r="1.5" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#lp-dots)" />
                </svg>
              </div>

              <div style={{ padding: "0 20px 20px" }}>

                {/* Avatar — position relative + zIndex paints on top of banner */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "-36px",
                    marginBottom: "12px",
                    position: "relative",
                    zIndex: 20,
                  }}
                >
                  <div
                    style={{
                      borderRadius: "50%",
                      padding: "3px",
                      background: "linear-gradient(180deg, #F0F2F7 0%, #C8CCD6 50%, #9DA3B5 100%)",
                      border: "2px solid var(--foreground)",
                      boxShadow: "4px 4px 0 var(--foreground)",
                    }}
                  >
                    <img
                      src="https://api.dicebear.com/9.x/notionists/svg?seed=alice"
                      alt="alice.init"
                      draggable={false}
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        background: "#e0f2fe",
                        display: "block",
                      }}
                    />
                  </div>
                </div>

                {/* Identity */}
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                  <div
                    className="font-heading"
                    style={{
                      fontWeight: 900,
                      fontSize: "20px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    alice.init
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      marginTop: "3px",
                    }}
                  >
                    Web3 builder, coffee nerd
                  </div>
                </div>

                {/* Stats */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    border: "2px solid var(--foreground)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    marginBottom: "14px",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px 8px",
                      borderRight: "2px solid var(--foreground)",
                    }}
                  >
                    <div
                      className="font-heading"
                      style={{ fontWeight: 900, fontSize: "18px" }}
                    >
                      42
                    </div>
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "var(--muted)",
                      }}
                    >
                      Followers
                    </div>
                  </div>
                  <div style={{ textAlign: "center", padding: "10px 8px" }}>
                    <div
                      className="font-heading"
                      style={{
                        fontWeight: 900,
                        fontSize: "18px",
                        color: "#0891b2",
                      }}
                    >
                      1.2
                    </div>
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "var(--muted)",
                      }}
                    >
                      GAS Tipped
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {([
                    {
                      label: "My Portfolio", color: "#0891b2",
                      icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>,
                    },
                    {
                      label: "Twitter / X", color: "#8b5cf6",
                      icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
                    },
                    {
                      label: "GitHub", color: "#333",
                      icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>,
                    },
                  ] as { label: string; color: string; icon: React.ReactNode }[]).map((link) => (
                    <div
                      key={link.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 12px",
                        border: "2px solid var(--foreground)",
                        borderRadius: "10px",
                        boxShadow: "3px 3px 0 var(--foreground)",
                        background: "var(--card)",
                      }}
                    >
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "7px",
                          background: `${link.color}18`,
                          border: "2px solid var(--foreground)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: link.color,
                          flexShrink: 0,
                        }}
                      >
                        {link.icon}
                      </div>
                      <span
                        className="font-heading"
                        style={{ fontWeight: 800, fontSize: "13px" }}
                      >
                        {link.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "64px 0 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            className="font-heading"
            style={{
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "12px",
            }}
          >
            How it works
          </div>
          <h2
            className="font-heading"
            style={{
              fontSize: "clamp(32px, 4.5vw, 52px)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              margin: 0,
            }}
          >
            Three steps,{" "}
            <em style={{ fontStyle: "italic", color: "#8b5cf6" }}>one link</em>.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {[
            {
              iconBg: "#0891b2",
              step: "Step 01",
              title: "Register .init",
              desc: "Claim your unique .init username on Initia. It becomes the home of your on-chain identity and presence.",
              rotate: "-1.2deg",
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              ),
            },
            {
              iconBg: "#8b5cf6",
              step: "Step 02",
              title: "Add Your Links",
              desc: "Add all your socials, portfolio, and content in one place. Customise with themes.",
              rotate: "0.4deg",
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                </svg>
              ),
            },
            {
              iconBg: "#0891b2",
              step: "Step 03",
              title: "Earn GAS Tips",
              desc: "Anyone can tip you directly in GAS tokens. On-chain, instant, no intermediaries needed.",
              rotate: "1.4deg",
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                </svg>
              ),
            },
          ].map((card) => (
            <div
              key={card.title}
              className="fizz-card"
              style={{ padding: "24px", transform: `rotate(${card.rotate})` }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: card.iconBg,
                  border: "2px solid var(--foreground)",
                  boxShadow: "4px 4px 0 var(--foreground)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                {card.icon}
              </div>
              <div
                className="font-heading"
                style={{
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: "11px",
                  color: "var(--muted)",
                  marginBottom: "4px",
                  letterSpacing: "0.04em",
                }}
              >
                {card.step}
              </div>
              <h3
                className="font-heading"
                style={{
                  fontWeight: 900,
                  fontSize: "20px",
                  letterSpacing: "-0.015em",
                  margin: "0 0 10px",
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA CARD ── */}
      <section style={{ paddingBottom: "64px" }}>
        <div
          className="fizz-card"
          style={{
            padding: "64px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative orbs */}
          <div
            style={{
              position: "absolute",
              top: "-60px",
              left: "-60px",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "#0891b2",
              opacity: 0.1,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-50px",
              right: "-50px",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background: "#8b5cf6",
              opacity: 0.12,
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              className="font-heading"
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "14px",
              }}
            >
              Get started today
            </div>
            <h2
              className="font-heading"
              style={{
                fontSize: "clamp(32px, 4.5vw, 60px)",
                fontWeight: 900,
                lineHeight: 0.96,
                letterSpacing: "-0.025em",
                margin: "0 0 28px",
              }}
            >
              Bring your{" "}
              <em style={{ fontStyle: "italic", color: "#0891b2" }}>
                identity
              </em>
              <br />
              on-chain.
            </h2>
            <a
              href="/edit"
              className="btn-fizz btn-fizz-primary"
              style={{ fontSize: "17px", padding: "18px 32px" }}
            >
              Create Your Profile
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
