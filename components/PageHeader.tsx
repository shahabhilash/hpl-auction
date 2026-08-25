export function PageHeader({ title }: { title: string }) {
  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between md:pl-6 pl-16 sticky top-0 z-20">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
    </header>
  );
}
