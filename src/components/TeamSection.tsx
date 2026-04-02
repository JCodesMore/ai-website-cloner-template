"use client";

export function TeamSection() {
  return (
    <section
      className="px-6"
      style={{
        paddingBlock: "clamp(3rem, 2rem + 4vw, 6rem)",
      }}
    >
      <div className="mx-auto max-w-[67.5rem]">
        <div className="mb-10 max-w-[40rem]">
          <h2
            className="mb-4 font-bold tracking-[-0.01em]"
            style={{
              fontSize: "clamp(1.5rem, 0.8838rem + 2.6291vw, 3.25rem)",
              lineHeight: 1.16,
              color: "#151c28",
            }}
          >
            Our team interface is for collaboration
          </h2>
          <p
            className="max-w-[36rem]"
            style={{
              fontSize: "clamp(1rem, 0.912rem + 0.3756vw, 1.25rem)",
              color: "#4d5e80",
              lineHeight: 1.5,
            }}
          >
            Easily create teams, assign roles to new members, and manage users
            — add, edit, or freeze them whenever needed
          </p>
        </div>

        <div
          className="relative overflow-hidden"
          style={{ borderRadius: "1.75rem", aspectRatio: "16 / 9" }}
        >
          <video
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="/images/team-interface-poster.png"
          >
            <source src="/videos/team-interface.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
