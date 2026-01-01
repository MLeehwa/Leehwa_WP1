// 위치 마이그레이션 스크립트
// 하드코딩된 위치 정보를 데이터베이스에 삽입

// supabase는 함수 내부에서 확인

// 기존 하드코딩된 위치 레이아웃 데이터
const hardcodedLocations = [
  // A열 (왼쪽 세로)
  { code: 'A-01', x: 2, y: 1, width: 60, height: 20 },
  { code: 'A-02', x: 2, y: 25, width: 60, height: 20 },
  { code: 'A-03', x: 2, y: 49, width: 60, height: 20 },
  { code: 'A-04', x: 2, y: 73, width: 60, height: 20 },
  { code: 'A-05', x: 2, y: 97, width: 60, height: 20 },
  { code: 'A-06', x: 2, y: 121, width: 60, height: 20 },
  { code: 'A-07', x: 2, y: 145, width: 60, height: 20 },
  { code: 'A-08', x: 2, y: 169, width: 60, height: 20 },
  { code: 'A-09', x: 2, y: 193, width: 60, height: 20 },
  { code: 'A-10', x: 2, y: 217, width: 60, height: 20 },
  { code: 'A-11', x: 2, y: 241, width: 60, height: 20 },
  { code: 'A-12', x: 2, y: 265, width: 60, height: 20 },
  { code: 'A-13', x: 2, y: 289, width: 60, height: 20 },
  { code: 'A-14', x: 2, y: 313, width: 60, height: 20 },
  { code: 'A-15', x: 2, y: 337, width: 60, height: 8 },
  { code: 'A-151', x: 2, y: 347, width: 60, height: 8 },
  { code: 'A-16', x: 2, y: 361, width: 60, height: 20 },
  { code: 'A-17', x: 2, y: 385, width: 60, height: 20 },
  { code: 'A-18', x: 2, y: 409, width: 60, height: 20 },
  { code: 'A-19', x: 2, y: 433, width: 60, height: 20 },
  { code: 'A-20', x: 2, y: 457, width: 60, height: 20 },
  { code: 'A-21', x: 2, y: 481, width: 60, height: 20 },
  { code: 'A-22', x: 2, y: 505, width: 60, height: 20 },
  { code: 'A-23', x: 2, y: 529, width: 60, height: 20 },
  { code: 'A-24', x: 2, y: 553, width: 60, height: 20 },
  { code: 'A-25', x: 2, y: 577, width: 60, height: 20 },
  // B열 (A열 오른쪽)
  { code: 'B-01', x: 115, y: 1, width: 60, height: 20 },
  { code: 'B-02', x: 115, y: 25, width: 60, height: 20 },
  { code: 'B-03', x: 115, y: 49, width: 60, height: 20 },
  { code: 'B-04', x: 115, y: 73, width: 60, height: 20 },
  { code: 'B-05', x: 115, y: 97, width: 60, height: 20 },
  { code: 'B-06', x: 115, y: 121, width: 60, height: 20 },
  { code: 'B-07', x: 115, y: 145, width: 60, height: 20 },
  { code: 'B-08', x: 115, y: 169, width: 60, height: 20 },
  { code: 'B-11', x: 115, y: 241, width: 60, height: 20 },
  { code: 'B-12', x: 115, y: 265, width: 60, height: 8 },
  { code: 'B-121', x: 115, y: 275, width: 60, height: 8 },
  { code: 'B-13', x: 115, y: 289, width: 60, height: 20 },
  { code: 'B-14', x: 115, y: 313, width: 60, height: 20 },
  { code: 'B-15', x: 115, y: 337, width: 60, height: 8 },
  { code: 'B-151', x: 115, y: 347, width: 60, height: 8 },
  { code: 'B-16', x: 115, y: 361, width: 60, height: 20 },
  { code: 'B-17', x: 115, y: 385, width: 60, height: 20 },
  { code: 'B-18', x: 115, y: 409, width: 60, height: 20 },
  { code: 'B-19', x: 115, y: 433, width: 60, height: 20 },
  { code: 'B-20', x: 115, y: 457, width: 60, height: 20 },
  { code: 'B-21', x: 115, y: 481, width: 60, height: 20 },
  { code: 'B-22', x: 115, y: 505, width: 60, height: 20 },
  { code: 'B-23', x: 115, y: 529, width: 60, height: 20 },
  { code: 'B-24', x: 115, y: 553, width: 60, height: 20 },
  // C열 (중앙 왼쪽)
  { code: 'C-01', x: 230, y: 217, width: 60, height: 20 },
  { code: 'C-02', x: 230, y: 241, width: 60, height: 20 },
  { code: 'C-03', x: 230, y: 265, width: 60, height: 20 },
  { code: 'C-04', x: 230, y: 289, width: 60, height: 20 },
  { code: 'C-05', x: 230, y: 313, width: 60, height: 20 },
  { code: 'C-06', x: 230, y: 337, width: 60, height: 20 },
  { code: 'C-07', x: 230, y: 361, width: 60, height: 20 },
  { code: 'C-08', x: 230, y: 385, width: 60, height: 20 },
  { code: 'C-09', x: 230, y: 409, width: 60, height: 20 },
  { code: 'C-10', x: 230, y: 433, width: 60, height: 20 },
  { code: 'C-11', x: 230, y: 457, width: 60, height: 20 },
  { code: 'C-12', x: 230, y: 481, width: 60, height: 20 },
  { code: 'C-13', x: 230, y: 505, width: 60, height: 20 },
  { code: 'C-14', x: 230, y: 529, width: 60, height: 20 },
  { code: 'C-15', x: 230, y: 553, width: 60, height: 20 },
  // D열 (중앙)
  { code: 'D-00', x: 292, y: 195, width: 60, height: 20 },
  { code: 'D-01', x: 292, y: 217, width: 60, height: 20 },
  { code: 'D-02', x: 292, y: 241, width: 60, height: 20 },
  { code: 'D-03', x: 292, y: 265, width: 60, height: 20 },
  { code: 'D-04', x: 292, y: 289, width: 60, height: 20 },
  { code: 'D-05', x: 292, y: 313, width: 60, height: 20 },
  { code: 'D-06', x: 292, y: 337, width: 60, height: 20 },
  { code: 'D-07', x: 292, y: 361, width: 60, height: 20 },
  { code: 'D-08', x: 292, y: 385, width: 60, height: 20 },
  { code: 'D-09', x: 292, y: 409, width: 60, height: 20 },
  { code: 'D-10', x: 292, y: 433, width: 60, height: 20 },
  { code: 'D-11', x: 292, y: 457, width: 60, height: 20 },
  { code: 'D-12', x: 292, y: 481, width: 60, height: 20 },
  { code: 'D-13', x: 292, y: 505, width: 60, height: 20 },
  { code: 'D-14', x: 292, y: 529, width: 60, height: 20 },
  { code: 'D-15', x: 292, y: 553, width: 60, height: 20 },
  // E열 (중앙 오른쪽)
  { code: 'E-00', x: 450, y: 195, width: 60, height: 20 },
  { code: 'E-01', x: 450, y: 217, width: 60, height: 20 },
  { code: 'E-02', x: 450, y: 241, width: 60, height: 20 },
  { code: 'E-03', x: 450, y: 265, width: 60, height: 20 },
  { code: 'E-04', x: 450, y: 289, width: 60, height: 20 },
  { code: 'E-05', x: 450, y: 313, width: 60, height: 20 },
  { code: 'E-06', x: 450, y: 337, width: 60, height: 20 },
  { code: 'E-07', x: 450, y: 361, width: 60, height: 20 },
  { code: 'E-08', x: 450, y: 385, width: 60, height: 20 },
  { code: 'E-09', x: 450, y: 409, width: 60, height: 20 },
  { code: 'E-10', x: 450, y: 433, width: 60, height: 20 },
  { code: 'E-11', x: 450, y: 457, width: 60, height: 20 },
  { code: 'E-12', x: 450, y: 481, width: 60, height: 20 },
  // F열 (중앙 맨 오른쪽)
  { code: 'F-00', x: 512, y: 195, width: 60, height: 20 },
  { code: 'F-01', x: 512, y: 217, width: 60, height: 20 },
  { code: 'F-02', x: 512, y: 241, width: 60, height: 20 },
  { code: 'F-03', x: 512, y: 265, width: 60, height: 20 },
  { code: 'F-04', x: 512, y: 289, width: 60, height: 20 },
  { code: 'F-05', x: 512, y: 313, width: 60, height: 20 },
  { code: 'F-06', x: 512, y: 337, width: 60, height: 20 },
  { code: 'F-07', x: 512, y: 361, width: 60, height: 20 },
  { code: 'F-08', x: 512, y: 385, width: 60, height: 20 },
  { code: 'F-09', x: 512, y: 409, width: 60, height: 20 },
  { code: 'F-10', x: 512, y: 433, width: 60, height: 20 },
  { code: 'F-11', x: 512, y: 457, width: 60, height: 20 },
  { code: 'F-12', x: 512, y: 481, width: 60, height: 20 },
  // G열 (노란 영역 아래)
  { code: 'G-03', x: 450, y: 505, width: 120, height: 20 },
  { code: 'G-04', x: 450, y: 529, width: 120, height: 20 },
  { code: 'G-05', x: 450, y: 553, width: 120, height: 20 },
  // H열 (노란 영역 아래)
  { code: 'H-01', x: 600, y: 241, width: 60, height: 20 },
  { code: 'H-02', x: 600, y: 265, width: 60, height: 20 },
  { code: 'H-03', x: 600, y: 289, width: 60, height: 20 },
  { code: 'H-04', x: 600, y: 313, width: 60, height: 20 },
  { code: 'H-05', x: 600, y: 337, width: 60, height: 20 },
  { code: 'H-06', x: 600, y: 361, width: 60, height: 20 },
  { code: 'H-07', x: 600, y: 385, width: 60, height: 20 },
  { code: 'H-08', x: 600, y: 409, width: 60, height: 20 },
  { code: 'H-10', x: 600, y: 433, width: 60, height: 20 },
  { code: 'H-11', x: 600, y: 457, width: 60, height: 20 },
];

