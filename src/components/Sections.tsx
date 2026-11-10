import { FeatureRail } from "@/components/FeatureRail";

const speedBars = [
  { label: "CSULBreach", value: 100, highlight: true },
  { label: "Club A", value: 62 },
  { label: "Club B", value: 47 },
  { label: "Club C", value: 38 },
];

function SpeedChart() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
      <p className="mb-4 font-mono text-xs text-muted-foreground">
        events hosted / semester
      </p>
      <div className="space-y-3">
        {speedBars.map((bar) => (
          <div key={bar.label} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs text-muted-foreground">
              {bar.label}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={
                  bar.highlight
                    ? "h-full rounded-full bg-primary"
                    : "h-full rounded-full bg-foreground/25"
                }
                style={{ width: `${bar.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const workshopTracks = [
  { name: "Web Exploitation", level: "Beginner" },
  { name: "Reverse Engineering", level: "Intermediate" },
  { name: "Cryptography", level: "Intermediate" },
  { name: "Capture the Flag", level: "All levels" },
];

function TrackCards() {
  return (
    <div className="grid w-full max-w-sm grid-cols-1 gap-3">
      {workshopTracks.map((track) => (
        <div
          key={track.name}
          className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
        >
          <span className="text-sm font-medium">{track.name}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {track.level}
          </span>
        </div>
      ))}
    </div>
  );
}

const tools = ["Kali Linux", "Burp Suite", "Wireshark", "Ghidra", "Metasploit", "Nmap"];

function ToolBadges() {
  return (
    <div className="flex w-full max-w-sm flex-wrap gap-2">
      {tools.map((tool) => (
        <span
          key={tool}
          className="rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs"
        >
          {tool}
        </span>
      ))}
    </div>
  );
}

const dataPoints = [
  { title: "Private", body: "What happens in our workshops stays in our workshops." },
  { title: "Hands-on", body: "Practice on real labs, not just slides." },
  { title: "Peer-led", body: "Sessions run by fellow students, for students." },
  { title: "Open", body: "Beginners welcome — no experience required." },
];

function DataGrid() {
  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-4">
      {dataPoints.map((point) => (
        <div key={point.title} className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-semibold">{point.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{point.body}</p>
        </div>
      ))}
    </div>
  );
}

function MembershipCard() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
      <p className="text-sm font-medium text-muted-foreground">Membership</p>
      <p className="mt-1 text-3xl font-semibold">Free</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Open to every CSULB student, every major
      </p>
      <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Weekly meetings</span>
          <span>Included</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">CTF team</span>
          <span>Included</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Workshops</span>
          <span>Included</span>
        </div>
      </div>
    </div>
  );
}

export function Sections() {
  return (
    <>
      <FeatureRail
        id="rail-1"
        eyebrow="Reliably active"
        heading="More events than any club on campus."
        body="Weekly meetings, hands-on labs, and semester-long CTF prep so members are always building something."
        visual={<SpeedChart />}
      />
      <FeatureRail
        id="rail-2"
        eyebrow="Frontier skills"
        heading="Learn the tracks that matter."
        body="From web exploitation to reverse engineering, our workshops cover the skills real security teams use."
        link={{ label: "Browse all workshops", href: "#events" }}
        visual={<TrackCards />}
        reverse
      />
      <FeatureRail
        id="rail-3"
        eyebrow="Keep your setup"
        heading="Work with the tools the industry uses."
        body="Every session is built around the real tools you'll use on the job — no toy environments."
        link={{ label: "See all tools", href: "#events" }}
        visual={<ToolBadges />}
      />
      <FeatureRail
        id="rail-4"
        eyebrow="Your data stays yours"
        heading="A club built on trust."
        body="A welcoming, low-pressure space to learn security skills — beginners included."
        link={{ label: "How we run sessions", href: "#members" }}
        visual={<DataGrid />}
        reverse
      />
      <FeatureRail
        id="rail-5"
        eyebrow="Always free"
        heading="No dues, no hidden costs."
        body="Membership is free for every CSULB student. Show up, join the Discord, and start learning."
        link={{ label: "Join the club", href: "#members" }}
        visual={<MembershipCard />}
      />
    </>
  );
}
