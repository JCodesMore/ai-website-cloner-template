"use client";

import { useState, useEffect } from "react";

interface ShareButtonProps {
  productId: string;
  productName: string;
  rate?: string;
  amount?: string;
  term?: string;
  repayment?: string;
}

export default function ShareButton({
  productId,
  productName,
  rate,
  amount,
  term,
  repayment,
}: ShareButtonProps) {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const productUrl = origin
    ? `${origin}/products/detail/${productId}`
    : `/products/detail/${productId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(productUrl)}`;

  return (
    <div
      className="product-share-float"
      style={{
        position: "fixed",
        top: "50%",
        left: "calc(50% - 660px)",
        zIndex: 18,
        transform: "translateY(-50%)",
      }}
    >
      <button
        className="product-share-float-btn"
        type="button"
        style={{
          display: "flex",
          width: 56,
          minHeight: 118,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          border: 0,
          borderRadius: 18,
          background: "#fff",
          boxShadow: "0 14px 34px rgba(15,23,42,0.14)",
          color: "#ff5f16",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          const popover = e.currentTarget.nextElementSibling as HTMLElement;
          if (popover) popover.style.display = "block";
        }}
        onMouseLeave={(e) => {
          const popover = e.currentTarget.nextElementSibling as HTMLElement;
          if (popover) popover.style.display = "none";
        }}
      >
        <i
          className="layui-icon layui-icon-share"
          style={{ fontSize: 22, lineHeight: 1 }}
        ></i>
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>
          分享
        </span>
      </button>
      <div
        className="pc-share-popover"
        style={{
          display: "none",
          position: "absolute",
          top: "50%",
          left: 72,
          zIndex: 999,
          width: 300,
          padding: 24,
          transform: "translateY(-50%)",
          border: "1px solid #f3f4f6",
          borderRadius: 20,
          background: "#fff",
          boxShadow: "0 20px 48px rgba(0,0,0,0.12)",
          textAlign: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.display = "block";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.display = "none";
        }}
      >
        <div
          className="pc-share-popover-title"
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#333",
            marginBottom: 12,
          }}
        >
          分享本产品
        </div>
        <div className="pc-share-popover-qrcode" style={{ marginBottom: 8 }}>
          <img
            src={qrUrl}
            alt="qrcode"
            style={{ width: 150, height: 150, display: "block", margin: "0 auto" }}
          />
        </div>
        <div
          className="pc-share-popover-tip"
          style={{
            fontSize: 12,
            color: "#999",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <i className="layui-icon layui-icon-cellphone"></i> 微信扫码，分享给好友
        </div>
        <button
          type="button"
          className="layui-btn layui-btn-sm layui-bg-orange"
          style={{
            background: "#ff5f16",
            border: "none",
            color: "#fff",
            fontSize: 12,
          }}
          onClick={() => {
            navigator.clipboard.writeText(productUrl);
          }}
        >
          复制链接
        </button>
      </div>
    </div>
  );
}
