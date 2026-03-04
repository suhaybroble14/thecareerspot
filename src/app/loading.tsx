export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-forest/10 border-t-forest rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif text-lg text-forest/40">Loading...</p>
      </div>
    </div>
  );
}
