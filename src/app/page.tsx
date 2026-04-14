import { SiteHeader } from "@/components/SiteHeader";
import { InfoAlert } from "@/components/InfoAlert";
import { SearchBlock } from "@/components/SearchBlock";
import { TopicsSection } from "@/components/TopicsSection";
import { KBLists } from "@/components/KBLists";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactUsButton } from "@/components/ContactUsButton";

export default function Home() {
  return (
    <div className="SiteParent Home flex flex-col min-h-screen bg-[#f5f5f5]">
      <SiteHeader />
      {/* Header is fixed @ 94px; push content below it */}
      <div style={{ paddingTop: 94 }} className="flex flex-col">
        <InfoAlert />
        <main className="Site-content flex flex-col">
          <SearchBlock />
          <TopicsSection />
          <KBLists />
        </main>
      </div>
      <SiteFooter />
      <ContactUsButton />
    </div>
  );
}
