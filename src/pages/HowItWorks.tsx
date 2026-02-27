import { ShoppingBag, Repeat, Wallet, CheckCircle2 } from 'lucide-react';

const marketplaceSteps = [
  {
    title: 'Browse verified listings',
    description:
      'Open Marketplace to discover vouchers by brand, category, value, and expiry date.',
  },
  {
    title: 'Compare value and savings',
    description:
      'Review discount percentage, seller trust signals, and voucher details before purchase.',
  },
  {
    title: 'Buy securely',
    description:
      'Complete the purchase flow to transfer the voucher into your wallet instantly.',
  },
];

const exchangeSteps = [
  {
    title: 'Submit your voucher',
    description:
      'Pick a voucher you no longer need and share the value, brand, and expiry details.',
  },
  {
    title: 'Get smart matches',
    description:
      'VoucherX suggests best-fit exchange options using value similarity, demand, and timing.',
  },
  {
    title: 'Accept and confirm',
    description:
      'Approve the exchange proposal, then both users receive updated voucher ownership records.',
  },
];

const walletSteps = [
  {
    title: 'Track active vouchers',
    description:
      'View all vouchers in one place with status, available value, and upcoming expiry dates.',
  },
  {
    title: 'Use or redeem quickly',
    description:
      'Open voucher details to copy codes, mark as redeemed, and keep your history organized.',
  },
  {
    title: 'Stay ahead of expiry',
    description:
      'Prioritize soon-to-expire vouchers and move them to Exchange or Marketplace when needed.',
  },
];

interface StepCardProps {
  index: number;
  title: string;
  description: string;
}

function StepCard({ index, title, description }: StepCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-blue-600 text-sm font-semibold text-white">
        {index + 1}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <div className="space-y-8 sm:space-y-10 lg:space-y-12">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-teal-600">How VoucherX Works</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Trade smarter, save faster, and keep every voucher useful
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
            VoucherX combines marketplace buying, intelligent exchange matching, and wallet tracking in one
            streamlined flow. Follow the steps below to get the most value from every voucher.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-teal-50 p-2 text-teal-600">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Marketplace Flow</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {marketplaceSteps.map((step, index) => (
            <StepCard key={step.title} index={index} title={step.title} description={step.description} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
            <Repeat className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Smart Exchange</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exchangeSteps.map((step, index) => (
            <StepCard key={step.title} index={index} title={step.title} description={step.description} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
            <Wallet className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Wallet Usage</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {walletSteps.map((step, index) => (
            <StepCard key={step.title} index={index} title={step.title} description={step.description} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-teal-50 to-blue-50 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Quick tip for better results</h2>
            <p className="mt-2 text-sm text-slate-600">
              Keep wallet details up to date and check Smart Exchange before vouchers get close to expiry.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-teal-600" />
            Consistent tracking improves savings
          </div>
        </div>
      </section>
    </div>
  );
}