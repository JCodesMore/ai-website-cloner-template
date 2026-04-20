import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  HandHelping,
  HeartHandshake,
  LayoutTemplate,
  MessageSquareText,
  Mic,
  Rocket,
  ScanText,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const navigation = [
  { href: "#home", label: "Trang chủ" },
  { href: "#solutions", label: "Dịch vụ" },
  { href: "#about", label: "Giới thiệu" },
];

const pillars = [
  {
    title: "Robot Dodomio",
    description:
      "Nền tảng robot tương tác dành cho giáo dục, trợ lý gia đình, mẹ & bé và các trải nghiệm AI hiện thân.",
    icon: Bot,
  },
  {
    title: "AI Solutions",
    description:
      "Bộ sản phẩm AI cho cơ quan, doanh nghiệp và đội ngũ vận hành: đọc hiểu tài liệu, tóm tắt, biên bản, slide và tự động hóa quy trình.",
    icon: BrainCircuit,
  },
];

const homeUseCases = [
  {
    title: "Giáo dục tương tác",
    description: "Robot cùng AI giúp trẻ học từ vựng, giao tiếp và khám phá tri thức theo cách trực quan.",
    icon: GraduationCap,
  },
  {
    title: "Trợ lý gia đình",
    description: "Dodo hỗ trợ nhắc việc, trò chuyện, cập nhật thông tin và kết nối lịch sinh hoạt trong nhà.",
    icon: HeartHandshake,
  },
  {
    title: "Mẹ & bé",
    description: "Một người bạn an toàn để kể chuyện, gợi ý hoạt động và hỗ trợ phụ huynh trong chăm sóc sớm.",
    icon: HandHelping,
  },
  {
    title: "Đọc & tóm tắt văn bản",
    description: "AI rút gọn hồ sơ, tài liệu dài và trả về các điểm chính theo đúng ngữ cảnh công việc.",
    icon: ScanText,
  },
  {
    title: "Dự thảo văn bản",
    description: "Tăng tốc soạn thảo công văn, thông báo, đề xuất và văn bản nghiệp vụ với trợ lý AI chuyên biệt.",
    icon: FileText,
  },
  {
    title: "Slide, báo cáo, biên bản",
    description: "Tự động hóa việc tổng hợp nội dung họp, lên khung báo cáo và dựng slide trình bày nhanh hơn.",
    icon: LayoutTemplate,
  },
];

const testimonials = [
  {
    quote:
      "Dodomio giúp chúng tôi trình diễn một câu chuyện AI rất dễ hiểu: có robot thật, có use case thật và khách hàng cảm nhận được giá trị ngay.",
    name: "Khối đổi mới sáng tạo",
    role: "Đối tác triển khai giáo dục",
  },
  {
    quote:
      "Công chức.ai rút ngắn đáng kể thời gian đọc hồ sơ và chuẩn bị biên bản. Đội ngũ làm việc nhanh hơn nhưng vẫn giữ được kiểm soát nội dung.",
    name: "Ban vận hành",
    role: "Khách hàng khu vực công",
  },
  {
    quote:
      "Điểm mạnh của DODOMIO là kết hợp hardware và AI thành một trải nghiệm liền mạch, chứ không chỉ là chatbot hoặc robot đơn lẻ.",
    name: "Đối tác chiến lược",
    role: "Hệ sinh thái chuyển đổi số",
  },
];

const productCards = [
  {
    title: "Robot AI Dodomio",
    subtitle: "Sản phẩm chủ lực",
    description:
      "Robot tương tác với khả năng trò chuyện, hiển thị nội dung, gợi ý hoạt động, kể chuyện và đồng hành cùng người dùng trong nhiều bối cảnh.",
    bullets: ["Giáo dục", "Trợ lý", "Mẹ & bé", "Tính năng AI mở rộng"],
    icon: Bot,
  },
  {
    title: "Công chức.ai",
    subtitle: "AI cho nghiệp vụ",
    description:
      "Bộ công cụ AI dành cho đọc hiểu, tóm tắt văn bản, dự thảo nội dung, lên slide/báo cáo và tạo biên bản họp cho đội ngũ hành chính.",
    bullets: ["Tóm tắt văn bản", "Dự thảo nội dung", "Slide / báo cáo", "Biên bản họp"],
    icon: BriefcaseBusiness,
  },
  {
    title: "BMP.AI",
    subtitle: "Dịch vụ AI",
    description:
      "Tư vấn, triển khai và tích hợp AI vào quy trình hiện hữu của doanh nghiệp, từ chiến lược đến hệ thống vận hành thực tế.",
    bullets: ["Tư vấn AI", "Tích hợp hệ thống", "Thiết kế use case", "Đồng hành triển khai"],
    icon: Sparkles,
  },
];

