interface BannerProps {
  productCount?: number;
}

export default function Banner({ productCount = 816 }: BannerProps) {
  return (
    <div className="ley-banner">
      <div className="ley-inner">
        <div className="ley-banner-inner">
          <div className="ley-banner-slogan">
            已收录全网 <strong className="ley-banner-count">{productCount}</strong> 个贷款产品
          </div>
          <form className="ley-banner-search" action="/products/search" method="get">
            <input
              className="ley-banner-search-input"
              type="text"
              name="wd"
              placeholder="请输入产品名称或机构名称"
            />
            <button className="ley-banner-search-btn" type="submit">
              <i className="layui-icon layui-icon-search"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
