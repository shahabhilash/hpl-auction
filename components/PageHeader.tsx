export function PageHeader({ title }: { title: string }) {
  return (
    <header className="bg-card/90 backdrop-blur-md border-b border-border px-6 py-5 flex items-center justify-between md:pl-6 pl-16 sticky top-0 z-20 relative">
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-transparent w-full md:w-1/2"></div>
      <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-foreground">{title}</h1>
    </header>
  );
}