const caseResults = [
  {
    value: "3x",
    title: "Tăng tốc chuẩn bị tài liệu",
    description: "Rút ngắn quy trình tổng hợp, tóm tắt và soạn thảo cho nhóm vận hành và hành chính.",
  },
  {
    value: "90%",
    title: "Tăng mức độ tương tác",
    description: "Mô hình robot + AI giúp nội dung trở nên gần gũi hơn với trẻ em, phụ huynh và khách tham quan.",
  },
  {
    value: "24/7",
    title: "Sẵn sàng hỗ trợ",
    description: "Trợ lý AI hoạt động liên tục để cung cấp thông tin, demo khả năng và thu thập nhu cầu khách hàng.",
  },
];

const customerLogos = ["GovTech", "EduLab", "KidSpace", "Smart Office", "Digital Hub", "FutureCare"];

const companyPillars = [
  {
    title: "Về công ty",
    description: "DODOMIO xây dựng các trải nghiệm robot và AI thân thiện, thực dụng và dễ triển khai cho thị trường Việt Nam.",
    icon: Rocket,
  },
  {
    title: "Tầm nhìn – sứ mệnh",
    description: "Biến AI thành một năng lực gần gũi, hữu ích và có thể chạm tới trong giáo dục, gia đình và doanh nghiệp.",
    icon: BrainCircuit,
  },
  {
    title: "Đội ngũ",
    description: "Kết hợp chuyên gia sản phẩm, AI, triển khai giải pháp và storytelling công nghệ để đưa ý tưởng vào thực tế.",
    icon: Users,
  },
  {
    title: "Năng lực AI",
    description: "Thiết kế use case, tinh chỉnh quy trình, xây hệ thống trợ lý và tích hợp vào hành trình vận hành hiện có.",
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fcfbff] text-[#24153a]">
      <section
        id="home"
        className="relative overflow-hidden bg-white"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/dodo/home.png"
            alt="Dodomio robotics hero"
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.02)_100%)] lg:hidden" />

        <header className="relative z-10 mx-auto flex max-w-[1600px] items-center justify-between px-6 py-8 sm:px-10 lg:px-14 lg:py-10">
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/images/dodo/dodomio-logo.png"
              alt="DODOMIO Robotics"
              width={240}
              height={120}
              className="h-auto w-[150px] sm:w-[190px] lg:w-[240px]"
              priority
            />
          </Link>
          <div className="hidden items-center gap-12 lg:flex">
            <nav className="flex items-center gap-12">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[18px] font-normal text-white/95 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link
              href="#contact"
              className="inline-flex items-center bg-white px-8 py-4 text-[18px] font-semibold text-[#6d25c3] shadow-[0_16px_35px_rgba(86,33,163,0.16)] transition-transform hover:-translate-y-0.5"
            >
              Liên hệ
            </Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto max-w-[1600px] px-6 pb-20 pt-8 sm:px-10 lg:px-14 lg:pb-24 lg:pt-12">
          <div className="max-w-[620px] lg:ml-[2px] lg:mt-8">
            <h1 className="text-[54px] font-semibold leading-[0.95] tracking-[-0.065em] text-[#232c37] sm:text-[72px] lg:text-[92px]">
              ROBOT
              <br />
              THÔNG MINH
            </h1>
            <p className="mt-6 max-w-[660px] text-[20px] leading-[1.9] text-[#8c8f96] lg:text-[21px]">
              Dodomio là robot AI tương tác dành cho giáo dục, gia đình và các tổ chức hiện đại,
              kết hợp trải nghiệm trực quan với năng lực AI để học tập, giao tiếp và hỗ trợ vận hành.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center bg-[#8b58d6] px-9 py-5 text-[18px] font-semibold text-white shadow-[0_22px_40px_rgba(138,82,213,0.28)] transition-transform hover:-translate-y-0.5"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-[linear-gradient(180deg,rgba(252,251,255,0.94)_0%,#ffffff_100%)] py-10 sm:py-12">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="rounded-[28px] border border-[#ecdfff] bg-white p-6 shadow-[0_22px_60px_rgba(86,40,163,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1e8ff] text-[#7a2ee6]">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-[22px] font-semibold tracking-[-0.03em] text-[#23123a]">{title}</h2>
                <p className="mt-3 text-[15px] leading-7 text-[#65577e]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="bg-[linear-gradient(180deg,#ffffff_0%,#f7f0ff_100%)] py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
          <div className="max-w-[760px]">
            <p className="text-[14px] font-semibold uppercase tracking-[0.2em] text-[#8a47eb]">
              Sản phẩm & giải pháp
            </p>
            <h2 className="mt-4 text-[38px] font-semibold leading-tight tracking-[-0.04em] text-[#23123a] sm:text-[52px]">
              Hệ sinh thái sản phẩm tập trung vào robot tương tác và AI ứng dụng thực tế.
            </h2>
            <p className="mt-5 text-[18px] leading-8 text-[#6a5c82]">
              Dodomio mang đến robot AI cho trải nghiệm trực tiếp, Công chức.ai cho xử lý nghiệp vụ
              văn bản, và BMP.AI cho tư vấn triển khai AI theo nhu cầu từng tổ chức.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {productCards.map(({ title, subtitle, description, bullets, icon: Icon }) => (
              <article
                key={title}
                className="rounded-[32px] border border-[#eadcff] bg-white p-8 shadow-[0_20px_60px_rgba(87,41,160,0.08)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0e6ff] text-[#7a2ee6]">
                  <Icon className="h-7 w-7" />
                </div>
                <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#8a47eb]">
                  {subtitle}
                </p>
                <h3 className="mt-3 text-[28px] font-semibold tracking-[-0.04em] text-[#23123a]">{title}</h3>
                <p className="mt-4 text-[16px] leading-8 text-[#66577f]">{description}</p>
                <ul className="mt-6 space-y-3">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-3 text-[15px] font-medium text-[#3b295d]">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#a45df5]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[720px]">
              <p className="text-[14px] font-semibold uppercase tracking-[0.2em] text-[#8a47eb]">
                Use case nổi bật
              </p>
              <h2 className="mt-4 text-[38px] font-semibold leading-tight tracking-[-0.04em] text-[#23123a] sm:text-[52px]">
                Một sản phẩm, nhiều ứng dụng rõ ràng và dễ hình dung ngay từ lần xem đầu tiên.
              </h2>
            </div>
            <p className="max-w-[420px] text-[17px] leading-8 text-[#6a5c82]">
              Từ lớp học, gia đình đến cơ quan và doanh nghiệp, Dodomio giúp công nghệ AI trở nên dễ dùng và tạo ra giá trị tức thì.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {homeUseCases.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="rounded-[28px] border border-[#eee5ff] bg-white p-7 shadow-[0_20px_50px_rgba(76,39,146,0.06)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4ebff] text-[#7a2ee6]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-[24px] font-semibold tracking-[-0.03em] text-[#26163d]">{title}</h3>
                <p className="mt-3 text-[16px] leading-8 text-[#6a5c82]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#2c1249] py-24 text-white">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.2em] text-[#d5b4ff]">
              Giới thiệu Robot Dodomio
            </p>
            <h2 className="mt-4 text-[40px] font-semibold leading-tight tracking-[-0.04em] sm:text-[54px]">
              Dodomio là robot AI có thể trò chuyện, hướng dẫn, kể chuyện và tạo kết nối tự nhiên với người dùng.
            </h2>
            <p className="mt-5 max-w-[520px] text-[18px] leading-8 text-[#e7d8ff]">
              Thiết kế thân thiện, khả năng tương tác sinh động và nền tảng AI mở rộng giúp robot phù hợp
              cho giáo dục, chăm sóc gia đình, trình diễn công nghệ và nhiều mô hình dịch vụ mới.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-4 text-[15px] font-semibold text-[#5b23ab]"
              >
                Đặt hàng sớm
              </Link>
              <Link
                href="#customers"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-4 text-[15px] font-semibold text-white"
              >
                Xem case triển khai
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.22)]">
            <Image
              src="/images/dodo/home.png"
              alt="Robot Dodomio"
              width={1762}
              height={1009}
              className="h-auto w-full rounded-[28px]"
            />
          </div>
        </div>
      </section>

      <section id="customers" className="py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[730px]">
              <p className="text-[14px] font-semibold uppercase tracking-[0.2em] text-[#8a47eb]">
                Khách hàng & case thành công
              </p>
              <h2 className="mt-4 text-[38px] font-semibold leading-tight tracking-[-0.04em] text-[#23123a] sm:text-[52px]">
                Kết quả thực tế giúp khách hàng thấy rõ hiệu quả của mô hình robot kết hợp AI.
              </h2>
            </div>
            <p className="max-w-[420px] text-[17px] leading-8 text-[#6a5c82]">
              Dodomio tạo ra trải nghiệm tương tác thu hút hơn, trong khi các sản phẩm AI đi kèm giúp đội ngũ vận hành nhanh và chính xác hơn.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map(({ quote, name, role }) => (
              <blockquote
                key={name}
                className="rounded-[30px] border border-[#ede2ff] bg-white p-8 shadow-[0_20px_55px_rgba(77,39,146,0.06)]"
              >
                <MessageSquareText className="h-8 w-8 text-[#8a47eb]" />
                <p className="mt-5 text-[18px] leading-8 text-[#4a3a64]">“{quote}”</p>
                <footer className="mt-8">
                  <div className="text-[18px] font-semibold text-[#23123a]">{name}</div>
                  <div className="mt-1 text-[14px] font-medium uppercase tracking-[0.12em] text-[#8a7aa7]">
                    {role}
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {caseResults.map(({ value, title, description }) => (
              <div
                key={title}
                className="rounded-[30px] bg-[linear-gradient(135deg,#f7efff,#ffffff)] p-8 shadow-[0_20px_55px_rgba(77,39,146,0.06)]"
              >
                <div className="text-[56px] font-semibold tracking-[-0.06em] text-[#7a2ee6]">{value}</div>
                <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-[#26163d]">{title}</h3>
                <p className="mt-3 text-[16px] leading-8 text-[#6a5c82]">{description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {customerLogos.map((logo) => (
              <div
                key={logo}
                className="flex min-h-[92px] items-center justify-center rounded-[24px] border border-[#ede3ff] bg-white px-4 text-center text-[20px] font-semibold tracking-[-0.03em] text-[#7b6d95]"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-[linear-gradient(180deg,#f9f4ff_0%,#ffffff_100%)] py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
          <div className="max-w-[780px]">
            <p className="text-[14px] font-semibold uppercase tracking-[0.2em] text-[#8a47eb]">Giới thiệu</p>
            <h2 className="mt-4 text-[38px] font-semibold leading-tight tracking-[-0.04em] text-[#23123a] sm:text-[52px]">
              DODOMIO xây dựng robot và giải pháp AI với trọng tâm là tính ứng dụng, trải nghiệm thân thiện và khả năng triển khai thật.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {companyPillars.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="rounded-[30px] border border-[#ebe0ff] bg-white p-7 shadow-[0_20px_55px_rgba(77,39,146,0.06)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0e6ff] text-[#7a2ee6]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-[24px] font-semibold tracking-[-0.03em] text-[#26163d]">{title}</h3>
                <p className="mt-3 text-[16px] leading-8 text-[#6a5c82]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="rounded-[34px] bg-[#2c1249] p-8 text-white shadow-[0_30px_80px_rgba(44,18,73,0.25)] sm:p-10">
              <p className="text-[14px] font-semibold uppercase tracking-[0.2em] text-[#d5b4ff]">Liên hệ / Demo</p>
              <h2 className="mt-4 text-[40px] font-semibold leading-tight tracking-[-0.04em]">
                Đăng ký demo để trải nghiệm trực tiếp Robot Dodomio và tư vấn giải pháp AI phù hợp.
              </h2>
              <p className="mt-5 text-[17px] leading-8 text-[#eadcff]">
                Đội ngũ DODOMIO sẽ giúp bạn xác định sản phẩm phù hợp, lên kịch bản demo và đề xuất lộ trình triển khai cho từng nhu cầu cụ thể.
              </p>

              <div className="mt-8 space-y-5">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3 text-[18px] font-semibold">
                    <Mic className="h-5 w-5 text-[#d5b4ff]" />
                    Demo robot Dodomio
                  </div>
                  <p className="mt-3 text-[15px] leading-7 text-[#e9dcff]">
                    Đăng ký lịch trải nghiệm robot, kịch bản kể chuyện, giáo dục tương tác và trình diễn AI tại sự kiện.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3 text-[18px] font-semibold">
                    <BrainCircuit className="h-5 w-5 text-[#d5b4ff]" />
                    Tư vấn giải pháp AI
                  </div>
                  <p className="mt-3 text-[15px] leading-7 text-[#e9dcff]">
                    Kết nối với DODOMIO để xác định use case, cách tích hợp và lộ trình triển khai phù hợp cho tổ chức của bạn.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[34px] border border-[#eadcff] bg-white p-8 shadow-[0_30px_80px_rgba(86,40,163,0.08)] sm:p-10">
              <form className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-[14px] font-semibold text-[#4b376d]">Họ và tên</span>
                    <input
                      className="rounded-2xl border border-[#e6d7ff] px-4 py-4 outline-none transition focus:border-[#7a2ee6]"
                      placeholder="Nguyễn Văn A"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-[14px] font-semibold text-[#4b376d]">Số điện thoại</span>
                    <input
                      className="rounded-2xl border border-[#e6d7ff] px-4 py-4 outline-none transition focus:border-[#7a2ee6]"
                      placeholder="0901 234 567"
                    />
                  </label>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-[14px] font-semibold text-[#4b376d]">Email</span>
                    <input
                      className="rounded-2xl border border-[#e6d7ff] px-4 py-4 outline-none transition focus:border-[#7a2ee6]"
                      placeholder="ban@congty.vn"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-[14px] font-semibold text-[#4b376d]">Nhu cầu chính</span>
                    <select className="rounded-2xl border border-[#e6d7ff] px-4 py-4 outline-none transition focus:border-[#7a2ee6]">
                      <option>Demo robot Dodomio</option>
                      <option>Pre-order robot</option>
                      <option>Công chức.ai</option>
                      <option>BMP.AI / tích hợp AI</option>
                    </select>
                  </label>
                </div>
                <label className="grid gap-2">
                  <span className="text-[14px] font-semibold text-[#4b376d]">Mô tả nhu cầu</span>
                  <textarea
                    rows={6}
                    className="rounded-3xl border border-[#e6d7ff] px-4 py-4 outline-none transition focus:border-[#7a2ee6]"
                    placeholder="Bạn muốn dùng robot cho bối cảnh nào, hoặc cần AI hỗ trợ quy trình gì?"
                  />
                </label>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[14px] leading-7 text-[#7a6b95]">
                    Ưu tiên để lại thông tin để nhận tư vấn nhanh về demo, pre-order và giải pháp tích hợp.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex min-w-[180px] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#7a2ee6] px-7 py-4 text-[15px] font-semibold text-white shadow-[0_20px_40px_rgba(122,46,230,0.28)]"
                  >
                    Gửi đăng ký
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#ecdfff] bg-white">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-5 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-4">
            <Image
              src="/images/dodo/dodomio-logo.png"
              alt="DODOMIO Robotics"
              width={132}
              height={66}
              className="h-auto w-[110px]"
            />
            <p className="max-w-[420px] text-[15px] leading-7 text-[#6c5d86]">
              DODOMIO WEBSITE được tái cấu trúc thành landing page giới thiệu robot + AI với CTA rõ ràng cho pre-order và demo.
            </p>
          </div>
          <div className="text-[14px] font-medium text-[#806fa0]">© 2026 DODOMIO Robotics. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
