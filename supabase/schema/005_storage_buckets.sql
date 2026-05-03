-- ============================================================================
-- STEP 3 (continued) — Supabase Storage Buckets
-- Rentify P2P Rental Marketplace
-- Reference: PRD 2.1 (File Storage), PRD 7.2 (Security)
-- ============================================================================
-- NOTE: Storage bucket creation in Supabase is done via the storage API.
-- The SQL below uses Supabase's storage schema to create buckets and policies.
-- If this doesn't work in the SQL Editor, create buckets manually via
-- Supabase Dashboard → Storage → New Bucket.
-- ============================================================================

-- ============================================================================
-- 1. product-images bucket
-- Public read access — product listing photos visible to all browsers
-- PRD 3.6.1: 3 minimum, 10 maximum images per listing
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,                                     -- Public read access
  5242880,                                  -- 5MB per file (PRD 7.1)
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Anyone can view product images (public bucket)
CREATE POLICY "Public read access for product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Authenticated users can upload product images
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
  );

-- Users can update their own uploaded images
CREATE POLICY "Users can update own product images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own uploaded images
CREATE POLICY "Users can delete own product images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- 2. condition-photos bucket
-- PRIVATE — accessed only via signed URLs
-- PRD 7.2: "Condition photos are stored in private Supabase Storage buckets;
--           accessed via signed URLs only."
-- PRD 3.7: Mandatory evidence at pickup and return
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'condition-photos',
  'condition-photos',
  false,                                    -- Private — signed URLs only
  5242880,                                  -- 5MB per file (PRD 7.1)
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Authenticated users can upload condition photos
-- Path convention: bookings/{bookingId}/{pickup|return}/{filename}
CREATE POLICY "Authenticated users can upload condition photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'condition-photos'
    AND auth.role() = 'authenticated'
  );

-- Booking parties + admins can view condition photos via signed URLs
-- (Signed URL generation happens server-side; this policy allows the read)
CREATE POLICY "Booking parties can view condition photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'condition-photos'
    AND auth.role() = 'authenticated'
  );

-- Only admins can delete condition photos
CREATE POLICY "Admins can delete condition photos storage"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'condition-photos'
    AND EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- ============================================================================
-- Verification
-- ============================================================================

-- Check buckets exist:
-- SELECT id, name, public FROM storage.buckets;

-- Check storage policies:
-- SELECT policyname, cmd FROM pg_policies
-- WHERE tablename = 'objects' AND schemaname = 'storage';
