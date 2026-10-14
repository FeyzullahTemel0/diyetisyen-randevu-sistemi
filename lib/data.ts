export type Mode = "online" | "in-person";
export type ServiceId = "first" | "follow" | "online" | "review";

export type Service = {
  id: ServiceId;
  name: string;
  minutes: number;
  summary: string;
  modes: Mode[];
};

export const SERVICES: Service[] = [
  {
    id: "first",
    name: "İlk görüşme",
    minutes: 60,
    summary:
      "Beslenme alışkanlıklarınızı, günlük düzeninizi ve hedeflerinizi birlikte konuşacağımız tanışma görüşmesi.",
    modes: ["online", "in-person"],
  },
  {
    id: "follow",
    name: "Takip görüşmesi",
    minutes: 30,
    summary:
      "Önceki görüşmeden bu yana neler değişti? Alışkanlık günlüğünüze birlikte bakıp bir sonraki adımı netleştiriyoruz.",
    modes: ["online", "in-person"],
  },
  {
    id: "online",
    name: "Online görüşme",
    minutes: 40,
    summary:
      "Evinizden ya da ofisinizden, görüntülü bağlantıyla yapılan genel beslenme danışmanlığı görüşmesi.",
    modes: ["online"],
  },
  {
    id: "review",
    name: "Beslenme planı değerlendirmesi",
    minutes: 30,
    summary:
      "Elinizdeki öğün düzenini ya da planı birlikte gözden geçirip uygulanabilirliğini konuşuyoruz.",
    modes: ["online", "in-person"],
  },
];

export const MODE_LABEL: Record<Mode, string> = {
  online: "Online",
  "in-person": "Yüz yüze",
};

export const FAQS = [
  {
    q: "Online görüşme nasıl yapılıyor?",
    a: "Gerçek bir sistemde randevu saatinde size bir görüntülü görüşme bağlantısı iletilirdi. Bu demoda bağlantı oluşturulmaz; akış yalnızca nasıl çalışacağını göstermek içindir. Online görüşme için sessiz bir ortam ve stabil bir internet bağlantısı yeterlidir.",
  },
  {
    q: "Randevumu değiştirebilir veya iptal edebilir miyim?",
    a: "Gerçek bir kurulumda değişiklik talepleri en az bir gün önceden yapılabilir olurdu; süre ve koşulları kurumun kendisi belirler. Demoda “Danışan görünümü” bölümünden değişiklik akışının nasıl görüneceğini deneyebilirsiniz.",
  },
  {
    q: "Görüşmeye nasıl hazırlanmalıyım?",
    a: "Bir iki günlük öğün notu, günlük rutininizi anlatan birkaç cümle ve merak ettiklerinizi yazdığınız kısa bir liste çoğu zaman yeterlidir. Kullandığınız ilaç veya sağlık durumunuzla ilgili konular için yetkili sağlık profesyonelinize danışın.",
  },
  {
    q: "Bu sayfa gerçek bir randevu oluşturur mu?",
    a: "Hayır. “Denge Beslenme Atölyesi” kurgusal bir demo markasıdır. Hiçbir bilgi sunucuya gönderilmez, saklanmaz; e-posta, SMS veya ödeme işlemi yoktur.",
  },
];

/* ---------- Tarih yardımcıları ---------- */

export function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, n: number): string {
  const d = fromISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function formatLong(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    weekday: "long",
  }).format(fromISO(iso));
}

export function formatShort(iso: string): { dow: string; day: string } {
  const d = fromISO(iso);
  return {
    dow: new Intl.DateTimeFormat("tr-TR", { weekday: "short" }).format(d),
    day: String(d.getDate()),
  };
}

/* ---------- Müsaitlik (deterministik, kurgusal) ---------- */

export const TIMES: string[] = Array.from({ length: 18 }, (_, i) => {
  const mins = 9 * 60 + i * 30;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
});

export type SlotStatus = "open" | "full" | "closed";

export function slotStatus(iso: string, time: string, mode: Mode): SlotStatus {
  const d = fromISO(iso);
  const dow = d.getDay();
  if (dow === 0) return "closed";
  if (mode === "in-person" && ![2, 4, 6].includes(dow)) return "closed";
  if (dow === 6 && (time < "10:00" || time > "13:30")) return "closed";
  if (dow !== 6 && (time === "12:30" || time === "13:00")) return "closed";
  const idx = TIMES.indexOf(time);
  const h = (d.getDate() * 7 + idx * 13 + (mode === "online" ? 3 : 5) * dow) % 5;
  return h === 0 || h === 3 ? "full" : "open";
}

export function dayOpenCount(iso: string, mode: Mode): number {
  return TIMES.filter((t) => slotStatus(iso, t, mode) === "open").length;
}

/* ---------- Uzman paneli örnek verisi ---------- */

export type ApptStatus = "confirmed" | "pending" | "done" | "cancelled";

export const STATUS_LABEL: Record<ApptStatus, string> = {
  confirmed: "Onaylı",
  pending: "Bekliyor",
  done: "Tamamlandı",
  cancelled: "İptal",
};

export type Appt = {
  id: string;
  time: string;
  client: string;
  service: ServiceId;
  mode: Mode;
  status: ApptStatus;
  note: string;
};

const TEMPLATES: Omit<Appt, "id">[] = [
  { time: "09:30", client: "Örnek Danışan A.", service: "first", mode: "online", status: "confirmed", note: "Günlük rutin ve öğün saatleri üzerine tanışma. Örnek not." },
  { time: "10:30", client: "Örnek Danışan B.", service: "follow", mode: "in-person", status: "confirmed", note: "Haftalık alışkanlık günlüğü birlikte gözden geçirilecek. Örnek not." },
  { time: "11:30", client: "Örnek Danışan C.", service: "review", mode: "online", status: "pending", note: "Mevcut öğün planının uygulanabilirliği konuşulacak. Örnek not." },
  { time: "14:00", client: "Örnek Danışan D.", service: "online", mode: "online", status: "confirmed", note: "Genel beslenme sohbeti, hazırlık listesi paylaşıldı. Örnek not." },
  { time: "15:00", client: "Örnek Danışan E.", service: "follow", mode: "online", status: "cancelled", note: "Danışan saat değişikliği istedi. Örnek not." },
  { time: "16:30", client: "Örnek Danışan F.", service: "first", mode: "in-person", status: "pending", note: "Onay bekleniyor. Örnek not." },
];

export function apptsForDay(iso: string, offset: number): Appt[] {
  const dow = fromISO(iso).getDay();
  if (dow === 0) return [];
  return TEMPLATES.map((t, i) => ({
    ...t,
    id: `${iso}-${i}`,
    status: offset === 0 && i < 2 ? ("done" as ApptStatus) : t.status,
  })).filter((_, i) => (i + dow) % 3 !== 0 || i === 0);
}

export function serviceName(id: ServiceId): string {
  return SERVICES.find((s) => s.id === id)?.name ?? id;
}

export function serviceMinutes(id: ServiceId): number {
  return SERVICES.find((s) => s.id === id)?.minutes ?? 30;
}
