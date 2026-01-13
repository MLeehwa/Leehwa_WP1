-- wp1_background_elements 테이블 생성
-- 시각적 편집기의 배경 요소를 저장하는 테이블
-- Supabase SQL Editor에서 실행하세요

CREATE TABLE IF NOT EXISTS wp1_background_elements (
  id INTEGER PRIMARY KEY DEFAULT 1,
  elements_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_wp1_background_elements_updated ON wp1_background_elements(updated_at);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_background_elements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wp1_background_elements_updated_at
  BEFORE UPDATE ON wp1_background_elements
  FOR EACH ROW
  EXECUTE FUNCTION update_background_elements_updated_at();

-- 초기 데이터 삽입 (하나의 행만 유지)
INSERT INTO wp1_background_elements (id, elements_data)
VALUES (1, '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;
