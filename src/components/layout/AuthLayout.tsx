interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Enterprise AI Validator
          </h1>

          <p className="mt-2 text-muted-foreground">
            {subtitle}
          </p>

          <h2 className="mt-6 text-2xl font-semibold">
            {title}
          </h2>
        </div>

        {children}
      </div>
    </div>
  );
}