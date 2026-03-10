import {
  IconUserPlus,
  IconSearch,
  IconSend,
  IconMapPin,
  IconBuilding,
  IconCurrencyDollar,
} from "@tabler/icons-react";

const steps = [
  {
    icon: IconUserPlus,
    title: "Tạo hồ sơ chuyên nghiệp",
    desc: "Xây dựng hồ sơ ấn tượng giúp bạn nổi bật trước nhà tuyển dụng.",
  },
  {
    icon: IconSearch,
    title: "Tìm kiếm việc làm phù hợp",
    desc: "Hệ thống gợi ý thông minh dựa trên kỹ năng và kinh nghiệm của bạn.",
  },
  {
    icon: IconSend,
    title: "Ứng tuyển chỉ với 1 click",
    desc: "Nộp hồ sơ nhanh chóng và theo dõi trạng thái ứng tuyển realtime.",
  },
];

const jobs = [
  {
    title: "Senior Frontend Developer",
    company: "Techcom Solutions",
    location: "Hà Nội",
    salary: "$1500 - $2000",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Techcombank_logo.png/640px-Techcombank_logo.png",
  },
  {
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "TP.HCM",
    salary: "$1200 - $1700",
    logoUrl: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-designs_343694-2506.jpg",
  },
  {
    title: "Backend Engineer",
    company: "Fintech Corp",
    location: "Đà Nẵng",
    salary: "$1800 - $2500",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=FC",
  },
];

const Working = () => {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Background ornaments */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-teal-200/40 blur-[110px]" />
        <div className="absolute -bottom-28 -left-28 h-[420px] w-[420px] rounded-full bg-emerald-200/40 blur-[110px]" />
        <div className="absolute -right-36 top-1/3 h-[420px] w-[420px] rounded-full bg-sky-200/30 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.06)_1px,transparent_0)] [background-size:22px_22px] opacity-40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-teal-500" />
            Quy trình ứng tuyển
          </div>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Bắt đầu nhanh, kết quả
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              {" "}rõ ràng
            </span>
          </h2>

          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            3 bước gọn gàng để bạn tạo hồ sơ, tìm việc phù hợp và ứng tuyển trong vài giây.
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* LEFT - Step cards */}
          <div className="relative">
            <div className="absolute left-7 top-6 hidden h-[calc(100%-48px)] w-px bg-gradient-to-b from-teal-200 via-slate-200 to-emerald-200 lg:block" />

            <div className="space-y-5">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={i}
                    className="group relative rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-teal-300/70 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-md ring-1 ring-white/40">
                        <Icon size={26} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                            Bước {i + 1}
                          </span>
                          <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                            {step.title}
                          </h3>
                        </div>

                        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT - Job cards */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-xl backdrop-blur sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    Gợi ý việc làm phù hợp
                  </h4>
                  <p className="mt-1 text-sm text-slate-600">
                    Một vài vị trí nổi bật dựa trên hồ sơ của bạn.
                  </p>
                </div>

                <button className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-300 hover:text-teal-700">
                  Xem tất cả
                </button>
              </div>

              <div className="mt-7 space-y-4">
                {jobs.map((job, index) => (
                  <div
                    key={index}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      {/* Logo Công ty */}
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                        {job.logoUrl ? (
                          <img
                            src={job.logoUrl}
                            alt={job.company}
                            className="h-full w-full object-contain p-1"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-teal-50 text-teal-600">
                            <IconBuilding size={20} />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                            {job.title}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-600">
                            <div className="inline-flex items-center gap-1.5">
                              <span className="font-medium text-slate-700">{job.company}</span>
                            </div>

                            <div className="inline-flex items-center gap-1.5">
                              <IconMapPin size={14} className="text-slate-400" />
                              <span>{job.location}</span>
                            </div>

                            <div className="inline-flex items-center gap-1.5 text-teal-600">
                              <IconCurrencyDollar size={14} />
                              <span className="font-semibold">{job.salary}</span>
                            </div>
                          </div>
                        </div>

                        <button className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95">
                          Ứng tuyển
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Mẹo để tăng tỉ lệ phản hồi
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Cập nhật portfolio & từ khóa kỹ năng để hệ thống gợi ý chính xác hơn.
                    </p>
                  </div>

                  <div className="text-sm font-semibold text-teal-700">
                    +25% lượt xem hồ sơ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Working;