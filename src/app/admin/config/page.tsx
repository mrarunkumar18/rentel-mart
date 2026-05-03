"use client";

import { useEffect, useState } from "react";
import { RouteGuard } from "@/components/admin/RouteGuard";
import { Button, PageHeader, useToastStore } from "@/components/admin/ui";
import { configInterceptor } from "@/mocks/interceptors/configInterceptor";
import { useRBAC } from "@/hooks/useRBAC";
import { AdminPlatformConfig } from "@/types/admin";
import { RotateCcw, Save, AlertCircle } from "lucide-react";

type FieldMeta = {
  key: keyof AdminPlatformConfig;
  label: string;
  type: "number" | "boolean" | "email";
  min?: number;
  max?: number;
};

const CONFIG_GROUPS: { title: string; fields: FieldMeta[] }[] = [
  {
    title: "Fees & Pricing",
    fields: [
      { key: "platform_fee_percentage", label: "Platform Fee (%)", type: "number", min: 0, max: 100 },
      { key: "late_return_fee_per_hour", label: "Late Return Fee (₹/hour)", type: "number", min: 0 },
      { key: "security_deposit_multiplier", label: "Security Deposit Multiplier", type: "number", min: 1 },
      { key: "minimum_rental_duration_hours", label: "Min Rental Duration (hours)", type: "number", min: 1 },
      { key: "maximum_rental_duration_days", label: "Max Rental Duration (days)", type: "number", min: 1 },
    ],
  },
  {
    title: "User Policies",
    fields: [
      { key: "require_id_verification", label: "Require ID Verification", type: "boolean" },
      { key: "require_phone_verification", label: "Require Phone Verification", type: "boolean" },
      { key: "max_active_bookings_per_user", label: "Max Active Bookings Per User", type: "number", min: 1 },
      { key: "auto_suspend_after_disputes", label: "Auto-Suspend After N Disputes", type: "number", min: 1 },
      { key: "guest_checkout_enabled", label: "Guest Checkout Enabled", type: "boolean" },
    ],
  },
  {
    title: "Listing Rules",
    fields: [
      { key: "max_photos_per_listing", label: "Max Photos Per Listing", type: "number", min: 1, max: 30 },
      { key: "require_pickup_photos", label: "Require Pickup Photos", type: "boolean" },
      { key: "require_return_photos", label: "Require Return Photos", type: "boolean" },
      { key: "listing_approval_required", label: "Listing Approval Required", type: "boolean" },
    ],
  },
  {
    title: "Notifications",
    fields: [
      { key: "send_booking_email", label: "Send Booking Confirmation Email", type: "boolean" },
      { key: "send_dispute_email", label: "Send Dispute Alert Email", type: "boolean" },
      { key: "admin_alert_email", label: "Admin Alert Email Address", type: "email" },
    ],
  },
  {
    title: "Operational",
    fields: [
      { key: "maintenance_mode", label: "Maintenance Mode (shows banner on portal)", type: "boolean" },
    ],
  },
];

export default function PlatformConfigPage() {
  return <RouteGuard moduleId="M07"><ConfigContent /></RouteGuard>;
}

function ConfigContent() {
  const { can } = useRBAC();
  const { addToast } = useToastStore();
  const [saved, setSaved] = useState<AdminPlatformConfig | null>(null);
  const [draft, setDraft] = useState<AdminPlatformConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AdminPlatformConfig, string>>>({});

  useEffect(() => {
    configInterceptor.getConfig().then((c) => { setSaved(c); setDraft({ ...c }); setLoading(false); });
  }, []);

  const isDirty = saved && draft && JSON.stringify(saved) !== JSON.stringify(draft);

  const validate = (): boolean => {
    if (!draft) return false;
    const errs: Partial<Record<keyof AdminPlatformConfig, string>> = {};
    if (draft.platform_fee_percentage < 0 || draft.platform_fee_percentage > 100) errs.platform_fee_percentage = "Must be 0–100";
    if (draft.security_deposit_multiplier < 1) errs.security_deposit_multiplier = "Must be ≥ 1";
    if (draft.minimum_rental_duration_hours < 1) errs.minimum_rental_duration_hours = "Must be ≥ 1";
    if (draft.maximum_rental_duration_days < 1) errs.maximum_rental_duration_days = "Must be ≥ 1";
    if (draft.max_photos_per_listing < 1 || draft.max_photos_per_listing > 30) errs.max_photos_per_listing = "Must be 1–30";
    if (draft.admin_alert_email && !/^\S+@\S+\.\S+$/.test(draft.admin_alert_email)) errs.admin_alert_email = "Invalid email format";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !draft) return;
    setSaving(true);
    try {
      const updated = await configInterceptor.saveConfig(draft);
      setSaved(updated); setDraft({ ...updated });
      addToast("Settings saved successfully", "success");
    } catch {
      addToast("Failed to save. Please try again.", "error");
    } finally { setSaving(false); }
  };

  const handleRevert = () => {
    if (saved) { setDraft({ ...saved }); setErrors({}); }
  };

  const update = <K extends keyof AdminPlatformConfig>(key: K, value: AdminPlatformConfig[K]) => {
    setDraft(d => d ? { ...d, [key]: value } : d);
  };

  if (loading || !draft) return <div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-lg" />)}</div>;

  return (
    <>
      <PageHeader
        title="Platform Configuration"
        subtitle="Operational settings"
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleRevert} disabled={!isDirty}>
              <RotateCcw size={13} /> Revert All
            </Button>
            {can("M07", "edit") && (
              <Button size="sm" loading={saving} disabled={!isDirty} onClick={handleSave}>
                <Save size={13} /> Save Changes
              </Button>
            )}
          </div>
        }
      />

      {isDirty && (
        <div className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          <AlertCircle size={15} />
          You have unsaved changes. Click "Save Changes" to apply.
        </div>
      )}

      <div className="space-y-6">
        {CONFIG_GROUPS.map((group) => (
          <div key={group.title} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-semibold text-slate-700 text-sm">{group.title}</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {group.fields.map(({ key, label, type, min, max }) => {
                const rawSaved = saved?.[key];
                const rawDraft = draft[key];
                const isFieldDirty = JSON.stringify(rawSaved) !== JSON.stringify(rawDraft);
                const error = errors[key];

                return (
                  <div key={key} className="flex items-center justify-between px-6 py-4 gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        {label}
                        {isFieldDirty && <span className="text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full font-medium">Modified</span>}
                      </p>
                      {error && <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
                    </div>

                    <div className="shrink-0">
                      {type === "boolean" ? (
                        <button
                          disabled={!can("M07", "edit")}
                          onClick={() => update(key, !rawDraft as AdminPlatformConfig[typeof key])}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${rawDraft ? "bg-primary" : "bg-slate-200"} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${rawDraft ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                      ) : type === "email" ? (
                        <input
                          type="email"
                          disabled={!can("M07", "edit")}
                          value={rawDraft as string}
                          onChange={(e) => update(key, e.target.value as AdminPlatformConfig[typeof key])}
                          className={`w-56 border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-50 ${error ? "border-red-300" : "border-slate-200"}`}
                        />
                      ) : (
                        <input
                          type="number"
                          disabled={!can("M07", "edit")}
                          min={min}
                          max={max}
                          value={rawDraft as number}
                          onChange={(e) => update(key, Number(e.target.value) as AdminPlatformConfig[typeof key])}
                          className={`w-28 border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-50 ${error ? "border-red-300" : "border-slate-200"}`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
