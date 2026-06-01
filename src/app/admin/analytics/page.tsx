"use client";

import { useEffect, useState } from "react";
import { Card, AreaChart, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from "@tremor/react";
import { Eye, Share2, Scan, TrendingUp } from "lucide-react";

function sourceLabel(s: string) {
  const map: Record<string, string> = { floating: "右下角浮动", footer: "页面底部", "product-card": "产品卡片", unknown: "未知" };
  return map[s] || s;
}

interface Summary {
  totalViews: number;
  totalShares: number;
  totalScans: number;
  shareRate: string;
  dailyViews: { date: string; count: number }[];
  scanBySource: { source: string; count: number }[];
  dailyScans: { date: string; count: number }[];
}

interface TopArticle {
  id: number;
  title: string;
  viewCount: number;
  recentViews: number;
  recentShares: number;
}

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [topArticles, setTopArticles] = useState<TopArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/admin/analytics/summary?days=${days}`).then(r => r.json()),
      fetch(`/api/admin/analytics/top-articles?days=${days}&limit=20`).then(r => r.json()),
    ])
      .then(([s, t]) => { setSummary(s); setTopArticles(t); })
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-slate-100" />
          ))}
        </div>
        <div className="h-64 rounded-lg bg-slate-100" />
      </div>
    );
  }

  const hasData = summary && (summary.totalViews > 0 || summary.totalShares > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">数据分析</h1>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 cursor-pointer"
        >
          <option value={7}>最近 7 天</option>
          <option value={30}>最近 30 天</option>
          <option value={90}>最近 90 天</option>
        </select>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <TrendingUp className="h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-lg font-bold text-slate-900">数据收集中...</h2>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            当用户开始访问文章后，阅读量、分享数据和扫码统计将在这里展示。图表会随数据积累自动更新。
          </p>
          <div className="mt-8 grid w-full max-w-2xl gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-slate-50 border border-slate-100" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card decoration="top" decorationColor="yellow">
              <div className="flex items-center gap-2 text-slate-500 text-sm"><Eye className="h-4 w-4" /> 总阅读量</div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{summary?.totalViews.toLocaleString()}</div>
            </Card>
            <Card decoration="top" decorationColor="emerald">
              <div className="flex items-center gap-2 text-slate-500 text-sm"><Share2 className="h-4 w-4" /> 总分享数</div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{summary?.totalShares.toLocaleString()}</div>
            </Card>
            <Card decoration="top" decorationColor="slate">
              <div className="flex items-center gap-2 text-slate-500 text-sm"><Scan className="h-4 w-4" /> 扫码次数</div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{summary?.totalScans.toLocaleString()}</div>
            </Card>
            <Card decoration="top" decorationColor="amber">
              <div className="flex items-center gap-2 text-slate-500 text-sm"><TrendingUp className="h-4 w-4" /> 分享率</div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{summary?.shareRate}%</div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <Card>
              <Title>阅读趋势（近 {days} 天）</Title>
              <AreaChart
                className="mt-4 h-64"
                data={summary?.dailyViews || []}
                index="date"
                categories={["count"]}
                colors={["yellow"]}
                valueFormatter={(v) => v.toLocaleString()}
                showLegend={false}
              />
            </Card>
            <Card>
              <Title>热门文章 TOP 10</Title>
              <div className="mt-4 space-y-3">
                {(topArticles || []).slice(0, 10).map((a, i) => (
                  <div key={a.id} className="flex items-start gap-2">
                    <span className="mt-0.5 text-xs font-bold text-slate-400 w-5">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <a href={`/articles/${a.id}`} target="_blank" className="text-sm text-slate-700 hover:text-yellow-600 line-clamp-1 transition-colors">
                        {a.title}
                      </a>
                      <div className="mt-0.5 flex gap-3 text-xs text-slate-400">
                        <span><Eye className="inline h-3 w-3" /> {a.recentViews}</span>
                        <span><Share2 className="inline h-3 w-3" /> {a.recentShares}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <Card>
              <Title>扫码趋势（近 {days} 天）</Title>
              <AreaChart
                className="mt-4 h-48"
                data={summary?.dailyScans || []}
                index="date"
                categories={["count"]}
                colors={["emerald"]}
                valueFormatter={(v) => v.toLocaleString()}
                showLegend={false}
              />
            </Card>
            <Card>
              <Title>扫码来源分布</Title>
              <Table className="mt-4">
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>来源</TableHeaderCell>
                    <TableHeaderCell>次数</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(summary?.scanBySource || []).map((s) => (
                    <TableRow key={s.source}>
                      <TableCell>{sourceLabel(s.source)}</TableCell>
                      <TableCell>{s.count.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {(summary?.scanBySource || []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-slate-400">暂无数据</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>

          <Card>
            <Title>文章数据明细</Title>
            <Table className="mt-4">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>文章标题</TableHeaderCell>
                  <TableHeaderCell>总阅读</TableHeaderCell>
                  <TableHeaderCell>近期阅读</TableHeaderCell>
                  <TableHeaderCell>近期分享</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(topArticles || []).map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <a href={`/articles/${a.id}`} target="_blank" className="text-slate-700 hover:text-yellow-600 transition-colors line-clamp-1 max-w-md block">
                        {a.title}
                      </a>
                    </TableCell>
                    <TableCell>{a.viewCount.toLocaleString()}</TableCell>
                    <TableCell>{a.recentViews.toLocaleString()}</TableCell>
                    <TableCell>{a.recentShares.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
}