// 위치 데이터 마이그레이션 함수
async function migrateLocations() {
  // supabase 확인
  if (!window.supabase) {
    throw new Error('Supabase가 아직 로드되지 않았습니다. 페이지를 새로고침하세요.');
  }
  const supabase = window.supabase;
  
  console.log('위치 데이터 마이그레이션 시작...');
  console.log(`총 ${hardcodedLocations.length}개 위치를 삽입합니다.`);
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  const errors = [];
  
  // 기존 위치 목록 조회
  const { data: existingLocations, error: fetchError } = await supabase
    .from('wp1_locations')
    .select('location_code');
  
  if (fetchError) {
    console.error('기존 위치 조회 실패:', fetchError);
    alert('기존 위치 조회 실패: ' + fetchError.message);
    return;
  }
  
  const existingCodes = new Set((existingLocations || []).map(loc => loc.location_code));
  
  // 각 위치를 데이터베이스에 삽입
  for (const loc of hardcodedLocations) {
    try {
      // 이미 존재하는 위치는 건너뛰기
      if (existingCodes.has(loc.code)) {
        console.log(`위치 ${loc.code}는 이미 존재합니다. 건너뜁니다.`);
        skipCount++;
        continue;
      }
      
      const locationData = {
        location_code: loc.code,
        status: 'available',
        x: loc.x,
        y: loc.y,
        width: loc.width,
        height: loc.height,
        remark: null
      };
      
      const { error } = await supabase
        .from('wp1_locations')
        .insert(locationData);
      
      if (error) {
        console.error(`위치 ${loc.code} 삽입 실패:`, error);
        errors.push({ code: loc.code, error: error.message });
        errorCount++;
      } else {
        console.log(`위치 ${loc.code} 삽입 성공`);
        successCount++;
      }
    } catch (error) {
      console.error(`위치 ${loc.code} 처리 중 오류:`, error);
      errors.push({ code: loc.code, error: error.message });
      errorCount++;
    }
  }
  
  // 결과 출력
  const result = `
마이그레이션 완료!

성공: ${successCount}개
건너뜀: ${skipCount}개 (이미 존재)
실패: ${errorCount}개

${errors.length > 0 ? '\n실패한 위치:\n' + errors.map(e => `- ${e.code}: ${e.error}`).join('\n') : ''}
  `;
  
  console.log(result);
  alert(result);
  
  return {
    success: successCount,
    skip: skipCount,
    error: errorCount,
    errors
  };
}

// 전역 함수로 등록 (브라우저 콘솔에서 호출 가능)
window.migrateLocations = migrateLocations;
window.hardcodedLocations = hardcodedLocations;

console.log('위치 마이그레이션 스크립트 로드 완료');
console.log(`총 ${hardcodedLocations.length}개의 위치가 준비되어 있습니다.`);
console.log('브라우저 콘솔에서 migrateLocations() 함수를 호출하여 마이그레이션을 실행하세요.');
