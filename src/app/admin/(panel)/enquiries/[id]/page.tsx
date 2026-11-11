import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryActions } from "@/components/admin/enquiry-actions";
import { buttonClass, Card, formatDateTime, PageHeader } from "@/components/admin/ui";
import { TIME_ZONE } from "@/lib/server/db";
import { getEnquiry } from "@/lib/server/enquiries";

export const metadata: Metadata = { title: "Enquiry" };

export default async function EnquiryPage({ params }: PageProps<"/admin/enquiries/[id]">) {
  const { id } = await params;
  const e = getEnquiry(Number(id));
  if (!e) notFound();

  const phone = e.telephone.replace(/[^\d+]/g, "");
  const replySubject = encodeURIComponent("Your Sri Lanka tour enquiry – Show Lanka Tours");
  const replyBody = encodeURIComponent(`Dear ${e.name},\n\nThank you for your enquiry with Show Lanka Tours.\n\n`);
  const rows: [string, string][] = [
    ["Email", e.email],
    ["Telephone", e.telephone],
    ["Country", e.country],
    ["Arrival date", e.arrival],
    ["Departure date", e.departure],
    ["Adults", e.adults],
    ["Children", e.children],
    ["Hotel category", e.hotel],
  ];
  const tracking: [string, string][] = [
    ["Received", formatDateTime(e.created_at, TIME_ZONE)],
    ["Sent from page", e.page],
    ["Came to the site from", e.source],
    ["First page of the visit", e.landing_page],
    ["Email notification", e.email_sent ? "Sent" : "Not sent"],
  ];

  return (
    <>
      <Link href="/admin/enquiries" className={`${buttonClass.ghost} mb-3 -ml-2`}>
        <ArrowLeft className="size-4" /> Enquiries
      </Link>
      <PageHeader
        title={e.name}
        description={`Enquiry #${e.id} · ${formatDateTime(e.created_at, TIME_ZONE)}`}
        actions={
          <>
            <a href={`mailto:${e.email}?subject=${replySubject}&body=${replyBody}`} className={buttonClass.primary}>
              <Mail className="size-4" /> Reply by email
            </a>
            {phone && (
              <>
                <a href={`https://wa.me/${phone.replace(/^\+/, "")}`} target="_blank" rel="noopener" className={buttonClass.secondary}>
                  <MessageCircle className="size-4" /> WhatsApp
                </a>
                <a href={`tel:${phone}`} className={buttonClass.secondary}>
                  <Phone className="size-4" /> Call
                </a>
              </>
            )}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Message">
            {e.message ? <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-800">{e.message}</p> : <p className="text-sm text-slate-500">No message was written.</p>}
          </Card>
          <Card title="Trip details">
            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              {rows.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-slate-500">{k}</dt>
                  <dd className="mt-0.5 text-slate-900">{v || "—"}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
        <div className="space-y-6">
          <Card title="Status">
            <EnquiryActions id={e.id} status={e.status} />
          </Card>
          <Card title="How they found us">
            <dl className="space-y-3 text-sm">
              {tracking.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-slate-500">{k}</dt>
                  <dd className="mt-0.5 break-words text-slate-900">{v || "—"}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
