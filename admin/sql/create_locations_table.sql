-- wp1_locations 테이블 생성 스크립트
-- Supabase SQL Editor에서 실행하세요

-- 기존 테이블이 있으면 삭제 (주의: 데이터가 모두 삭제됩니다)
-- DROP TABLE IF EXISTS wp1_locations CASCADE;

-- wp1_locations 테이블 생성
CREATE TABLE IF NOT EXISTS wp1_locations (
  id BIGSERIAL PRIMARY KEY,
  location_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'disabled')),
  x INTEGER,
  y INTEGER,
  width INTEGER,
  height INTEGER,
  remark TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_wp1_locations_code ON wp1_locations(location_code);
CREATE INDEX IF NOT EXISTS idx_wp1_locations_status ON wp1_locations(status);

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
DROP TRIGGER IF EXISTS update_wp1_locations_updated_at ON wp1_locations;
CREATE TRIGGER update_wp1_locations_updated_at
    BEFORE UPDATE ON wp1_locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 기존 테이블에 컬럼 추가 (테이블이 이미 있는 경우)
-- ALTER TABLE wp1_locations ADD COLUMN IF NOT EXISTS x INTEGER;
-- ALTER TABLE wp1_locations ADD COLUMN IF NOT EXISTS y INTEGER;
-- ALTER TABLE wp1_locations ADD COLUMN IF NOT EXISTS width INTEGER;
-- ALTER TABLE wp1_locations ADD COLUMN IF NOT EXISTS height INTEGER;
-- ALTER TABLE wp1_locations ADD COLUMN IF NOT EXISTS remark TEXT;
-- ALTER TABLE wp1_locations ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
-- ALTER TABLE wp1_locations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- RLS (Row Level Security) 정책 설정 (필요한 경우)
-- ALTER TABLE wp1_locations ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 설정 (필요에 따라 수정)
-- CREATE POLICY "Allow public read access" ON wp1_locations FOR SELECT USING (true);

-- 인증된 사용자만 쓰기 가능하도록 설정 (필요에 따라 수정)
-- CREATE POLICY "Allow authenticated insert" ON wp1_locations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated update" ON wp1_locations FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated delete" ON wp1_locations FOR DELETE USING (auth.role() = 'authenticated');
