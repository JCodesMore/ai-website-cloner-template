/** ISP / 数据中心代理配置 — 取自原站 LamaProxy 公共接口
 *  GET /api/proxy/isp/config、/api/proxy/datacenter/config（2026-07 抓取）。
 *  价格、时长档折扣、国家覆盖与「按时长可用国家」均与原站 1:1。
 *  数量档为本站统一档（原站 ISP 多 1500、数据中心以 20 替 1，两页不一致），
 *  各档折扣均为 1，统一不影响计价。
 *  数据中心 7/14 天档仅开放 38 国，其余时长开放全部；ISP 各时长一致。 */

export interface IpQtyOption {
  qty: number;
  discount: number;
}

export interface IpDurationOption {
  days: number;
  discount: number;
}

export interface IpCountry {
  code: string;
  flag: string;
  name: string;
}

export interface IpProxyConfig {
  pricePerIpDay: number;
  quantityOptions: IpQtyOption[];
  durationOptions: IpDurationOption[];
  countries: IpCountry[];
  unavailableCountries: IpCountry[];
  /** 键为时长天数，值为该时长下可购买的国家 code 列表 */
  countryAvailability: Record<string, string[]>;
}

export const IP_PROXY_CONFIG: Record<"isp" | "datacenter", IpProxyConfig> = {
  isp: {
    pricePerIpDay: 0.371,
    quantityOptions: [{ qty: 1, discount: 1 }, { qty: 10, discount: 1 }, { qty: 50, discount: 1 }, { qty: 100, discount: 1 }, { qty: 500, discount: 1 }, { qty: 1000, discount: 1 }],
    durationOptions: [{ days: 7, discount: 1 }, { days: 14, discount: 0.742 }, { days: 30, discount: 0.449 }, { days: 90, discount: 0.4433 }, { days: 180, discount: 0.4373 }, { days: 360, discount: 0.4283 }],
    countries: [
      { code: "US", flag: "🇺🇸", name: "美国" },
      { code: "GB", flag: "🇬🇧", name: "英国" },
      { code: "DE", flag: "🇩🇪", name: "德国" },
      { code: "JP", flag: "🇯🇵", name: "日本" },
      { code: "SG", flag: "🇸🇬", name: "新加坡" },
      { code: "NL", flag: "🇳🇱", name: "荷兰" },
      { code: "FR", flag: "🇫🇷", name: "法国" },
      { code: "CA", flag: "🇨🇦", name: "加拿大" },
      { code: "HK", flag: "🇭🇰", name: "香港" },
      { code: "KR", flag: "🇰🇷", name: "韩国" },
      { code: "BR", flag: "🇧🇷", name: "巴西" },
      { code: "IN", flag: "🇮🇳", name: "印度" },
      { code: "IT", flag: "🇮🇹", name: "意大利" },
      { code: "ES", flag: "🇪🇸", name: "西班牙" },
      { code: "AT", flag: "🇦🇹", name: "奥地利" },
      { code: "IL", flag: "🇮🇱", name: "以色列" },
      { code: "LV", flag: "🇱🇻", name: "拉脱维亚" },
      { code: "PL", flag: "🇵🇱", name: "波兰" },
      { code: "RO", flag: "🇷🇴", name: "罗马尼亚" },
      { code: "TW", flag: "🇹🇼", name: "台湾" },
      { code: "TH", flag: "🇹🇭", name: "泰国" },
      { code: "TR", flag: "🇹🇷", name: "土耳其" },
      { code: "UA", flag: "🇺🇦", name: "乌克兰" },
    ],
    unavailableCountries: [
      { code: "AU", flag: "🇦🇺", name: "澳大利亚" },
    ],
    countryAvailability: {
    "7": ["AT", "BR", "CA", "GB", "FR", "DE", "HK", "IN", "IL", "IT", "JP", "LV", "NL", "PL", "RO", "SG", "KR", "ES", "TW", "TH", "TR", "UA", "US"],
    "14": ["AT", "BR", "CA", "GB", "FR", "DE", "HK", "IN", "IL", "IT", "JP", "LV", "NL", "PL", "RO", "SG", "KR", "ES", "TW", "TH", "TR", "UA", "US"],
    "30": ["AT", "BR", "CA", "GB", "FR", "DE", "HK", "IN", "IL", "IT", "JP", "LV", "NL", "PL", "RO", "SG", "KR", "ES", "TW", "TH", "TR", "UA", "US"],
    "90": ["AT", "BR", "CA", "GB", "FR", "DE", "HK", "IN", "IL", "IT", "JP", "LV", "NL", "PL", "RO", "SG", "KR", "ES", "TW", "TH", "TR", "UA", "US"],
    "180": ["AT", "BR", "CA", "GB", "FR", "DE", "HK", "IN", "IL", "IT", "JP", "LV", "NL", "PL", "RO", "SG", "KR", "ES", "TW", "TH", "TR", "UA", "US"],
    "360": ["AT", "BR", "CA", "GB", "FR", "DE", "HK", "IN", "IL", "IT", "JP", "LV", "NL", "PL", "RO", "SG", "KR", "ES", "TW", "TH", "TR", "UA", "US"],
    },
  },
  datacenter: {
    pricePerIpDay: 0.35,
    quantityOptions: [{ qty: 1, discount: 1 }, { qty: 10, discount: 1 }, { qty: 50, discount: 1 }, { qty: 100, discount: 1 }, { qty: 500, discount: 1 }, { qty: 1000, discount: 1 }],
    durationOptions: [{ days: 5, discount: 1 }, { days: 7, discount: 0.7755 }, { days: 10, discount: 0.6 }, { days: 14, discount: 0.4734 }, { days: 20, discount: 0.3757 }, { days: 30, discount: 0.3047 }, { days: 90, discount: 0.3003 }, { days: 180, discount: 0.2952 }, { days: 360, discount: 0.292 }],
    countries: [
      { code: "US", flag: "🇺🇸", name: "美国" },
      { code: "FR", flag: "🇫🇷", name: "法国" },
      { code: "CA", flag: "🇨🇦", name: "加拿大" },
      { code: "HK", flag: "🇭🇰", name: "香港" },
      { code: "KR", flag: "🇰🇷", name: "韩国" },
      { code: "BR", flag: "🇧🇷", name: "巴西" },
      { code: "DE", flag: "🇩🇪", name: "德国" },
      { code: "GB", flag: "🇬🇧", name: "英国" },
      { code: "SG", flag: "🇸🇬", name: "新加坡" },
      { code: "JP", flag: "🇯🇵", name: "日本" },
      { code: "AU", flag: "🇦🇺", name: "澳大利亚" },
      { code: "NL", flag: "🇳🇱", name: "荷兰" },
      { code: "AM", flag: "🇦🇲", name: "亚美尼亚" },
      { code: "BE", flag: "🇧🇪", name: "比利时" },
      { code: "BG", flag: "🇧🇬", name: "保加利亚" },
      { code: "CN", flag: "🇨🇳", name: "中国" },
      { code: "CZ", flag: "🇨🇿", name: "捷克" },
      { code: "FI", flag: "🇫🇮", name: "芬兰" },
      { code: "GE", flag: "🇬🇪", name: "格鲁吉亚" },
      { code: "IN", flag: "🇮🇳", name: "印度" },
      { code: "ID", flag: "🇮🇩", name: "印度尼西亚" },
      { code: "IT", flag: "🇮🇹", name: "意大利" },
      { code: "KZ", flag: "🇰🇿", name: "哈萨克斯坦" },
      { code: "LV", flag: "🇱🇻", name: "拉脱维亚" },
      { code: "LT", flag: "🇱🇹", name: "立陶宛" },
      { code: "MY", flag: "🇲🇾", name: "马来西亚" },
      { code: "MX", flag: "🇲🇽", name: "墨西哥" },
      { code: "PL", flag: "🇵🇱", name: "波兰" },
      { code: "PT", flag: "🇵🇹", name: "葡萄牙" },
      { code: "RO", flag: "🇷🇴", name: "罗马尼亚" },
      { code: "RU", flag: "🇷🇺", name: "俄罗斯" },
      { code: "ZA", flag: "🇿🇦", name: "南非" },
      { code: "ES", flag: "🇪🇸", name: "西班牙" },
      { code: "SE", flag: "🇸🇪", name: "瑞典" },
      { code: "CH", flag: "🇨🇭", name: "瑞士" },
      { code: "TH", flag: "🇹🇭", name: "泰国" },
      { code: "TR", flag: "🇹🇷", name: "土耳其" },
      { code: "UA", flag: "🇺🇦", name: "乌克兰" },
      { code: "AZ", flag: "🇦🇿", name: "阿塞拜疆" },
      { code: "NO", flag: "🇳🇴", name: "挪威" },
      { code: "GR", flag: "🇬🇷", name: "希腊" },
      { code: "QA", flag: "🇶🇦", name: "卡塔尔" },
      { code: "BY", flag: "🇧🇾", name: "白俄罗斯" },
      { code: "EE", flag: "🇪🇪", name: "爱沙尼亚" },
      { code: "VN", flag: "🇻🇳", name: "越南" },
      { code: "MD", flag: "🇲🇩", name: "摩尔多瓦" },
      { code: "AE", flag: "🇦🇪", name: "阿联酋" },
      { code: "AR", flag: "🇦🇷", name: "阿根廷" },
      { code: "PE", flag: "🇵🇪", name: "秘鲁" },
      { code: "BD", flag: "🇧🇩", name: "孟加拉国" },
      { code: "SC", flag: "🇸🇨", name: "塞舌尔" },
      { code: "MV", flag: "🇲🇻", name: "马尔代夫" },
      { code: "CL", flag: "🇨🇱", name: "智利" },
      { code: "IE", flag: "🇮🇪", name: "爱尔兰" },
      { code: "PH", flag: "🇵🇭", name: "菲律宾" },
      { code: "CO", flag: "🇨🇴", name: "哥伦比亚" },
      { code: "DZ", flag: "🇩🇿", name: "阿尔及利亚" },
      { code: "EG", flag: "🇪🇬", name: "埃及" },
      { code: "IS", flag: "🇮🇸", name: "冰岛" },
      { code: "MC", flag: "🇲🇨", name: "摩纳哥" },
      { code: "VE", flag: "🇻🇪", name: "委内瑞拉" },
      { code: "HU", flag: "🇭🇺", name: "匈牙利" },
      { code: "AT", flag: "🇦🇹", name: "奥地利" },
      { code: "TM", flag: "🇹🇲", name: "土库曼斯坦" },
      { code: "UZ", flag: "🇺🇿", name: "乌兹别克斯坦" },
      { code: "BO", flag: "🇧🇴", name: "玻利维亚" },
      { code: "KE", flag: "🇰🇪", name: "肯尼亚" },
      { code: "MN", flag: "🇲🇳", name: "蒙古" },
      { code: "PY", flag: "🇵🇾", name: "巴拉圭" },
      { code: "RS", flag: "🇷🇸", name: "塞尔维亚" },
      { code: "SI", flag: "🇸🇮", name: "斯洛文尼亚" },
      { code: "AL", flag: "🇦🇱", name: "阿尔巴尼亚" },
      { code: "JM", flag: "🇯🇲", name: "牙买加" },
      { code: "IL", flag: "🇮🇱", name: "以色列" },
      { code: "LR", flag: "🇱🇷", name: "利比里亚" },
      { code: "UY", flag: "🇺🇾", name: "乌拉圭" },
      { code: "LK", flag: "🇱🇰", name: "斯里兰卡" },
      { code: "MG", flag: "🇲🇬", name: "马达加斯加" },
      { code: "NP", flag: "🇳🇵", name: "尼泊尔" },
      { code: "CU", flag: "🇨🇺", name: "古巴" },
      { code: "CR", flag: "🇨🇷", name: "哥斯达黎加" },
      { code: "KG", flag: "🇰🇬", name: "吉尔吉斯斯坦" },
      { code: "HR", flag: "🇭🇷", name: "克罗地亚" },
      { code: "SK", flag: "🇸🇰", name: "斯洛伐克" },
      { code: "CY", flag: "🇨🇾", name: "塞浦路斯" },
      { code: "NZ", flag: "🇳🇿", name: "新西兰" },
      { code: "SA", flag: "🇸🇦", name: "沙特阿拉伯" },
      { code: "MK", flag: "🇲🇰", name: "北马其顿" },
      { code: "JO", flag: "🇯🇴", name: "约旦" },
      { code: "KH", flag: "🇰🇭", name: "柬埔寨" },
      { code: "AD", flag: "🇦🇩", name: "安道尔" },
      { code: "ME", flag: "🇲🇪", name: "黑山" },
      { code: "MT", flag: "🇲🇹", name: "马耳他" },
      { code: "GT", flag: "🇬🇹", name: "危地马拉" },
      { code: "BA", flag: "🇧🇦", name: "波黑" },
      { code: "LU", flag: "🇱🇺", name: "卢森堡" },
      { code: "MA", flag: "🇲🇦", name: "摩洛哥" },
      { code: "ET", flag: "🇪🇹", name: "埃塞俄比亚" },
      { code: "CM", flag: "🇨🇲", name: "喀麦隆" },
      { code: "TN", flag: "🇹🇳", name: "突尼斯" },
      { code: "TZ", flag: "🇹🇿", name: "坦桑尼亚" },
      { code: "BH", flag: "🇧🇭", name: "巴林" },
      { code: "LY", flag: "🇱🇾", name: "利比亚" },
      { code: "DK", flag: "🇩🇰", name: "丹麦" },
      { code: "TW", flag: "🇹🇼", name: "台湾" },
      { code: "IQ", flag: "🇮🇶", name: "伊拉克" },
      { code: "IR", flag: "🇮🇷", name: "伊朗" },
      { code: "PK", flag: "🇵🇰", name: "巴基斯坦" },
      { code: "TJ", flag: "🇹🇯", name: "塔吉克斯坦" },
      { code: "NG", flag: "🇳🇬", name: "尼日利亚" },
      { code: "OM", flag: "🇴🇲", name: "阿曼" },
      { code: "GL", flag: "🇬🇱", name: "格陵兰" },
      { code: "AO", flag: "🇦🇴", name: "安哥拉" },
      { code: "DO", flag: "🇩🇴", name: "多明尼加" },
      { code: "PR", flag: "🇵🇷", name: "波多黎各" },
      { code: "EC", flag: "🇪🇨", name: "厄瓜多尔" },
      { code: "PA", flag: "🇵🇦", name: "巴拿马" },
    ],
    unavailableCountries: [],
    countryAvailability: {
    "5": ["RU", "FR", "US", "AU", "FI", "KZ", "IT", "AZ", "NO", "IN", "GR", "QA", "UA", "PL", "BY", "GB", "NL", "DE", "EE", "VN", "GE", "AM", "MD", "BE", "AE", "ES", "SE", "SG", "AR", "ID", "CZ", "BR", "JP", "PT", "CA", "RO", "PE", "CN", "CH", "TR", "BD", "LT", "LV", "SC", "MV", "CL", "IE", "PH", "CO", "TH", "DZ", "EG", "IS", "MC", "VE", "HU", "AT", "TM", "UZ", "BO", "KE", "MN", "MY", "PY", "RS", "SI", "AL", "JM", "IL", "LR", "MX", "UY", "LK", "MG", "NP", "CU", "BG", "ZA", "CR", "KG", "HR", "SK", "CY", "NZ", "SA", "MK", "JO", "KH", "AD", "ME", "MT", "GT", "BA", "LU", "MA", "ET", "CM", "TN", "TZ", "BH", "LY", "DK", "HK", "TW", "KR", "IQ", "IR", "PK", "TJ", "NG", "OM", "GL", "AO", "DO", "PR", "EC", "PA"],
    "7": ["AM", "AU", "BE", "BR", "BG", "CA", "CN", "CZ", "GB", "FI", "FR", "GE", "DE", "HK", "IN", "ID", "IT", "JP", "KZ", "KR", "LV", "LT", "MY", "MX", "NL", "PL", "PT", "RO", "RU", "SG", "ZA", "ES", "SE", "CH", "TH", "TR", "UA", "US"],
    "10": ["RU", "FR", "US", "AU", "FI", "KZ", "IT", "AZ", "NO", "IN", "GR", "QA", "UA", "PL", "BY", "GB", "NL", "DE", "EE", "VN", "GE", "AM", "MD", "BE", "AE", "ES", "SE", "SG", "AR", "ID", "CZ", "BR", "JP", "PT", "CA", "RO", "PE", "CN", "CH", "TR", "BD", "LT", "LV", "SC", "MV", "CL", "IE", "PH", "CO", "TH", "DZ", "EG", "IS", "MC", "VE", "HU", "AT", "TM", "UZ", "BO", "KE", "MN", "MY", "PY", "RS", "SI", "AL", "JM", "IL", "LR", "MX", "UY", "LK", "MG", "NP", "CU", "BG", "ZA", "CR", "KG", "HR", "SK", "CY", "NZ", "SA", "MK", "JO", "KH", "AD", "ME", "MT", "GT", "BA", "LU", "MA", "ET", "CM", "TN", "TZ", "BH", "LY", "DK", "HK", "TW", "KR", "IQ", "IR", "PK", "TJ", "NG", "OM", "GL", "AO", "DO", "PR", "EC", "PA"],
    "14": ["AM", "AU", "BE", "BR", "BG", "CA", "CN", "CZ", "GB", "FI", "FR", "GE", "DE", "HK", "IN", "ID", "IT", "JP", "KZ", "KR", "LV", "LT", "MY", "MX", "NL", "PL", "PT", "RO", "RU", "SG", "ZA", "ES", "SE", "CH", "TH", "TR", "UA", "US"],
    "20": ["RU", "FR", "US", "AU", "FI", "KZ", "IT", "AZ", "NO", "IN", "GR", "QA", "UA", "PL", "BY", "GB", "NL", "DE", "EE", "VN", "GE", "AM", "MD", "BE", "AE", "ES", "SE", "SG", "AR", "ID", "CZ", "BR", "JP", "PT", "CA", "RO", "PE", "CN", "CH", "TR", "BD", "LT", "LV", "SC", "MV", "CL", "IE", "PH", "CO", "TH", "DZ", "EG", "IS", "MC", "VE", "HU", "AT", "TM", "UZ", "BO", "KE", "MN", "MY", "PY", "RS", "SI", "AL", "JM", "IL", "LR", "MX", "UY", "LK", "MG", "NP", "CU", "BG", "ZA", "CR", "KG", "HR", "SK", "CY", "NZ", "SA", "MK", "JO", "KH", "AD", "ME", "MT", "GT", "BA", "LU", "MA", "ET", "CM", "TN", "TZ", "BH", "LY", "DK", "HK", "TW", "KR", "IQ", "IR", "PK", "TJ", "NG", "OM", "GL", "AO", "DO", "PR", "EC", "PA"],
    "30": ["RU", "FR", "US", "AU", "FI", "KZ", "IT", "AZ", "NO", "IN", "GR", "QA", "UA", "PL", "BY", "GB", "NL", "DE", "EE", "VN", "GE", "AM", "MD", "BE", "AE", "ES", "SE", "SG", "AR", "ID", "CZ", "BR", "JP", "PT", "CA", "RO", "PE", "CN", "CH", "TR", "BD", "LT", "LV", "SC", "MV", "CL", "IE", "PH", "CO", "TH", "DZ", "EG", "IS", "MC", "VE", "HU", "AT", "TM", "UZ", "BO", "KE", "MN", "MY", "PY", "RS", "SI", "AL", "JM", "IL", "LR", "MX", "UY", "LK", "MG", "NP", "CU", "BG", "ZA", "CR", "KG", "HR", "SK", "CY", "NZ", "SA", "MK", "JO", "KH", "AD", "ME", "MT", "GT", "BA", "LU", "MA", "ET", "CM", "TN", "TZ", "BH", "LY", "DK", "HK", "TW", "KR", "IQ", "IR", "PK", "TJ", "NG", "OM", "GL", "AO", "DO", "PR", "EC", "PA"],
    "90": ["RU", "FR", "US", "AU", "FI", "KZ", "IT", "AZ", "NO", "IN", "GR", "QA", "UA", "PL", "BY", "GB", "NL", "DE", "EE", "VN", "GE", "AM", "MD", "BE", "AE", "ES", "SE", "SG", "AR", "ID", "CZ", "BR", "JP", "PT", "CA", "RO", "PE", "CN", "CH", "TR", "BD", "LT", "LV", "SC", "MV", "CL", "IE", "PH", "CO", "TH", "DZ", "EG", "IS", "MC", "VE", "HU", "AT", "TM", "UZ", "BO", "KE", "MN", "MY", "PY", "RS", "SI", "AL", "JM", "IL", "LR", "MX", "UY", "LK", "MG", "NP", "CU", "BG", "ZA", "CR", "KG", "HR", "SK", "CY", "NZ", "SA", "MK", "JO", "KH", "AD", "ME", "MT", "GT", "BA", "LU", "MA", "ET", "CM", "TN", "TZ", "BH", "LY", "DK", "HK", "TW", "KR", "IQ", "IR", "PK", "TJ", "NG", "OM", "GL", "AO", "DO", "PR", "EC", "PA"],
    "180": ["RU", "FR", "US", "AU", "FI", "KZ", "IT", "AZ", "NO", "IN", "GR", "QA", "UA", "PL", "BY", "GB", "NL", "DE", "EE", "VN", "GE", "AM", "MD", "BE", "AE", "ES", "SE", "SG", "AR", "ID", "CZ", "BR", "JP", "PT", "CA", "RO", "PE", "CN", "CH", "TR", "BD", "LT", "LV", "SC", "MV", "CL", "IE", "PH", "CO", "TH", "DZ", "EG", "IS", "MC", "VE", "HU", "AT", "TM", "UZ", "BO", "KE", "MN", "MY", "PY", "RS", "SI", "AL", "JM", "IL", "LR", "MX", "UY", "LK", "MG", "NP", "CU", "BG", "ZA", "CR", "KG", "HR", "SK", "CY", "NZ", "SA", "MK", "JO", "KH", "AD", "ME", "MT", "GT", "BA", "LU", "MA", "ET", "CM", "TN", "TZ", "BH", "LY", "DK", "HK", "TW", "KR", "IQ", "IR", "PK", "TJ", "NG", "OM", "GL", "AO", "DO", "PR", "EC", "PA"],
    "360": ["RU", "FR", "US", "AU", "FI", "KZ", "IT", "AZ", "NO", "IN", "GR", "QA", "UA", "PL", "BY", "GB", "NL", "DE", "EE", "VN", "GE", "AM", "MD", "BE", "AE", "ES", "SE", "SG", "AR", "ID", "CZ", "BR", "JP", "PT", "CA", "RO", "PE", "CN", "CH", "TR", "BD", "LT", "LV", "SC", "MV", "CL", "IE", "PH", "CO", "TH", "DZ", "EG", "IS", "MC", "VE", "HU", "AT", "TM", "UZ", "BO", "KE", "MN", "MY", "PY", "RS", "SI", "AL", "JM", "IL", "LR", "MX", "UY", "LK", "MG", "NP", "CU", "BG", "ZA", "CR", "KG", "HR", "SK", "CY", "NZ", "SA", "MK", "JO", "KH", "AD", "ME", "MT", "GT", "BA", "LU", "MA", "ET", "CM", "TN", "TZ", "BH", "LY", "DK", "HK", "TW", "KR", "IQ", "IR", "PK", "TJ", "NG", "OM", "GL", "AO", "DO", "PR", "EC", "PA"],
    },
  },
};
