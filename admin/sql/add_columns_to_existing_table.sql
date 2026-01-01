-- 기존 wp1_locations 테이블에 컬럼 추가 스크립트
-- 테이블이 이미 존재하지만 컬럼이 없는 경우 사용

-- x, y, width, height 컬럼 추가
ALTER TABLE wp1_locations ADD COLUMN IF NOT EXISTS x INTEGER;
ALTER TABLE wp1_locations ADD COLUMN IF NOT EXISTS y INTEGER;
ALTER TABLE wp1_locations ADD COLUMN IF NOT EXISTS width INTEGER;
ALTER TABLE wp1_locations ADD COLUMN IF NOT EXISTS height INTEGER;

-- remark 컬럼 추가 (없는 경우)
ALTER TABLE wp1_locations ADD COLUMN IF NOT EXISTS remark TEXT;

-- created_at, updated_at 컬럼 추가 (없는 경우)
ALTER TABLE wp1_locations ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE wp1_locations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- status 컬럼에 CHECK 제약조건 추가 (없는 경우)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'wp1_locations_status_check'
    ) THEN
        ALTER TABLE wp1_locations ADD CONSTRAINT wp1_locations_status_check 
        CHECK (status IN ('available', 'occupied', 'maintenance', 'disabled'));
    END IF;
END $$;

-- location_code에 UNIQUE 제약조건 추가 (없는 경우)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'wp1_locations_location_code_key'
    ) THEN
        ALTER TABLE wp1_locations ADD CONSTRAINT wp1_locations_location_code_key 
        UNIQUE (location_code);
    END IF;
END $$;

-- 인덱스 생성 (없는 경우)
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
