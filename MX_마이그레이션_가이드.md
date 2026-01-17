# MX 시스템 마이그레이션 가이드

## 1단계: 폴더 복사 및 파일 수정

### 방법 1: PowerShell 스크립트 사용 (권장)

```powershell
cd c:\Users\LHA-M\WP1
.\MX_마이그레이션.ps1
```

스크립트가 자동으로:
- WP1 폴더를 MX 폴더로 복사
- 모든 JavaScript 파일에서 테이블명을 `mx_` 접두사로 변경
- 모든 SQL 파일에서 테이블명을 `mx_` 접두사로 변경
- 참조 관계 수정

### 방법 2: 수동 복사

1. `c:\Users\LHA-M\WP1` 폴더를 `c:\Users\LHA-M\MX`로 복사
2. 모든 `.js` 파일에서 `wp1_` → `mx_` 변경
3. 모든 `.sql` 파일에서 `wp1_` → `mx_` 변경

## 2단계: Supabase 테이블 생성

1. Supabase SQL Editor 열기
2. `admin/sql/mx_create_all_tables_complete.sql` 파일 내용을 복사하여 실행
3. 모든 테이블이 정상적으로 생성되었는지 확인

### 생성되는 테이블 목록:
- `mx_locations` - 위치 정보
- `mx_background_elements` - 배경 요소 (시각적 편집기)
- `mx_delivery_locations` - 배송지 정보
- `mx_receiving_plan` - 입고 계획
- `mx_receiving_items` - 입고 항목 (part_no, quantity 없음)
- `mx_receiving_log` - 입고 로그
- `mx_shipping_instruction` - 출하 지시서 (part_no, qty 없음, delivery_location_id 포함)
- `mx_shipping_instruction_items` - 출하 지시서 항목 (label_id, qty 없음)
- `mx_flagged_containers` - 문제 컨테이너 (highlight_color 포함)

## 3단계: JavaScript 파일 수정 (Container 단위)

MX 시스템은 Container 단위로만 관리하므로 다음 로직을 제거/수정해야 합니다:

### 제거해야 할 필드:
- `part_no` - 모든 테이블에서 제거
- `quantity` - 모든 테이블에서 제거

### 수정해야 할 파일:
1. `admin/js/receiving.js`
   - 입고 계획 생성 시 `part_no`, `quantity` 입력 제거
   - 입고 항목 저장 시 `part_no`, `quantity` 제거

2. `admin/js/shipping.js`
   - 출하 지시서 생성 시 `part_no`, `quantity` 제거
   - Container 번호만 사용

3. `admin/js/report.js`
   - 리포트에서 `part_no`, `quantity` 표시 제거
   - Container 번호만 표시

4. `admin/js/location_view.js`
   - 위치 보기에서 `part_no`, `quantity` 표시 제거

### 변경 예시:

**변경 전:**
```javascript
{
  container_no: 'TRHU1234567',
  part_no: 'ABC123',
  quantity: 100,
  location_code: 'A-01'
}
```

**변경 후:**
```javascript
{
  container_no: 'TRHU1234567',
  location_code: 'A-01'
}
```

## 4단계: HTML 파일 수정

입고/출하 관련 HTML 파일에서 `part_no`, `quantity` 입력 필드 제거

## 5단계: 테스트

1. MX 폴더에서 시스템 실행
2. 입고 계획 생성 테스트
3. 출하 지시서 생성 테스트
4. 위치 보기 테스트
5. 리포트 생성 테스트

## 주의사항

- MX 시스템은 **Container 단위**로만 관리됩니다
- `part_no`, `quantity` 필드는 완전히 제거되었습니다
- 출하 지시서는 Container 번호만 사용합니다
- 배경 요소는 `mx_background_elements` 테이블에 저장됩니다

## 문제 해결

### 테이블이 생성되지 않는 경우
- Supabase SQL Editor에서 에러 메시지 확인
- 기존 테이블이 있는지 확인 (DROP TABLE 필요할 수 있음)

### JavaScript 에러 발생 시
- 브라우저 콘솔에서 에러 확인
- 테이블명이 `mx_` 접두사로 변경되었는지 확인
- `part_no`, `quantity` 참조가 남아있는지 확인
