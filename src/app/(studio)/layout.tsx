export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
