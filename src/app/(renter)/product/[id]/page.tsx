export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // T2 STEP-3: Build product detail page here
  return <h1 className="text-2xl font-bold text-primary">Product Detail</h1>;
}
