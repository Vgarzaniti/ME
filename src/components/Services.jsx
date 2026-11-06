import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Services.css";

export default function Services() {
  const { t, language } = useLanguage();
  const miniWeb = t.services.miniWeb;
  const isEs = language === "es";

  // Active Mini-Web Application: 'store' | 'automation' | 'erp'
  const [activeApp, setActiveApp] = useState("store");
  const [viewportMode, setViewportMode] = useState("desktop"); // 'desktop' | 'mobile'
  const [showDevtools, setShowDevtools] = useState(true);

  // Network Activity State (Live simulated API traffic)
  const [networkLog, setNetworkLog] = useState({
    method: "GET",
    endpoint: "/api/v1/products?category=all",
    status: 200,
    latency: "14ms",
    response: {
      count: 4,
      status: "healthy",
      database: "PostgreSQL Neon Serverless (sa-east-1)",
      cache: "Redis HIT",
    },
  });

  // ==========================================
  // 1. STORE DEMO STATE
  // ==========================================
  const [cart, setCart] = useState([]);
  const [storeCategory, setStoreCategory] = useState("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const filteredProducts = miniWeb.store.products.filter(
    (p) => storeCategory === "all" || p.category === storeCategory
  );

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
    setToastMessage(`${product.name} ${miniWeb.store.itemAdded}`);
    setTimeout(() => setToastMessage(null), 2500);

    setNetworkLog({
      method: "POST",
      endpoint: "/api/v1/cart/items",
      status: 201,
      latency: "18ms",
      response: {
        event: "cart_item_added",
        item_id: product.id,
        price: product.price,
        session_id: "sess_react19_client_09a4",
      },
    });
  };

  const handleCheckout = () => {
    setOrderConfirmed(true);
    setNetworkLog({
      method: "POST",
      endpoint: "/api/v1/orders/checkout",
      status: 200,
      latency: "22ms",
      response: {
        order_id: "ORD-2026-1042",
        items_count: cart.length,
        total_amount: cart.reduce(
          (sum, i) => sum + parseInt(i.price.replace(/[^0-9]/g, "")),
          0
        ),
        payment_gateway: "Webhook Gateway (n8n)",
        persisted_database: "neon.tech / PostgreSQL 16",
      },
    });
  };

  const handleResetStore = () => {
    setCart([]);
    setOrderConfirmed(false);
    setIsCartOpen(false);
  };

  // ==========================================
  // 2. n8n & WHATSAPP BOT STATE
  // ==========================================
  const [leadName, setLeadName] = useState(miniWeb.automation.nameDefault);
  const [leadService, setLeadService] = useState(
    isEs ? "Automatización n8n & CRM" : "n8n Automation & CRM"
  );
  const [leadPriority, setLeadPriority] = useState("high");
  const [isFlowRunning, setIsFlowRunning] = useState(false);
  const [flowStep, setFlowStep] = useState(null);
  const [phoneMessages, setPhoneMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: miniWeb.automation.phoneDefaultMsg,
      time: "10:42",
      status: "read",
    },
  ]);
  const [isPhoneTyping, setIsPhoneTyping] = useState(false);

  const handleTriggerWebhook = () => {
    if (isFlowRunning) return;
    setIsFlowRunning(true);
    setFlowStep(0);

    setNetworkLog({
      method: "POST",
      endpoint: "/webhook/v1/lead-intake",
      status: 202,
      latency: "9ms",
      response: {
        webhook_id: "wh_lead_intake_948",
        event: "inbound_lead_payload",
        lead_name: leadName,
        service: leadService,
        priority: leadPriority,
      },
    });

    // Step 1: n8n Validation (400ms)
    setTimeout(() => {
      setFlowStep(1);
    }, 450);

    // Step 2: Database Sync (900ms)
    setTimeout(() => {
      setFlowStep(2);
      setIsPhoneTyping(true);
    }, 950);

    // Step 3: WhatsApp Dispatch (1500ms)
    setTimeout(() => {
      setFlowStep(3);
      setIsPhoneTyping(false);
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newMsg = {
        id: Date.now(),
        sender: "bot",
        text: `${miniWeb.automation.phoneSuccessPrefix} ${leadName}${miniWeb.automation.phoneSuccessMsg} "${leadService}". ${miniWeb.automation.phoneSuccessSuffix}`,
        time: currentTime,
        status: "read",
      };

      setPhoneMessages((prev) => [...prev, newMsg]);
      setIsFlowRunning(false);

      setNetworkLog({
        method: "POST",
        endpoint: "/api/v1/whatsapp/cloud-messages/send",
        status: 200,
        latency: "124ms",
        response: {
          whatsapp_id: "wamid.HBgLNTQ5MjIxMzU0MjAwMhUCMR",
          recipient: leadName,
          status: "delivered",
          double_check: true,
        },
      });
    }, 1600);
  };

  // ==========================================
  // 3. CUSTOM ERP DASHBOARD STATE
  // ==========================================
  const [erpTransactions, setErpTransactions] = useState([
    {
      id: "FAC-B-00492",
      client: "Suchus Impresiones",
      item: isEs ? "Plataforma E-Commerce" : "E-Commerce Platform",
      amount: "$1,850.00",
      status: "paid",
      date: "03/11/2026",
    },
    {
      id: "FAC-B-00491",
      client: "Iron Bull Gym",
      item: isEs ? "Landing & Pasarela Pagos" : "Landing & Payments",
      amount: "$950.00",
      status: "paid",
      date: "01/11/2026",
    },
    {
      id: "FAC-B-00490",
      client: "Estudio Odontológico",
      item: isEs ? "Historial Clínico (DocTor)" : "Clinical History System",
      amount: "$2,400.00",
      status: "pending",
      date: "28/10/2026",
    },
  ]);
  const [erpRevenue, setErpRevenue] = useState(38450);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // ==========================================
  // 4. TAX RECONCILIATION & AUTO-REPORTS STATE
  // ==========================================
  const [isReconciling, setIsReconciling] = useState(false);
  const [isTaxReconciled, setIsTaxReconciled] = useState(false);
  const [isTaxReportModalOpen, setIsTaxReportModalOpen] = useState(false);

  const taxRecords = [
    {
      voucher: "FC-A-0004-00018492",
      source: "AFIP / ARCA ↔ Banco Galicia",
      taxType: isEs ? "IVA Débito Fiscal (21%)" : "Output VAT (21%)",
      base: "$4,200.00",
      taxAmount: "$882.00",
      status: "matched",
    },
    {
      voucher: "RET-ARBA-2026-9941",
      source: "Padrón ARBA ↔ Extracto SIRCREB",
      taxType: isEs ? "Retención IIBB Bs.As. (3.5%)" : "Gross Income Withholding (3.5%)",
      base: "$12,500.00",
      taxAmount: "$437.50",
      status: isTaxReconciled ? "autofixed" : "diff",
    },
    {
      voucher: "FC-A-0002-00009104",
      source: "Proveedor Cloud ↔ Libro IVA Compras",
      taxType: isEs ? "IVA Crédito Fiscal (21%)" : "Input VAT Credit (21%)",
      base: "$1,950.00",
      taxAmount: "$409.50",
      status: "matched",
    },
    {
      voucher: "PERC-AFIP-88310",
      source: "AFIP Mis Retenciones ↔ ERP",
      taxType: isEs ? "Percepción IVA RG 2408" : "VAT Perception RG 2408",
      base: "$9,830.00",
      taxAmount: isTaxReconciled ? "$983.00" : "$940.00",
      status: isTaxReconciled ? "autofixed" : "diff",
    },
  ];

  const handleRunTaxReconciliation = () => {
    if (isReconciling) return;
    setIsReconciling(true);

    setNetworkLog({
      method: "POST",
      endpoint: "/api/v1/tax/reconcile-batch",
      status: 202,
      latency: "31ms",
      response: {
        job: "afip_arba_bank_cross_match",
        vouchers_scanned: 148,
        discrepancies_detected: 2,
        action: "auto_adjusting_withholding_certificates",
      },
    });

    setTimeout(() => {
      setIsReconciling(false);
      setIsTaxReconciled(true);
      setToastMessage(
        isEs
          ? "✔ Conciliación completada: 100% de comprobantes y retenciones cuadrados"
          : "✔ Reconciliation complete: 100% of invoices & withholdings matched"
      );
      setTimeout(() => setToastMessage(null), 3200);

      setNetworkLog({
        method: "POST",
        endpoint: "/api/v1/tax/reconcile-batch/commit",
        status: 200,
        latency: "19ms",
        response: {
          status: "reconciled",
          match_accuracy: "100.0%",
          net_vat_position: "$4,890.00",
          withholdings_recovered: "$1,420.50",
          libro_iva_digital: "READY_FOR_EXPORT",
        },
      });
    }, 650);
  };

  const handleAddTransaction = () => {
    const nextIdNum = 493 + erpTransactions.length - 3;
    const newTx = {
      id: `FAC-B-00${nextIdNum}`,
      client: isEs ? "Nuevo Cliente B2B" : "New B2B Client",
      item: isEs ? "Pipeline Automatización n8n" : "n8n Automation Pipeline",
      amount: "$1,200.00",
      status: "paid",
      date: new Date().toLocaleDateString(),
    };
    setErpTransactions([newTx, ...erpTransactions]);
    setErpRevenue((prev) => prev + 1200);

    setNetworkLog({
      method: "POST",
      endpoint: "/api/v1/erp/sales/invoice",
      status: 201,
      latency: "19ms",
      response: {
        record_id: newTx.id,
        action: "double_entry_ledger_commit",
        ledger_credit: "Revenue Account #401",
        ledger_debit: "Neon PostgreSQL Ledger",
        balance_check: "OK",
      },
    });
  };

  // Handle Tab Change
  const handleSelectApp = (appId) => {
    setActiveApp(appId);
    if (appId === "store") {
      setNetworkLog({
        method: "GET",
        endpoint: "/api/v1/products?category=all",
        status: 200,
        latency: "14ms",
        response: { view: "store_catalog", active_tab: "react19_spa" },
      });
    } else if (appId === "automation") {
      setNetworkLog({
        method: "GET",
        endpoint: "/api/v1/workflows/n8n/health",
        status: 200,
        latency: "8ms",
        response: {
          engine: "n8n_cloud_cluster",
          active_webhooks: 4,
          whatsapp_api: "connected",
        },
      });
    } else if (appId === "erp") {
      setNetworkLog({
        method: "GET",
        endpoint: "/api/v1/erp/dashboard/metrics",
        status: 200,
        latency: "16ms",
        response: {
          tenant: "garzaniti_erp_cloud",
          monthly_revenue: erpRevenue,
          audit_compliance: "passed",
        },
      });
    } else if (appId === "tax") {
      setNetworkLog({
        method: "GET",
        endpoint: "/api/v1/tax/reconciliation/status",
        status: 200,
        latency: "12ms",
        response: {
          sources: ["AFIP_ARCA_WSFE", "ARBA_SIRCREB", "BANK_STATEMENT_CSV"],
          period: "2026-11",
          auto_reports: "ReportLab PDF + OpenPyXL",
        },
      });
    }
  };

  return (
    <section id="services" className="services-section">
      <div className="section-badge">{t.services.badge}</div>
      <h2 className="section-heading">{t.services.heading}</h2>
      <p className="services-subheading">{t.services.subheading}</p>

      {/* Main Interactive Browser Sandbox Frame */}
      <div className="mini-web-browser">
        {/* Browser Top Window Bar */}
        <div className="browser-chrome-bar">
          <div className="browser-controls">
            <span className="b-dot b-red" />
            <span className="b-dot b-yellow" />
            <span className="b-dot b-green" />
          </div>

          {/* Browser Tabs */}
          <div className="browser-tabs-row" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeApp === "store"}
              onClick={() => handleSelectApp("store")}
              className={`browser-tab ${activeApp === "store" ? "active" : ""}`}
            >
              <span className="tab-title-text">{miniWeb.tabs.store.title}</span>
              <span className="tab-badge-pill">{miniWeb.tabs.store.badge}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeApp === "automation"}
              onClick={() => handleSelectApp("automation")}
              className={`browser-tab ${activeApp === "automation" ? "active" : ""}`}
            >
              <span className="tab-title-text">{miniWeb.tabs.automation.title}</span>
              <span className="tab-badge-pill">{miniWeb.tabs.automation.badge}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeApp === "erp"}
              onClick={() => handleSelectApp("erp")}
              className={`browser-tab ${activeApp === "erp" ? "active" : ""}`}
            >
              <span className="tab-title-text">{miniWeb.tabs.erp.title}</span>
              <span className="tab-badge-pill">{miniWeb.tabs.erp.badge}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeApp === "tax"}
              onClick={() => handleSelectApp("tax")}
              className={`browser-tab ${activeApp === "tax" ? "active" : ""}`}
            >
              <span className="tab-title-text">{miniWeb.tabs.tax.title}</span>
              <span className="tab-badge-pill">{miniWeb.tabs.tax.badge}</span>
            </button>
          </div>

          {/* Device Responsive Viewport Switch */}
          <div className="viewport-toggle-group">
            <button
              type="button"
              onClick={() => setViewportMode("desktop")}
              className={`vp-btn ${viewportMode === "desktop" ? "active" : ""}`}
              title="Desktop Viewport"
            >
              {miniWeb.browserBar.viewModeDesktop}
            </button>
            <button
              type="button"
              onClick={() => setViewportMode("mobile")}
              className={`vp-btn ${viewportMode === "mobile" ? "active" : ""}`}
              title="Mobile Viewport"
            >
              {miniWeb.browserBar.viewModeMobile}
            </button>
          </div>
        </div>

        {/* Browser URL & Address Header Bar */}
        <div className="browser-address-bar">
          <button
            type="button"
            className="browser-icon-btn"
            onClick={() => handleSelectApp(activeApp)}
            title={miniWeb.browserBar.reloadTooltip}
          >
            ↺
          </button>
          <div className="browser-url-field">
            <span className="url-lock-icon">🔒</span>
            <span className="url-hostname">
              {miniWeb.tabs[activeApp]?.url || "https://garzaniti-it.dev/demo"}
            </span>
          </div>
          <span className="browser-status-chip">{miniWeb.browserBar.networkStatus}</span>
        </div>

        {/* Browser Viewport Canvas Container */}
        <div className={`browser-viewport ${viewportMode === "mobile" ? "mode-mobile" : ""}`}>
          {toastMessage && <div className="mini-web-toast">{toastMessage}</div>}

          {/* ======================================================== */}
          {/* TAB 1: FULL-STACK COMMERCE & SAAS STORE DEMO             */}
          {/* ======================================================== */}
          {activeApp === "store" && (
            <div className="mini-app-canvas store-app">
              <div className="store-top-nav">
                <div className="store-brand">
                  <span className="store-logo">🛍️</span>
                  <div>
                    <h3 className="store-title">{miniWeb.store.brand}</h3>
                    <span className="store-sub">{miniWeb.store.tagline}</span>
                  </div>
                </div>

                <div className="store-nav-right">
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className="store-cart-pill"
                  >
                    <span>🛒 {miniWeb.store.cartLabel}</span>
                    <span className="cart-count-badge">{cart.length}</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="store-filter-bar">
                <button
                  type="button"
                  onClick={() => setStoreCategory("all")}
                  className={`filter-chip ${storeCategory === "all" ? "active" : ""}`}
                >
                  {miniWeb.store.categoryAll}
                </button>
                <button
                  type="button"
                  onClick={() => setStoreCategory("saas")}
                  className={`filter-chip ${storeCategory === "saas" ? "active" : ""}`}
                >
                  {miniWeb.store.categorySaas}
                </button>
                <button
                  type="button"
                  onClick={() => setStoreCategory("automation")}
                  className={`filter-chip ${storeCategory === "automation" ? "active" : ""}`}
                >
                  {miniWeb.store.categoryAutomation}
                </button>
              </div>

              {/* Product Catalog Cards */}
              <div className="store-product-grid">
                {filteredProducts.map((prod) => (
                  <div key={prod.id} className="store-product-card">
                    <div className="prod-icon-box">{prod.icon}</div>
                    <div className="prod-info">
                      <span className="prod-category-tag">{prod.category}</span>
                      <h4 className="prod-name">{prod.name}</h4>
                      <p className="prod-desc">{prod.desc}</p>
                    </div>
                    <div className="prod-bottom-row">
                      <span className="prod-price">{prod.price}</span>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(prod)}
                        className="prod-add-btn"
                      >
                        + {miniWeb.store.addToCart}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slide-over Cart / Checkout Drawer */}
              {isCartOpen && (
                <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)}>
                  <div
                    className="cart-drawer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="cart-drawer-header">
                      <h4>{miniWeb.store.drawerTitle}</h4>
                      <button
                        type="button"
                        onClick={() => setIsCartOpen(false)}
                        className="close-drawer-btn"
                      >
                        ✕
                      </button>
                    </div>

                    {orderConfirmed ? (
                      <div className="order-confirmed-view">
                        <span className="confirm-icon">🎉</span>
                        <h5>{miniWeb.store.checkoutSuccessTitle}</h5>
                        <p>{miniWeb.store.checkoutSuccessDesc}</p>
                        <div className="db-sync-badge">
                          ✔ PostgreSQL Neon Commit: #ORD-1042
                        </div>
                        <button
                          type="button"
                          onClick={handleResetStore}
                          className="store-reset-btn"
                        >
                          {miniWeb.store.resetBtn}
                        </button>
                      </div>
                    ) : cart.length === 0 ? (
                      <div className="empty-cart-state">
                        <p>{miniWeb.store.emptyCart}</p>
                      </div>
                    ) : (
                      <>
                        <div className="cart-items-list">
                          {cart.map((item, idx) => (
                            <div key={idx} className="cart-item-row">
                              <span className="cart-item-icon">{item.icon}</span>
                              <div className="cart-item-meta">
                                <span className="cart-item-name">{item.name}</span>
                                <span className="cart-item-price">{item.price}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="cart-drawer-footer">
                          <div className="cart-total-row">
                            <span>{miniWeb.store.totalLabel}</span>
                            <strong>
                              $
                              {cart
                                .reduce(
                                  (sum, i) =>
                                    sum + parseInt(i.price.replace(/[^0-9]/g, "")),
                                  0
                                )
                                .toLocaleString()}
                            </strong>
                          </div>
                          <button
                            type="button"
                            onClick={handleCheckout}
                            className="checkout-action-btn"
                          >
                            {miniWeb.store.checkoutBtn}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: n8n AUTOMATION & WHATSAPP PHONE BOT SIMULATOR    */}
          {/* ======================================================== */}
          {activeApp === "automation" && (
            <div className="mini-app-canvas automation-app">
              <div className="auto-split-layout">
                {/* Left Side: Lead Capture Form & Node Pipeline */}
                <div className="auto-form-pane">
                  <div className="pane-header-box">
                    <span className="pane-pill">n8n Engine Active</span>
                    <h4 className="pane-title">{miniWeb.automation.formTitle}</h4>
                    <p className="pane-desc">{miniWeb.automation.desc}</p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleTriggerWebhook();
                    }}
                    className="mock-lead-form"
                  >
                    <div className="mock-input-group">
                      <label>{miniWeb.automation.nameLabel}</label>
                      <input
                        type="text"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="Ej. Sofía Herrera"
                        required
                      />
                    </div>

                    <div className="mock-input-group">
                      <label>{miniWeb.automation.serviceLabel}</label>
                      <select
                        value={leadService}
                        onChange={(e) => setLeadService(e.target.value)}
                      >
                        <option value="n8n Automation & Workflows">
                          {isEs ? "Automatización n8n & Flujos" : "n8n Automation & Workflows"}
                        </option>
                        <option value="Tax Reconciliation & Automated Reports">
                          {isEs
                            ? "Conciliación de Impuestos & Reportes Automatizados"
                            : "Tax Reconciliation & Automated Reports"}
                        </option>
                        <option value="Full-Stack Web MVP (React 19)">
                          {isEs ? "MVP Full-Stack (React 19)" : "Full-Stack Web MVP (React 19)"}
                        </option>
                        <option value="Custom Business ERP">
                          {isEs ? "Sistema ERP a Medida" : "Custom Business ERP"}
                        </option>
                      </select>
                    </div>

                    <div className="mock-input-group">
                      <label>{miniWeb.automation.priorityLabel}</label>
                      <div className="priority-chips-row">
                        <button
                          type="button"
                          onClick={() => setLeadPriority("high")}
                          className={`priority-btn ${leadPriority === "high" ? "active" : ""}`}
                        >
                          🔥 {miniWeb.automation.priorityHigh}
                        </button>
                        <button
                          type="button"
                          onClick={() => setLeadPriority("normal")}
                          className={`priority-btn ${leadPriority === "normal" ? "active" : ""}`}
                        >
                          ⚡ {miniWeb.automation.priorityNormal}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isFlowRunning}
                      className={`trigger-webhook-btn ${isFlowRunning ? "running" : ""}`}
                    >
                      {isFlowRunning
                        ? miniWeb.automation.btnProcessing
                        : miniWeb.automation.btnTrigger}
                    </button>
                  </form>

                  {/* Flow Steps Pipeline Monitor */}
                  <div className="pipeline-steps-indicator">
                    <div className={`p-step ${flowStep !== null && flowStep >= 0 ? "active" : ""}`}>
                      <span className="p-dot" />
                      <span>{miniWeb.automation.step1}</span>
                    </div>
                    <div className={`p-step ${flowStep !== null && flowStep >= 1 ? "active" : ""}`}>
                      <span className="p-dot" />
                      <span>{miniWeb.automation.step2}</span>
                    </div>
                    <div className={`p-step ${flowStep !== null && flowStep >= 2 ? "active" : ""}`}>
                      <span className="p-dot" />
                      <span>{miniWeb.automation.step3}</span>
                    </div>
                    <div className={`p-step ${flowStep !== null && flowStep >= 3 ? "active" : ""}`}>
                      <span className="p-dot" />
                      <span>{miniWeb.automation.step4}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Real Simulated Smartphone running WhatsApp */}
                <div className="auto-phone-pane">
                  <div className="smartphone-frame">
                    <div className="phone-notch">
                      <span className="phone-speaker" />
                      <span className="phone-cam" />
                    </div>

                    {/* WhatsApp Header */}
                    <div className="whatsapp-screen-header">
                      <div className="wa-avatar-box">🤖</div>
                      <div className="wa-contact-info">
                        <span className="wa-contact-name">{miniWeb.automation.phoneTitle}</span>
                        <span className="wa-status-text">
                          {isPhoneTyping
                            ? miniWeb.automation.phoneTyping
                            : miniWeb.automation.phoneSub}
                        </span>
                      </div>
                    </div>

                    {/* WhatsApp Chat Body */}
                    <div className="whatsapp-chat-body">
                      {phoneMessages.map((msg) => (
                        <div key={msg.id} className="wa-bubble wa-received">
                          <p className="bubble-text">{msg.text}</p>
                          <div className="bubble-footer">
                            <span className="bubble-time">{msg.time}</span>
                            <span className="bubble-ticks">✔✔</span>
                          </div>
                        </div>
                      ))}

                      {isPhoneTyping && (
                        <div className="wa-bubble wa-received wa-typing-bubble">
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                        </div>
                      )}
                    </div>

                    {/* WhatsApp Input Bar */}
                    <div className="whatsapp-input-bar">
                      <span className="wa-input-placeholder">
                        {isEs ? "Respuesta automática de bot..." : "Automatic bot response..."}
                      </span>
                      <span className="wa-send-icon">🎙️</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: CUSTOM ERP & MANAGEMENT DASHBOARD                */}
          {/* ======================================================== */}
          {activeApp === "erp" && (
            <div className="mini-app-canvas erp-app">
              <div className="erp-top-bar">
                <div>
                  <h3 className="erp-heading">{miniWeb.erp.title}</h3>
                  <span className="erp-subheading">{miniWeb.erp.desc}</span>
                </div>

                <div className="erp-actions-bar">
                  <button
                    type="button"
                    onClick={handleAddTransaction}
                    className="erp-btn btn-add"
                  >
                    {miniWeb.erp.btnAddSale}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPdfModalOpen(true)}
                    className="erp-btn btn-export"
                  >
                    {miniWeb.erp.btnExportPdf}
                  </button>
                </div>
              </div>

              {/* KPI Stat Cards */}
              <div className="erp-kpi-grid">
                <div className="erp-kpi-card">
                  <span className="kpi-label">{miniWeb.erp.kpi1Label}</span>
                  <div className="kpi-val">${erpRevenue.toLocaleString()}</div>
                  <span className="kpi-badge positive">{miniWeb.erp.kpi1Sub}</span>
                </div>

                <div className="erp-kpi-card">
                  <span className="kpi-label">{miniWeb.erp.kpi2Label}</span>
                  <div className="kpi-val">{erpTransactions.length + 139}</div>
                  <span className="kpi-badge neutral">{miniWeb.erp.kpi2Sub}</span>
                </div>

                <div className="erp-kpi-card">
                  <span className="kpi-label">{miniWeb.erp.kpi3Label}</span>
                  <div className="kpi-val">{miniWeb.erp.kpi3Val}</div>
                  <span className="kpi-badge highlight">{miniWeb.erp.kpi3Sub}</span>
                </div>
              </div>

              {/* Data Table */}
              <div className="erp-table-container">
                <div className="table-header-row">
                  <h4>{miniWeb.erp.tableTitle}</h4>
                  <span className="row-count">
                    {erpTransactions.length} {isEs ? "comprobantes" : "invoices"}
                  </span>
                </div>

                <div className="table-responsive-box">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>{miniWeb.erp.colId}</th>
                        <th>{miniWeb.erp.colClient}</th>
                        <th>{miniWeb.erp.colService}</th>
                        <th>{miniWeb.erp.colAmount}</th>
                        <th>{miniWeb.erp.colStatus}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {erpTransactions.map((tx, idx) => (
                        <tr key={idx} className="erp-row">
                          <td className="code-cell">{tx.id}</td>
                          <td className="client-cell">{tx.client}</td>
                          <td>{tx.item}</td>
                          <td className="amount-cell">{tx.amount}</td>
                          <td>
                            <span
                              className={`status-pill ${
                                tx.status === "paid" ? "pill-paid" : "pill-pending"
                              }`}
                            >
                              {tx.status === "paid"
                                ? miniWeb.erp.statusPaid
                                : miniWeb.erp.statusPending}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PDF Preview Modal */}
              {isPdfModalOpen && (
                <div className="erp-modal-backdrop" onClick={() => setIsPdfModalOpen(false)}>
                  <div
                    className="erp-pdf-modal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="pdf-modal-header">
                      <h4>{miniWeb.erp.pdfPreviewTitle}</h4>
                      <button
                        type="button"
                        onClick={() => setIsPdfModalOpen(false)}
                        className="close-drawer-btn"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="pdf-sheet-preview">
                      <div className="pdf-doc-header">
                        <span className="doc-brand">GARZANITI IT • REPORTES</span>
                        <span className="doc-num">AUDIT-2026-Q4</span>
                      </div>
                      <p className="doc-summary">{miniWeb.erp.pdfPreviewDesc}</p>
                      <div className="doc-sample-lines">
                        <div className="sample-line">
                          <span>{miniWeb.erp.kpi1Label}:</span>
                          <strong>${erpRevenue.toLocaleString()}</strong>
                        </div>
                        <div className="sample-line">
                          <span>{miniWeb.erp.kpi2Label}:</span>
                          <strong>{erpTransactions.length + 139}</strong>
                        </div>
                        <div className="sample-line">
                          <span>{miniWeb.erp.kpi3Label}:</span>
                          <strong>{miniWeb.erp.kpi3Val}</strong>
                        </div>
                      </div>
                      <div className="doc-stamp">✔ AUDITADO & FIRMADO DIGITALMENTE</div>
                    </div>

                    <div className="pdf-modal-footer">
                      <button
                        type="button"
                        onClick={() => setIsPdfModalOpen(false)}
                        className="pdf-close-btn"
                      >
                        {miniWeb.erp.pdfClose}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: TAX RECONCILIATION & AUTOMATED REPORTS ENGINE     */}
          {/* ======================================================== */}
          {activeApp === "tax" && (
            <div className="mini-app-canvas erp-app tax-app">
              <div className="erp-top-bar">
                <div>
                  <h3 className="erp-heading">{miniWeb.tax.title}</h3>
                  <span className="erp-subheading">{miniWeb.tax.desc}</span>
                </div>

                <div className="erp-actions-bar">
                  <button
                    type="button"
                    onClick={handleRunTaxReconciliation}
                    disabled={isReconciling}
                    className="erp-btn btn-add"
                  >
                    {isReconciling ? miniWeb.tax.btnReconciling : miniWeb.tax.btnReconcile}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTaxReportModalOpen(true)}
                    className="erp-btn btn-export"
                  >
                    {miniWeb.tax.btnExportTaxReport}
                  </button>
                </div>
              </div>

              {/* Tax & Fiscal KPI Stat Cards */}
              <div className="erp-kpi-grid">
                <div className="erp-kpi-card">
                  <span className="kpi-label">{miniWeb.tax.kpi1Label}</span>
                  <div className="kpi-val">{isTaxReconciled ? "$4,890.00" : "$4,933.00"}</div>
                  <span className="kpi-badge positive">{miniWeb.tax.kpi1Sub}</span>
                </div>

                <div className="erp-kpi-card">
                  <span className="kpi-label">{miniWeb.tax.kpi2Label}</span>
                  <div className="kpi-val">{miniWeb.tax.kpi2Val}</div>
                  <span className="kpi-badge neutral">{miniWeb.tax.kpi2Sub}</span>
                </div>

                <div className="erp-kpi-card">
                  <span className="kpi-label">{miniWeb.tax.kpi3Label}</span>
                  <div className="kpi-val">{isTaxReconciled ? "100.0%" : "94.2%"}</div>
                  <span className="kpi-badge highlight">{miniWeb.tax.kpi3Sub}</span>
                </div>
              </div>

              {/* Tax Reconciliation Cross-Match Table */}
              <div className="erp-table-container">
                <div className="table-header-row">
                  <h4>{miniWeb.tax.tableTitle}</h4>
                  <span className="row-count">
                    {isTaxReconciled
                      ? isEs
                        ? "0 desvíos pendientes"
                        : "0 pending discrepancies"
                      : isEs
                      ? "2 desvíos detectados"
                      : "2 discrepancies detected"}
                  </span>
                </div>

                <div className="table-responsive-box">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>{miniWeb.tax.colVoucher}</th>
                        <th>{miniWeb.tax.colSource}</th>
                        <th>{miniWeb.tax.colTaxType}</th>
                        <th>{miniWeb.tax.colBase}</th>
                        <th>{miniWeb.tax.colTaxAmount}</th>
                        <th>{miniWeb.tax.colStatus}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxRecords.map((rec, idx) => (
                        <tr key={idx} className="erp-row">
                          <td className="code-cell">{rec.voucher}</td>
                          <td className="client-cell">{rec.source}</td>
                          <td>{rec.taxType}</td>
                          <td>{rec.base}</td>
                          <td className="amount-cell">{rec.taxAmount}</td>
                          <td>
                            <span
                              className={`status-pill ${
                                rec.status === "diff" ? "pill-pending" : "pill-paid"
                              }`}
                            >
                              {rec.status === "matched"
                                ? miniWeb.tax.statusMatched
                                : rec.status === "autofixed"
                                ? miniWeb.tax.statusAutoFixed
                                : miniWeb.tax.statusDiff}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fiscal VAT Ledger & Tax Report Modal */}
              {isTaxReportModalOpen && (
                <div
                  className="erp-modal-backdrop"
                  onClick={() => setIsTaxReportModalOpen(false)}
                >
                  <div
                    className="erp-pdf-modal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="pdf-modal-header">
                      <h4>{miniWeb.tax.reportModalTitle}</h4>
                      <button
                        type="button"
                        onClick={() => setIsTaxReportModalOpen(false)}
                        className="close-drawer-btn"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="pdf-sheet-preview">
                      <div className="pdf-doc-header">
                        <span className="doc-brand">GARZANITI IT • LIBRO IVA DIGITAL</span>
                        <span className="doc-num">AFIP-ARCA-2026-11</span>
                      </div>
                      <p className="doc-summary">{miniWeb.tax.reportModalDesc}</p>
                      <div className="doc-sample-lines">
                        <div className="sample-line">
                          <span>{miniWeb.tax.kpi1Label}:</span>
                          <strong>{isTaxReconciled ? "$4,890.00" : "$4,933.00"}</strong>
                        </div>
                        <div className="sample-line">
                          <span>{miniWeb.tax.kpi2Label}:</span>
                          <strong>{miniWeb.tax.kpi2Val}</strong>
                        </div>
                        <div className="sample-line">
                          <span>{miniWeb.tax.kpi3Label}:</span>
                          <strong>{isTaxReconciled ? "100.0%" : "94.2%"}</strong>
                        </div>
                      </div>
                      <div className="doc-stamp">
                        ✔ CONCILIADO CON AFIP/ARCA, ARBA Y EXTRACTOS BANCARIOS
                      </div>
                    </div>

                    <div className="pdf-modal-footer">
                      <button
                        type="button"
                        onClick={() => setIsTaxReportModalOpen(false)}
                        className="pdf-close-btn"
                      >
                        {miniWeb.tax.reportClose}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* BOTTOM INSPECTOR DRAWER (DEVTOOLS NETWORK & API TRAFFIC) */}
        {/* ======================================================== */}
        <div className="browser-devtools-drawer">
          <div
            className="devtools-header"
            onClick={() => setShowDevtools(!showDevtools)}
          >
            <div className="devtools-title-group">
              <span className="devtools-dot" />
              <span>{miniWeb.devtools.title}</span>
              <span className="method-pill">{networkLog.method}</span>
              <span className="endpoint-text">{networkLog.endpoint}</span>
            </div>
            <div className="devtools-actions">
              <span className="latency-chip">{networkLog.latency}</span>
              <span className="status-code-chip">{networkLog.status}</span>
              <button type="button" className="toggle-devtools-btn">
                {showDevtools ? "▲ " + miniWeb.devtools.hideText : "▼ " + miniWeb.devtools.showText}
              </button>
            </div>
          </div>

          {showDevtools && (
            <div className="devtools-body">
              <div className="devtools-meta-bar">
                <span>
                  <strong>Database:</strong> PostgreSQL Neon Cluster (sa-east-1)
                </span>
                <span>
                  <strong>Engine:</strong> Django REST Framework & n8n
                </span>
                <span>
                  <strong>Latency:</strong> {networkLog.latency}
                </span>
              </div>
              <pre className="devtools-json-output">
                <code>{JSON.stringify(networkLog.response, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Services Value Proposition Pillars / Summary */}
      <div className="services-offerings-grid">
        {t.services.items.map((item) => (
          <div key={item.id} className="offering-card">
            <div className="offering-header">
              <span className="offering-icon">{item.icon}</span>
              <div className="offering-title-box">
                <span className="offering-badge">{item.badge}</span>
                <h4 className="offering-title">{item.title}</h4>
              </div>
            </div>
            <p className="offering-tagline">{item.tagline}</p>
            <p className="offering-desc">{item.description}</p>
            <div className="offering-roi">
              <strong>ROI:</strong> {item.roi}
            </div>
            <div className="offering-deliverables">
              {item.deliverables.map((deliv, dIdx) => (
                <div key={dIdx} className="deliv-row">
                  <span className="check-mark">✔</span>
                  <span>{deliv}</span>
                </div>
              ))}
            </div>
            <div className="offering-chips">
              {item.techStack.map((tech, tIdx) => (
                <span key={tIdx} className="tech-chip">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
