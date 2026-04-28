export function NewsletterSection() {
  return (
    <section data-reveal className="relative py-16 md:py-20 lg:py-40 base-px">
      <div className="grid grid-cols-12 base-gap-x">
        <div className="col-span-12 md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6">
          <h2 className="text-[1.5rem] md:text-[1.75rem] font-normal leading-[1.5] mb-6 whitespace-pre-line">
            {`施工事例やイベント情報を\nメールでお届けします`}
          </h2>
          <p className="text-sm md:text-base leading-[1.8] text-[#141419]/60 mb-8">
            モノクロームの製品情報をはじめ、未来に向けた豊かな暮らし方のヒントや、環境への取り組みまで、さまざまな情報をお届けします
          </p>
          <form
            className="flex flex-col gap-3"
            action="/api/newsletter"
            method="post"
          >
            <input
              type="email"
              name="email"
              placeholder="メールアドレスを入力してください"
              required
              className="w-full h-12 px-5 rounded-full border border-black-10 bg-white text-base placeholder:text-[#141419]/40 focus:outline-none focus:border-black"
            />
            <button
              type="submit"
              className="w-full h-12 rounded-full bg-black text-white font-medium text-base transition-colors hover:bg-[#2a2a2a]"
            >
              登録
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
