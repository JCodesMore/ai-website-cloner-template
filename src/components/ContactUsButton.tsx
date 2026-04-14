export function ContactUsButton() {
  return (
    <a
      href="/us/ContactUs"
      className="fixed z-[90] right-[30px] bottom-[60px] inline-flex items-center justify-center bg-[#4f6984] text-white text-[16px] font-medium shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-[#3f5570] transition-colors"
      style={{ borderRadius: 25, padding: "9px 30px" }}
    >
      Contact us
    </a>
  );
}
