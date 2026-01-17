// import { CONFIG } from '../config/config.js';
// import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabase = window.supabase;

console.log('Location View JS loaded.'); 

// i18n 객체
const i18n = {
  ko: {
    // 정적 텍스트
    title_location_view: '위치 보기',
    title_location_info: '위치 정보',
    label_product_name: '제품명',
    label_trailer_container: '트레일러/컨테이너 번호',
    label_receiving_date: '입고 날짜',
    btn_search: '검색',
    btn_reset: '초기화',
    text_loading_dock: '로딩 도크',
    text_select_location: '좌측에서 위치를 선택하세요.',
    
    // 동적 메시지
    msg_loading_data: '데이터를 불러오는 중...',
    msg_load_error: '데이터 로드 실패: {error}',
    msg_no_items: '해당 위치에 보관된 제품이 없습니다.',
    msg_location_info: '위치: {code}\n제품: {part_no}\n수량: {qty}',
    msg_receiving_date: '입고일: {date}',
    msg_container_no: '컨테이너 번호: {no}',
    msg_status_received: '입고 완료',
    msg_status_waiting: '입고 대기',
    msg_print_error: '출력 중 오류 발생: {error}',
    msg_print_success: '출하증이 성공적으로 출력되었습니다.',
    msg_no_shipping_order: '출하 지시가 없습니다.',
    msg_shipping_order: '출하 지시: {no}',
    msg_shipping_date: '출하일: {date}',
    msg_shipping_status: '상태: {status}',
    msg_shipping_items: '출하 품목:',
    msg_shipping_item: '- {part_no}: {qty}개',
    msg_print_shipping: '출하증 출력',
    msg_cancel_shipping: '출하 취소',
    msg_confirm_cancel: '출하를 취소하시겠습니까?',
    msg_cancel_success: '출하가 취소되었습니다.',
    msg_cancel_error: '출하 취소 중 오류 발생: {error}',
  },
  en: {
    // Static text
    title_location_view: 'Location View',
    title_location_info: 'Location Info',
    label_product_name: 'Product Name',
    label_trailer_container: 'Trailer/Container No.',
    label_receiving_date: 'Receiving Date',
    btn_search: 'Search',
    btn_reset: 'Reset',
    text_loading_dock: 'LOADING DOCK',
    text_select_location: 'Select a location from the left.',
    
    // Dynamic messages
    msg_loading_data: 'Loading data...',
    msg_load_error: 'Failed to load data: {error}',
    msg_no_items: 'No items stored in this location.',
    msg_location_info: 'Location: {code}\nProduct: {part_no}\nQuantity: {qty}',
    msg_receiving_date: 'Receiving Date: {date}',
    msg_container_no: 'Container No.: {no}',
    msg_status_received: 'Received',
    msg_status_waiting: 'Waiting',
    msg_print_error: 'Error printing: {error}',
    msg_print_success: 'Shipping instruction printed successfully.',
    msg_no_shipping_order: 'No shipping instruction.',
    msg_shipping_order: 'Shipping Instruction: {no}',
    msg_shipping_date: 'Shipping Date: {date}',
    msg_shipping_status: 'Status: {status}',
    msg_shipping_items: 'Shipping Items:',
    msg_shipping_item: '- {part_no}: {qty} pcs',
    msg_print_shipping: 'Print Shipping',
    msg_cancel_shipping: 'Cancel Shipping',
    msg_confirm_cancel: 'Are you sure you want to cancel this shipping?',
    msg_cancel_success: 'Shipping has been cancelled.',
    msg_cancel_error: 'Error cancelling shipping: {error}',
  }
};

// 현재 언어 설정
let currentLang = localStorage.getItem('admin_location_lang') || 'ko';

// Delivery Location 드롭다운 로드 함수
async function loadDeliveryLocations() {
  const select = document.getElementById('deliveryLocationSelect');
  if (!select) return;
  
  try {
    const { data, error } = await supabase
      .from('wp1_delivery_locations')
      .select('id, location_name')
      .eq('is_active', true)
      .order('location_name', { ascending: true });
    
    if (error) throw error;
    
    // 기존 옵션 유지 (선택... 옵션)
    const firstOption = select.querySelector('option[value=""]');
    select.innerHTML = '';
    if (firstOption) {
      select.appendChild(firstOption);
    } else {
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = '선택...';
      select.appendChild(defaultOption);
    }
    
    // Delivery Location 옵션 추가
    if (data && data.length > 0) {
      data.forEach(loc => {
        const option = document.createElement('option');
        option.value = loc.id;
        option.textContent = loc.location_name;
        select.appendChild(option);
      });
    } else {
      const noOption = document.createElement('option');
      noOption.value = '';
      noOption.textContent = '등록된 Delivery Location이 없습니다';
      noOption.disabled = true;
      select.appendChild(noOption);
    }
  } catch (error) {
    console.error('Delivery Location 로드 실패:', error);
    const errorOption = document.createElement('option');
    errorOption.value = '';
    errorOption.textContent = '로드 실패';
    errorOption.disabled = true;
    select.innerHTML = '';
    select.appendChild(errorOption);
  }
}

// 언어 설정 함수
function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('bg-blue-600', 'text-white', 'bg-gray-300', 'text-gray-800'));
  document.querySelector('.lang-btn[data-lang="' + lang + '"]').classList.add('bg-blue-600', 'text-white');
  document.querySelectorAll('.lang-btn:not([data-lang="' + lang + '"])').forEach(btn => btn.classList.add('bg-gray-300', 'text-gray-800'));
  
  // 정적 텍스트 업데이트
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang][key]) el.textContent = i18n[lang][key];
  });
  
  // placeholder 업데이트
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (i18n[lang][key]) el.placeholder = i18n[lang][key];
  });
  
  document.documentElement.lang = lang;
  localStorage.setItem('admin_location_lang', lang);
}

// 메시지 포맷팅 함수
function formatMessage(key, params = {}) {
  let message = i18n[currentLang][key] || key;
  Object.entries(params).forEach(([key, value]) => {
    message = message.replace(`{${key}}`, value);
  });
  return message;
}

// 위치 레이아웃을 데이터베이스에서 동적으로 로드
let layout = [];

// 데이터베이스에서 위치 레이아웃 로드
async function loadLocationLayout() {
  try {
    const { data, error } = await supabase
      .from('wp1_locations')
      .select('location_code, x, y, width, height, status')
      .order('location_code');
    
    if (error) {
      console.error('위치 레이아웃 로드 실패:', error);
      // 에러 발생 시 빈 배열 반환
      layout = [];
      return;
    }
    
    // 좌표 정보가 있는 위치만 레이아웃에 포함 (모든 상태 포함, disabled/maintenance도 표시)
    // 위치 코드를 정규화하여 저장 (A1 -> A-01)
    layout = (data || [])
      .filter(loc => loc.x !== null && loc.y !== null && loc.width !== null && loc.height !== null)
      .map(loc => ({
        code: normalizeLocationCode(loc.location_code), // 위치 코드 정규화
        x: loc.x,
        y: loc.y,
        width: loc.width,
        height: loc.height,
        status: loc.status // 상태 정보도 저장
      }));
    
    console.log(`위치 레이아웃 로드 완료: ${layout.length}개 위치`);
  } catch (error) {
    console.error('위치 레이아웃 로드 중 오류:', error);
    layout = [];
  }
}

// 전역 상태 관리
let isLocationViewActive = false;
let currentSVG = null;
let currentOccupied = {};

// SVG 초기화 함수
async function initializeSVG() {
  const svg = document.getElementById('locationSVG');
  if (!svg) return null;

  // 기존 SVG 내용 제거
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }

  // 배경 요소 로드 및 렌더링 (Supabase에서만)
  let backgroundElements = [];
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('wp1_background_elements')
        .select('elements_data')
        .eq('id', 1)
        .single();
      
      console.log('위치 보기: Supabase 응답:', { data, error });
      
      // Supabase에서 데이터를 성공적으로 가져왔고, 배열이 존재하며 비어있지 않은 경우
      if (!error && data && data.elements_data && Array.isArray(data.elements_data) && data.elements_data.length > 0) {
        backgroundElements = data.elements_data;
        console.log('위치 보기: Supabase에서 배경 요소 로드 완료:', backgroundElements.length, '개');
        // 각 요소의 좌표 확인
        backgroundElements.forEach((bg, index) => {
          console.log(`위치 보기: 배경 요소 ${index + 1}:`, {
            id: bg.id,
            type: bg.type,
            x: bg.x,
            y: bg.y,
            width: bg.width,
            height: bg.height
          });
        });
      } else {
        // Supabase에 데이터가 없거나 빈 배열이면 배경 없음
        backgroundElements = [];
        if (error) {
          console.log('위치 보기: Supabase 에러:', error);
        } else if (!data || !data.elements_data) {
          console.log('위치 보기: Supabase에 데이터 없음');
        } else if (data.elements_data.length === 0) {
          console.log('위치 보기: 배경 요소 배열이 비어있음');
        }
      }
    } else {
      console.warn('위치 보기: Supabase가 초기화되지 않음');
      backgroundElements = [];
    }
  } catch (error) {
    console.error('위치 보기: 배경 요소 로드 실패:', error);
    backgroundElements = [];
  }
  
  // 배경 요소 렌더링
  console.log('위치 보기: 배경 요소 렌더링 시작, 개수:', backgroundElements.length);
  backgroundElements.forEach((bg, index) => {
    console.log(`위치 보기: 배경 요소 ${index + 1} 렌더링:`, {
      type: bg.type,
      x: bg.x,
      y: bg.y,
      width: bg.width,
      height: bg.height,
      fill: bg.fill,
      stroke: bg.stroke,
      strokeWidth: bg.strokeWidth
    });
    
    if (bg.type === 'rect') {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      // 좌표를 숫자로 변환 (문자열일 수 있음)
      const x = Number(bg.x) || 0;
      const y = Number(bg.y) || 0;
      const width = Number(bg.width) || 100;
      const height = Number(bg.height) || 50;
      const fill = bg.fill || '#d3d3d3';
      const stroke = bg.stroke || '#000';
      const strokeWidth = Number(bg.strokeWidth) || 1;
      
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', width);
      rect.setAttribute('height', height);
      rect.setAttribute('fill', fill);
      rect.setAttribute('stroke', stroke);
      rect.setAttribute('stroke-width', strokeWidth);
      svg.appendChild(rect);
      console.log(`위치 보기: rect 요소 추가됨 - x:${x}, y:${y}, width:${width}, height:${height}, fill:${fill}, stroke:${stroke}, strokeWidth:${strokeWidth}`);
    } else if (bg.type === 'text') {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      // 좌표를 숫자로 변환 (문자열일 수 있음)
      const x = Number(bg.x) || 0;
      const y = Number(bg.y) || 0;
      const fontSize = Number(bg.fontSize) || 15;
      const fill = bg.fill || '#000';
      
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      text.setAttribute('font-size', fontSize);
      text.setAttribute('fill', fill);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('alignment-baseline', 'middle');
      text.textContent = bg.text || bg.label || '';
      svg.appendChild(text);
      console.log(`위치 보기: text 요소 추가됨 - x:${x}, y:${y}, fontSize:${fontSize}, fill:${fill}`);
    }
  });
  console.log('위치 보기: 배경 요소 렌더링 완료');
  currentSVG = svg;
  return svg;
}

// Location 데이터 로드
async function loadOccupied() {
  try {
    const { data: items, error: itemsError } = await supabase
      .from('receiving_items')
      .select('part_no,quantity,location_code,plan_id,label_id,container_no,receiving_plan:plan_id(container_no,receive_date)');
    
    if (itemsError) throw itemsError;

    // 입고 로그 조회
    const { data: logs } = await supabase.from('receiving_log').select('label_id');
    const receivedSet = new Set((logs || []).map(l => l.label_id));

    // 출고완료(shipped) 출하증의 container_no 목록 조회
    const { data: shippedList } = await supabase
      .from('shipping_instruction')
      .select('container_no, status')
      .eq('status', 'shipped');
    const shippedContainerSet = new Set((shippedList || []).map(s => s.container_no));

    // 출고완료된 label_id 전체 조회 (shipping_instruction_items의 shipped_at이 null이 아닌 것만)
    let shippedLabelSet = new Set();
    const { data: shippedItems } = await supabase
      .from('shipping_instruction_items')
      .select('label_id, shipped_at');
    if (shippedItems) {
      shippedLabelSet = new Set(
        shippedItems.filter(i => i.shipped_at).map(i => String(i.label_id))
      );
    }

    // 데이터 초기화
    currentOccupied = {};
    
    // 데이터 매핑 - 같은 위치의 여러 파트를 처리
    const locationGroups = {};
    
    for (const item of items) {
      if (!item.location_code) continue;
      if (shippedContainerSet.has(item.container_no)) {
        continue;
      }
      if (shippedLabelSet.has(String(item.label_id))) {
        continue;
      }
      
      // 위치 코드 정규화 (normalizeLocationCode 함수 사용)
      const code = normalizeLocationCode(item.location_code);
      
      // 같은 위치의 항목들을 그룹화
      if (!locationGroups[code]) {
        locationGroups[code] = [];
      }
      locationGroups[code].push(item);
    }
    
    // 각 위치별로 데이터 정리
    for (const [code, groupItems] of Object.entries(locationGroups)) {
      // 파트별 수량 계산
      const partQuantities = {};
      let totalQty = 0;
      let containerIds = new Set();
      let receivingDates = new Set();
      let labelIds = [];
      let receivedCount = 0;
      
      groupItems.forEach(item => {
        const partNo = item.part_no ? item.part_no.toString().trim() : '';
        const qty = parseInt(item.quantity) || 0;
        
        if (partNo && qty > 0) {
          partQuantities[partNo] = (partQuantities[partNo] || 0) + qty;
          totalQty += qty;
        }
        
        if (item.receiving_plan?.container_no) {
          containerIds.add(item.receiving_plan.container_no);
        }
        if (item.receiving_plan?.receive_date) {
          receivingDates.add(item.receiving_plan.receive_date);
        }
        if (item.label_id) {
          labelIds.push(item.label_id);
          if (receivedSet.has(item.label_id)) {
            receivedCount++;
          }
        }
      });
      
      // 가장 많은 수량을 가진 파트를 대표 파트로 선택
      let mainPartNo = '';
      let maxQty = 0;
      for (const [partNo, qty] of Object.entries(partQuantities)) {
        if (qty > maxQty) {
          maxQty = qty;
          mainPartNo = partNo;
        }
      }
      
      currentOccupied[code] = {
        part_no: mainPartNo,
        qty: totalQty,
        receiving_date: Array.from(receivingDates)[0], // 첫 번째 날짜 사용
        container_id: Array.from(containerIds)[0], // 첫 번째 컨테이너 사용
        received: receivedCount > 0,
        label_id: labelIds[0], // 첫 번째 label_id 사용
        raw_location_code: groupItems[0].location_code,
        all_parts: partQuantities, // 모든 파트 정보 저장
        total_items: groupItems.length
      };
    }

    // UI 업데이트
    renderLocations();
  } catch (error) {
    console.error('Error loading occupied data:', error);
    showMessage(
      formatMessage('modal_message_title'),
      formatMessage('msg_load_error', { error: error.message })
    );
  }
}

// Location 렌더링
function renderLocations(filter = {}) {
  const svg = document.getElementById('locationSVG');
  if (!svg) return;
  // 기존 Location 요소 제거
  document.querySelectorAll('#locationSVG g[data-type="location"]').forEach(g => g.remove());

  // 필터링된 코드 계산
  let filteredCodes = new Set();
  let oldestCode = null;
  let oldestDate = null;

  if (filter.product || filter.trailer || filter.date) {
    Object.entries(currentOccupied).forEach(([code, info]) => {
      let match = true;
      if (filter.product && !info.part_no?.toLowerCase().includes(filter.product.toLowerCase())) match = false;
      if (filter.trailer && !info.container_id?.toLowerCase().includes(filter.trailer.toLowerCase())) match = false;
      if (filter.date && !info.receiving_date?.includes(filter.date)) match = false;
      if (match) {
        filteredCodes.add(code);
        if (filter.product && (!oldestDate || info.receiving_date < oldestDate)) {
          oldestDate = info.receiving_date;
          oldestCode = code;
        }
      }
    });
  }

  // Location 렌더링
  layout.forEach(loc => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('data-type', 'location');
    g.setAttribute('data-location-code', loc.code);
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', loc.x);
    rect.setAttribute('y', loc.y);
    rect.setAttribute('width', loc.width);
    rect.setAttribute('height', loc.height);
    rect.setAttribute('rx', 5);
    // 색상 결정
    let fill = '#86efac'; // 비어있음(연녹색)
    
    // 사용 불가 또는 점검중인 경우 주황색으로 표시 (최우선)
    if (loc.status === 'disabled' || loc.status === 'maintenance') {
      fill = '#fb923c'; // 주황색
    } else if (currentOccupied[loc.code]) {
      if (currentOccupied[loc.code].received) fill = '#fca5a5'; // 입고 완료(연빨강)
      else fill = '#a5b4fc'; // 예약/미입고(연파랑)
    }
    
    // 필터 일치 시 노랑 (사용 불가/점검중이 아닌 경우에만)
    if (fill !== '#fb923c' && filteredCodes.has(loc.code)) fill = '#fde047'; // 필터 일치(노랑)
    if (fill !== '#fb923c' && filter.product && loc.code === oldestCode) fill = '#fb923c'; // 제품명+가장 오래된 입고(주황)
    rect.setAttribute('fill', fill);
    rect.setAttribute('stroke', '#333');
    rect.setAttribute('stroke-width', 1.5);
    rect.style.cursor = 'pointer';
    g.appendChild(rect);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', loc.x + loc.width/2);
    text.setAttribute('y', loc.y + loc.height/2 + 4);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '13');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', '#222');
    text.textContent = loc.code;
    g.appendChild(text);
    // 클릭 이벤트
    g.addEventListener('click', () => {
      // 빈 위치도 클릭 가능하도록 수정
      if (currentOccupied[loc.code]) {
        showLocationModal(loc.code, currentOccupied[loc.code]);
      } else {
        // 빈 위치 클릭 시 정보 표시
        showLocationModal(loc.code, null);
      }
    });
    svg.appendChild(g);
  });
}

// location_code 포맷 통일 함수 ('A1', 'A-01', 'A 01' 등 모두 'A-01'로 변환)
function normalizeLocationCode(code) {
  if (!code) return code;
  const match = code.match(/^([A-Z])[- ]?(\d{1,2})$/i);
  if (match) {
    const letter = match[1].toUpperCase();
    const num = match[2].padStart(2, '0');
    return `${letter}-${num}`;
  }
  return code.trim();
}

// 사용 가능한 위치 목록 가져오기 (빈 위치만)
async function getAvailableLocationsForView() {
  try {
    // 1. status='available'이고 disabled가 아닌 위치 목록
    const { data: locations, error: locError } = await supabase
      .from('wp1_locations')
      .select('location_code')
      .eq('status', 'available')
      .neq('status', 'disabled')
      .order('location_code');
    if (locError || !locations || locations.length === 0) return [];

    // 2. 입고 완료된 항목의 위치 조회 (receiving_log 확인)
    const { data: receivedItems, error: receivedError } = await supabase
      .from('receiving_log')
      .select('label_id');
    
    if (receivedError) {
      console.error('Error loading receiving_log:', receivedError);
      return [];
    }
    
    const receivedLabelIds = new Set((receivedItems || []).map(l => String(l.label_id)));
    
    // 3. receiving_items에서 입고 완료된 항목의 위치 조회
    const { data: allItems, error: itemsError } = await supabase
      .from('receiving_items')
      .select('location_code, label_id');
    
    if (itemsError) {
      console.error('Error loading receiving_items:', itemsError);
      return [];
    }
    
    // 4. 출고 완료된 항목 제외
    const { data: shippedItems } = await supabase
      .from('shipping_instruction_items')
      .select('label_id, shipped_at');
    
    const shippedLabelIds = new Set(
      (shippedItems || [])
        .filter(i => i.shipped_at)
        .map(i => String(i.label_id))
    );
    
    // 5. 점유된 위치 코드 집합 생성
    const occupiedCodes = new Set();
    (allItems || []).forEach(item => {
      if (!item.location_code) return;
      const labelId = String(item.label_id);
      // 입고 완료되었고 출고되지 않은 항목만 점유로 간주
      if (receivedLabelIds.has(labelId) && !shippedLabelIds.has(labelId)) {
        const normCode = normalizeLocationCode(item.location_code);
        occupiedCodes.add(normCode);
      }
    });
    
    // 6. 사용 가능한 위치 필터링
    const available = locations
      .map(loc => loc.location_code)
      .filter(locCode => {
        const normCode = normalizeLocationCode(locCode);
        return !occupiedCodes.has(normCode);
      });
    
    return available;
  } catch (error) {
    console.error('Error in getAvailableLocationsForView:', error);
    return [];
  }
}

// 빈 위치 드롭다운 로드
async function loadEmptyLocationDropdown() {
  const emptyLocationSelect = document.getElementById('emptyLocationSelect');
  if (!emptyLocationSelect) return;
  
  emptyLocationSelect.innerHTML = '<option value="">로딩 중...</option>';
  const available = await getAvailableLocationsForView();
  emptyLocationSelect.innerHTML = '<option value="">빈 위치 목록...</option>';
  
  if (available.length === 0) {
    emptyLocationSelect.innerHTML = '<option value="">사용 가능한 위치가 없습니다</option>';
    return;
  }
  
  available.forEach(loc => {
    const option = document.createElement('option');
    option.value = loc;
    option.textContent = loc;
    emptyLocationSelect.appendChild(option);
  });
  
  // 드롭다운 선택 시 해당 위치로 스크롤 및 하이라이트
  const changeHandler = async (e) => {
    if (e.target.value) {
      const selectedCode = normalizeLocationCode(e.target.value);
      // SVG에서 해당 위치 찾기
      const locationGroups = document.querySelectorAll('#locationSVG g[data-type="location"]');
      let found = false;
      locationGroups.forEach(g => {
        const rect = g.querySelector('rect');
        const text = g.querySelector('text');
        const locationCode = g.getAttribute('data-location-code');
        const codeToCheck = locationCode || (text ? text.textContent : '');
        if (normalizeLocationCode(codeToCheck) === selectedCode) {
          found = true;
          // 위치 하이라이트
          rect.setAttribute('stroke', '#ff0000');
          rect.setAttribute('stroke-width', '3');
          // SVG 컨테이너 스크롤
          const svg = document.getElementById('locationSVG');
          if (svg) {
            const rectBounds = rect.getBBox();
            const svgBounds = svg.getBoundingClientRect();
            const scrollX = rectBounds.x + rectBounds.width / 2 - svgBounds.width / 2;
            const scrollY = rectBounds.y + rectBounds.height / 2 - svgBounds.height / 2;
            svg.parentElement.scrollTo({
              left: scrollX,
              top: scrollY,
              behavior: 'smooth'
            });
          }
          // 클릭 이벤트 트리거하여 정보 표시
          setTimeout(() => {
            g.click();
          }, 300);
        } else {
          // 다른 위치는 원래 스타일로
          rect.setAttribute('stroke', '#333');
          rect.setAttribute('stroke-width', '1.5');
        }
      });
      if (!found) {
        // 위치를 찾지 못한 경우 빈 위치로 표시
        showLocationModal(selectedCode, null);
      }
    }
  };
  
  // 기존 이벤트 리스너 제거 후 새로 추가
  emptyLocationSelect.removeEventListener('change', changeHandler);
  emptyLocationSelect.addEventListener('change', changeHandler);
}

// Location View 초기화
async function resetLocationView() {
  console.log('위치 보기: resetLocationView() 호출됨');
  
  // 위치 레이아웃 먼저 로드
  await loadLocationLayout();
  console.log('위치 보기: 위치 레이아웃 로드 완료');
  
  // SVG 완전 교체
  const oldSVG = document.getElementById('locationSVG');
  let newSVG;
  if (oldSVG) {
    const svgParent = oldSVG.parentNode;
    svgParent.removeChild(oldSVG);
    newSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    newSVG.setAttribute('id', 'locationSVG');
    newSVG.setAttribute('viewBox', '0 0 835 667');
    newSVG.setAttribute('style', 'width:100vw; height:80vh; max-width:100%; background:#f8fafc; border:1.5px solid #333; box-shadow:0 2px 12px #0002;');
    svgParent.appendChild(newSVG);
    currentSVG = newSVG;
    console.log('위치 보기: SVG 교체 완료');
  }
  
  console.log('위치 보기: initializeSVG() 호출 시작');
  await initializeSVG();
  console.log('위치 보기: initializeSVG() 완료');
  // 필터 초기화 (존재할 때만)
  const productFilter = document.getElementById('filterProduct');
  if (productFilter) productFilter.value = '';
  const trailerFilter = document.getElementById('filterTrailer');
  if (trailerFilter) trailerFilter.value = '';
  const dateFilter = document.getElementById('filterDate');
  if (dateFilter) dateFilter.value = '';
  // 패널 안내 메시지로 초기화
  const sidePanelTitle = document.getElementById('sidePanelLocationTitle');
  const sidePanelBody = document.getElementById('sidePanelLocationBody');
  const shippingOrderArea = document.getElementById('shippingOrderArea');
  if (sidePanelTitle) sidePanelTitle.textContent = 'Location Info';
  if (sidePanelBody) sidePanelBody.innerHTML = '좌측에서 위치를 선택하세요.';
  if (shippingOrderArea) shippingOrderArea.innerHTML = '';
  // Location 데이터 다시 로드
  loadOccupied();
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 필터 버튼
  const filterBtn = document.getElementById('filterBtn');
  const resetBtn = document.getElementById('resetBtn');
  
  if (filterBtn) {
    filterBtn.onclick = () => {
      const filter = {
        product: document.getElementById('filterProduct')?.value.trim(),
        trailer: document.getElementById('filterTrailer')?.value.trim(),
        date: document.getElementById('filterDate')?.value.trim()
      };
      renderLocations(filter);
    };
  }

  if (resetBtn) {
    resetBtn.onclick = resetLocationView;
  }

  // 사이드 패널 닫기
  const closeSidePanel = document.getElementById('closeSidePanel');
  if (closeSidePanel) {
    closeSidePanel.onclick = () => {
      const sidePanel = document.getElementById('locationSidePanel');
      if (sidePanel) {
        sidePanel.classList.add('hidden');
      }
    };
  }
}

// 섹션 초기화
export function initSection() {
  isLocationViewActive = true;
  setupEventListeners();
  resetLocationView();
}

// 섹션 정리
export function cleanupSection() {
  isLocationViewActive = false;
  currentSVG = null;
  currentOccupied = {};
}

// 해시 변경 이벤트
window.addEventListener('hashchange', () => {
  if (location.hash.includes('location')) {
    initSection();
  } else {
    cleanupSection();
  }
});

// 포커스 이벤트
window.addEventListener('focus', () => {
  if (isLocationViewActive) {
    resetLocationView();
  }
});

// 모달 표시/닫기
const sidePanel = document.getElementById('locationSidePanel');
const sidePanelTitle = document.getElementById('sidePanelLocationTitle');
const sidePanelBody = document.getElementById('sidePanelLocationBody');
const shippingOrderArea = document.getElementById('shippingOrderArea');

function ensureSidePanelElements() {
  let sidePanel = document.getElementById('locationSidePanel');
  const flexContainer = document.querySelector('.flex.gap-4');
  // 패널이 있는데 flex row 밖에 있으면 flex row로 이동
  if (sidePanel && flexContainer && sidePanel.parentNode !== flexContainer) {
    flexContainer.appendChild(sidePanel);
  }
  // 없으면 flex row에 생성
  if (!sidePanel && flexContainer) {
    sidePanel = document.createElement('div');
    sidePanel.id = 'locationSidePanel';
    sidePanel.className = 'w-80 bg-white p-4 rounded shadow-lg h-[80vh] overflow-y-auto flex-shrink-0';
    flexContainer.appendChild(sidePanel);
  }
  // flex row가 없으면 패널도 만들지 않음
  if (!sidePanel) return {};

  let title = document.getElementById('sidePanelLocationTitle');
  if (!title) {
    title = document.createElement('h2');
    title.id = 'sidePanelLocationTitle';
    title.className = 'text-xl font-bold';
    sidePanel.appendChild(title);
  }
  let closeBtn = document.getElementById('closeSidePanel');
  if (!closeBtn) {
    closeBtn = document.createElement('button');
    closeBtn.id = 'closeSidePanel';
    closeBtn.className = 'text-gray-500 hover:text-gray-700';
    closeBtn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
    sidePanel.appendChild(closeBtn);
  }
  let body = document.getElementById('sidePanelLocationBody');
  if (!body) {
    body = document.createElement('div');
    body.id = 'sidePanelLocationBody';
    body.className = 'mb-4';
    sidePanel.appendChild(body);
  }
  let shippingOrderArea = document.getElementById('shippingOrderArea');
  if (!shippingOrderArea) {
    shippingOrderArea = document.createElement('div');
    shippingOrderArea.id = 'shippingOrderArea';
    sidePanel.appendChild(shippingOrderArea);
  }
  return { sidePanel, title, closeBtn, body, shippingOrderArea };
}

// showLocationModal: 패널의 내용만 갱신, 패널은 항상 보임
function showLocationModal(loc, info) {
  const sidePanel = document.getElementById('locationSidePanel');
  const sidePanelTitle = document.getElementById('sidePanelLocationTitle');
  const sidePanelBody = document.getElementById('sidePanelLocationBody');
  const shippingOrderArea = document.getElementById('shippingOrderArea');
  if (!sidePanel || !sidePanelTitle || !sidePanelBody || !shippingOrderArea) return;

  sidePanelTitle.textContent = `Location: ${loc}`;
  if (info) {
    let partsInfo = '';
    if (info.all_parts && Object.keys(info.all_parts).length > 1) {
      partsInfo = '<div class="mb-2"><b>All Parts:</b><br>' + 
        Object.entries(info.all_parts).map(([part, qty]) => 
          `&nbsp;&nbsp;• ${part}: ${qty}개`
        ).join('<br>') + '</div>';
    }
    
    sidePanelBody.innerHTML = `
      <div class='mb-2'><b>Main Part No:</b> ${info.part_no}</div>
      <div><b>Total Qty:</b> ${info.qty}</div>
      <div><b>입고일:</b> ${info.receiving_date || '-'}</div>
      <div><b>컨테이너/트레일러:</b> ${info.container_id || '-'}</div>
      <div><b>Total Items:</b> ${info.total_items || 1}개</div>
      ${partsInfo}
      <div class="mt-4">
        <button id="moveToEmptyLocationBtn" class="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          빈 공간으로 이동
        </button>
      </div>
    `;
    
    // 빈 공간으로 이동 버튼 이벤트
    document.getElementById('moveToEmptyLocationBtn').addEventListener('click', () => {
      showMoveToEmptyLocationModal(loc, info);
    });
    shippingOrderArea.innerHTML = `<div class="mt-4 text-sm text-gray-500">출하지시서 상태 확인 중...</div>`;
    // 출하지시서 존재 여부 확인 - 컨테이너 단위로 확인
    (async () => {
      const { data: exist } = await supabase.from('shipping_instruction')
        .select('*')
        .eq('container_no', info.container_id)
        .order('created_at', { ascending: false })
        .limit(1);
      if (exist && exist.length > 0) {
        // 이미 출하지시서가 있으면 프린트 버튼만
        const si = exist[0];
        shippingOrderArea.innerHTML = `
          <div class="mb-2 text-green-700 font-bold">이 컨테이너의 출하지시서가 이미 생성됨</div>
          <button id="printShippingBtn" class="bg-blue-600 text-white px-4 py-1 rounded">출하지시서 프린트</button>
        `;
        document.getElementById('printShippingBtn').onclick = () => printShippingLabel(si);
      } else {
        // 없으면 출하지시 버튼 + 프린트 버튼(생성 후 활성화)
        shippingOrderArea.innerHTML = `
          <div class="mt-4 space-y-2">
            <div class="flex gap-2 items-end">
              <div class="flex-1">
                <label class="block text-xs text-gray-600 mb-1">출고 날짜</label>
                <input type="date" id="shippingDateInput" class="border rounded px-2 py-1 w-full" />
              </div>
              <div class="flex-1">
                <label class="block text-xs text-gray-600 mb-1">Delivery Location</label>
                <select id="deliveryLocationSelect" class="border rounded px-2 py-1 w-full">
                  <option value="">선택...</option>
                </select>
              </div>
            </div>
            <div class="flex gap-2">
              <button id="createShippingBtn" class="bg-green-600 text-white px-4 py-1 rounded flex-1">출하지시</button>
              <button id="printShippingBtn" class="bg-blue-400 text-white px-4 py-1 rounded" disabled>출하지시서 프린트</button>
            </div>
          </div>
          <div id="shippingResultMsg" class="mt-2 text-sm"></div>
        `;
        
        // Delivery Location 드롭다운 로드
        await loadDeliveryLocations();
        let lastSI = null;
        document.getElementById('createShippingBtn').onclick = async () => {
          const shippingDate = document.getElementById('shippingDateInput').value;
          if (!shippingDate) {
            document.getElementById('shippingResultMsg').textContent = '출고 날짜를 선택하세요.';
            return;
          }
          const barcode = info.label_id || info.container_id;

          // 1. 해당 컨테이너의 모든 실물(label_id) 조회 - part_no 포함
          const { data: items, error: itemsError } = await supabase
            .from('receiving_items')
            .select('label_id, quantity, part_no, container_no')
            .eq('container_no', info.container_id);

          if (itemsError || !items || items.length === 0) {
            document.getElementById('shippingResultMsg').textContent = '이 컨테이너에 실물(label_id)이 없습니다.';
            return;
          }
          
          console.log('=== 출하지시서 생성 디버깅 ===');
          console.log('Container ID:', info.container_id);
          console.log('Location Info:', info);
          console.log('Raw items from DB:', items);
          
          // 유효한 데이터가 있는지 확인
          const validItems = items.filter(item => 
            item.label_id && 
            item.part_no && 
            item.quantity !== null && 
            item.quantity !== undefined && 
            item.quantity !== '' &&
            !isNaN(parseInt(item.quantity)) &&
            parseInt(item.quantity) > 0
          );
          
          if (validItems.length === 0) {
            document.getElementById('shippingResultMsg').textContent = '이 컨테이너에 유효한 파트 정보가 없습니다.';
            return;
          }
          
          console.log(`Found ${validItems.length} valid items out of ${items.length} total items`);

          // 2. 파트별 수량 계산 (데이터 검증 및 정규화)
          const partQuantities = {};
          console.log('Valid items for processing:', validItems); // 디버깅 로그
          
          validItems.forEach(item => {
            // 파트 번호 정규화 (공백 제거, 대소문자 통일)
            const partNo = item.part_no ? item.part_no.toString().trim().toUpperCase() : null;
            
            // 수량 정규화 (숫자로 변환, null/undefined/빈 문자열 처리)
            let quantity = 0;
            if (item.quantity !== null && item.quantity !== undefined && item.quantity !== '') {
              const parsedQty = parseInt(item.quantity);
              if (!isNaN(parsedQty) && parsedQty > 0) {
                quantity = parsedQty;
              }
            }
            
            console.log(`Processing item: label_id="${item.label_id}", original_part_no="${item.part_no}", normalized_part_no="${partNo}", quantity=${quantity}, original_quantity="${item.quantity}"`); // 디버깅 로그
            
            if (partNo && quantity > 0) {
              partQuantities[partNo] = (partQuantities[partNo] || 0) + quantity;
            } else {
              console.warn(`Skipping invalid item: part_no="${partNo}", quantity=${quantity}`);
            }
          });
          
          console.log('Calculated partQuantities:', partQuantities); // 디버깅 로그
          
          // Location Info의 part_no와 실제 DB의 파트 이름 비교
          const locationPartNo = info.part_no ? info.part_no.toString().trim().toUpperCase() : null;
          console.log('Location Info part_no:', locationPartNo);
          console.log('DB part numbers:', Object.keys(partQuantities));
          
          // 파트 이름이 다른 경우 경고
          if (locationPartNo && !Object.keys(partQuantities).includes(locationPartNo)) {
            console.warn(`Part number mismatch! Location shows "${locationPartNo}" but DB has:`, Object.keys(partQuantities));
          }
          
          // 파트별 수량이 비어있는 경우 경고
          if (Object.keys(partQuantities).length === 0) {
            console.error('No valid part quantities found!');
            document.getElementById('shippingResultMsg').textContent = '유효한 파트 정보가 없습니다.';
            return;
          }

          // 3. 출하증 생성 - 컨테이너 단위로 생성
          // 컨테이너의 총 수량 계산 (정규화된 파트별 수량 합계 사용)
          const totalQty = Object.values(partQuantities).reduce((sum, qty) => sum + qty, 0);
          
          // 파트별 수량 정보를 JSON으로 저장
          const partQuantitiesJson = JSON.stringify(partQuantities);
          
          // Delivery Location ID 가져오기
          const deliveryLocationSelect = document.getElementById('deliveryLocationSelect');
          const deliveryLocationId = deliveryLocationSelect && deliveryLocationSelect.value 
            ? parseInt(deliveryLocationSelect.value) 
            : null;
          
          const { data, error } = await supabase.from('shipping_instruction').insert({
            location_code: loc,
            part_no: info.part_no,
            qty: totalQty, // 컨테이너의 총 수량
            shipping_date: shippingDate,
            status: 'pending',
            barcode: crypto.randomUUID(),
            container_no: info.container_id,
            label_id: null, // 컨테이너 단위이므로 label_id는 null
            part_quantities: partQuantitiesJson, // 파트별 수량 정보 저장
            delivery_location_id: deliveryLocationId // Delivery Location ID 저장
          }).select('*').single();
          if (error) {
            document.getElementById('shippingResultMsg').textContent = '출하지시서 생성 실패: ' + error.message;
            return;
          }

          // 3. shipping_instruction_items에 여러 개 insert (정규화된 수량 사용)
          const shippingInstructionId = data.id;
          const itemsToInsert = validItems.map(item => {
            // 수량 정규화 (위와 동일한 로직)
            let quantity = 0;
            if (item.quantity !== null && item.quantity !== undefined && item.quantity !== '') {
              const parsedQty = parseInt(item.quantity);
              if (!isNaN(parsedQty) && parsedQty > 0) {
                quantity = parsedQty;
              }
            }
            
            return {
              shipping_instruction_id: shippingInstructionId,
              label_id: item.label_id,
              qty: quantity
            };
          });
          const { error: itemError } = await supabase.from('shipping_instruction_items').insert(itemsToInsert);
          if (itemError) {
            document.getElementById('shippingResultMsg').textContent = '출하지시서 생성(실물 매핑) 실패: ' + itemError.message;
            return;
          }
          document.getElementById('shippingResultMsg').textContent = '컨테이너 출하지시서가 생성되었습니다!';
          lastSI = data;
          const printBtn = document.getElementById('printShippingBtn');
          printBtn.disabled = false;
          printBtn.classList.remove('bg-blue-400');
          printBtn.classList.add('bg-blue-600');
        };
        document.getElementById('printShippingBtn').onclick = async () => {
          if (lastSI) await printShippingLabel(lastSI);
        };
      }
    })();
  } else {
    sidePanelBody.innerHTML = `<div class='text-green-600 font-semibold'>✓ 빈 위치 (사용 가능)</div>`;
    shippingOrderArea.innerHTML = '';
  }
}

// 출하지시서 라벨 프린트 함수
// 빈 공간으로 이동 모달 표시
async function showMoveToEmptyLocationModal(currentLocationCode, locationInfo) {
  if (!window.supabase) {
    alert('Supabase가 아직 로드되지 않았습니다.');
    return;
  }
  
  const supabase = window.supabase;
  
  // 모달 HTML 생성
  const modalHTML = `
    <div id="moveLocationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div class="p-6 border-b flex justify-between items-center">
          <h2 class="text-2xl font-bold">빈 위치로 이동: ${currentLocationCode}</h2>
          <button id="closeMoveLocationModal" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <div class="p-6 overflow-auto flex-1">
          <div class="mb-4 bg-blue-50 p-4 rounded">
            <div class="text-sm text-blue-800">
              <strong>이동할 컨테이너:</strong> ${locationInfo.container_id || '-'}<br>
              <strong>현재 위치:</strong> ${currentLocationCode}<br>
              <strong>제품:</strong> ${locationInfo.part_no || '-'} (${locationInfo.qty || 0}개)
            </div>
          </div>
          <div id="moveLocationMapContent" class="text-center py-8">
            <div class="text-gray-500">로딩 중...</div>
          </div>
        </div>
        <div class="p-4 border-t bg-gray-50">
          <div class="mb-2 text-sm text-blue-600 font-semibold">
            💡 초록색으로 표시된 빈 위치를 클릭하여 이동할 위치를 선택하세요
          </div>
          <div class="flex gap-4 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-green-200 border border-green-400"></div>
              <span>빈 위치 (사용 가능) - 클릭 가능</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-red-200 border border-red-400"></div>
              <span>사용 중</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-gray-200 border border-gray-400"></div>
              <span>사용 불가/점검 중</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 기존 모달이 있으면 제거
  const existingModal = document.getElementById('moveLocationModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // 모달 추가
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // 닫기 버튼 이벤트
  document.getElementById('closeMoveLocationModal').addEventListener('click', () => {
    document.getElementById('moveLocationModal').remove();
  });
  
  // 모달 배경 클릭 시 닫기
  document.getElementById('moveLocationModal').addEventListener('click', (e) => {
    if (e.target.id === 'moveLocationModal') {
      e.target.remove();
    }
  });
  
  // 데이터 로드 및 표시
  const contentDiv = document.getElementById('moveLocationMapContent');
  contentDiv.innerHTML = '<div class="text-gray-500">데이터를 불러오는 중...</div>';
  
  try {
    // 1. 모든 위치 로드
    const { data: locations, error: locError } = await supabase
      .from('wp1_locations')
      .select('location_code, x, y, width, height, status')
      .order('location_code');
    
    if (locError) throw locError;
    
    // 2. 실제 사용 중인 위치 확인 (receiving_items에서)
    const { data: receivingItems, error: recError } = await supabase
      .from('receiving_items')
      .select('location_code, container_no');
    
    if (recError) throw recError;
    
    // 3. 출고된 항목 확인
    const { data: shippedItems, error: shipError } = await supabase
      .from('shipping_instruction')
      .select('container_no, status')
      .eq('status', 'shipped');
    
    if (shipError) throw shipError;
    
    const shippedContainers = new Set((shippedItems || []).map(item => item.container_no));
    
    // 실제 사용 중인 위치 집합
    const occupiedLocations = new Set();
    (receivingItems || []).forEach(item => {
      if (item.location_code && !shippedContainers.has(item.container_no)) {
        const normalizedCode = normalizeLocationCode(item.location_code);
        occupiedLocations.add(normalizedCode);
      }
    });
    
    // 4. SVG 생성
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '1000');
    svg.setAttribute('height', '800');
    svg.setAttribute('viewBox', '0 0 1000 800');
    svg.style.border = '2px solid #333';
    svg.style.backgroundColor = 'white';
    
    // 배경 요소 로드
    let backgroundElements = [];
    try {
      if (window.supabase) {
        const { data, error } = await window.supabase
          .from('wp1_background_elements')
          .select('elements_data')
          .eq('id', 1)
          .single();
        
        if (!error && data && data.elements_data && Array.isArray(data.elements_data) && data.elements_data.length > 0) {
          backgroundElements = data.elements_data;
        }
      }
    } catch (e) {
      console.error('배경 요소 로드 실패:', e);
    }
    
    // 배경 요소 렌더링
    backgroundElements.forEach(bg => {
      if (bg.type === 'rect') {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', bg.x);
        rect.setAttribute('y', bg.y);
        rect.setAttribute('width', bg.width);
        rect.setAttribute('height', bg.height);
        rect.setAttribute('fill', bg.fill || '#d3d3d3');
        rect.setAttribute('stroke', bg.stroke || '#000');
        rect.setAttribute('stroke-width', bg.strokeWidth || 1);
        svg.appendChild(rect);
      } else if (bg.type === 'text') {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', bg.x);
        text.setAttribute('y', bg.y);
        text.setAttribute('font-size', bg.fontSize || 15);
        text.setAttribute('fill', bg.fill || '#000');
        text.setAttribute('text-anchor', 'middle');
        text.textContent = bg.text || bg.label || '';
        svg.appendChild(text);
      }
    });
    
    // 위치 렌더링
    const locationsWithCoords = (locations || []).filter(loc => 
      loc.x !== null && loc.y !== null && loc.width !== null && loc.height !== null
    );
    
    locationsWithCoords.forEach(loc => {
      const normalizedCode = normalizeLocationCode(loc.location_code);
      const isOccupied = occupiedLocations.has(normalizedCode);
      const isAvailable = loc.status === 'available' && !isOccupied;
      
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', loc.x);
      rect.setAttribute('y', loc.y);
      rect.setAttribute('width', loc.width);
      rect.setAttribute('height', loc.height);
      
      if (isAvailable) {
        // 빈 위치 - 초록색, 클릭 가능
        rect.setAttribute('fill', '#90EE90');
        rect.setAttribute('fill-opacity', '0.7');
        rect.setAttribute('stroke', '#228B22');
        rect.setAttribute('stroke-width', '2');
        rect.style.cursor = 'pointer';
        
        // 클릭 이벤트: 위치 이동 확인
        group.addEventListener('click', async (e) => {
          e.stopPropagation();
          
          if (!confirm(`"${normalizedCode}" 위치로 이동하시겠습니까?`)) {
            return;
          }
          
          try {
            // receiving_items에서 해당 컨테이너의 모든 항목 업데이트
            const { error: updateError } = await supabase
              .from('receiving_items')
              .update({ location_code: loc.location_code })
              .eq('container_no', locationInfo.container_id);
            
            if (updateError) throw updateError;
            
            alert(`위치가 ${normalizedCode}로 이동되었습니다.`);
            
            // 모달 닫기
            document.getElementById('moveLocationModal').remove();
            
            // 위치 보기 새로고침
            await resetLocationView();
            
            // 이동한 위치로 자동 선택
            setTimeout(() => {
              const newLocationElement = document.querySelector(`g[data-location-code="${normalizedCode}"]`);
              if (newLocationElement) {
                newLocationElement.click();
              }
            }, 500);
          } catch (error) {
            console.error('위치 이동 실패:', error);
            alert('위치 이동 실패: ' + error.message);
          }
        });
        
        // 호버 효과
        group.addEventListener('mouseenter', () => {
          rect.setAttribute('fill-opacity', '0.9');
          rect.setAttribute('stroke-width', '3');
        });
        group.addEventListener('mouseleave', () => {
          rect.setAttribute('fill-opacity', '0.7');
          rect.setAttribute('stroke-width', '2');
        });
      } else if (isOccupied) {
        // 사용 중 (빨간색)
        rect.setAttribute('fill', '#FFB6C1');
        rect.setAttribute('fill-opacity', '0.7');
        rect.setAttribute('stroke', '#DC143C');
        rect.setAttribute('stroke-width', '2');
        rect.style.cursor = 'not-allowed';
      } else {
        // 사용 불가/점검 중 (회색)
        rect.setAttribute('fill', '#D3D3D3');
        rect.setAttribute('fill-opacity', '0.5');
        rect.setAttribute('stroke', '#808080');
        rect.setAttribute('stroke-width', '1');
        rect.style.cursor = 'not-allowed';
      }
      
      group.appendChild(rect);
      
      // 위치 코드 텍스트
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', loc.x + loc.width / 2);
      text.setAttribute('y', loc.y + loc.height / 2);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('alignment-baseline', 'middle');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', '#222');
      text.textContent = normalizedCode;
      group.appendChild(text);
      
      svg.appendChild(group);
    });
    
    contentDiv.innerHTML = '';
    contentDiv.appendChild(svg);
    
  } catch (error) {
    console.error('빈 위치 맵 로드 실패:', error);
    contentDiv.innerHTML = `<div class="text-red-600">데이터 로드 실패: ${error.message}</div>`;
  }
}

async function printShippingLabel(si) {
  const now = new Date();
  const dateStr = now.toISOString().slice(0,10).replace(/-/g,'.');
  const timeStr = now.toTimeString().slice(0,5);
  const bolNo = si.barcode || si.location_code;
  const model = si.part_no || '-';
  const description = si.description || '-';
  const remarks = si.remarks || '-';
  const location = si.location_code || '-';
  
  // Delivery Location 정보 조회
  let destinationInfo = 'Hyundai Transys <br> 6601 Kia Pkwy, West Point, GA 31833'; // 기본값
  if (si.delivery_location_id) {
    try {
        const { data: deliveryLocation, error: dlError } = await supabase
          .from('wp1_delivery_locations')
          .select('location_name, address, contact_person, contact_phone')
          .eq('id', si.delivery_location_id)
          .single();
      
      if (!dlError && deliveryLocation) {
        // Delivery Location 정보로 Destination 구성
        const parts = [];
        if (deliveryLocation.location_name) parts.push(deliveryLocation.location_name);
        if (deliveryLocation.address) parts.push(deliveryLocation.address);
        if (deliveryLocation.contact_person) parts.push(`Contact: ${deliveryLocation.contact_person}`);
        if (deliveryLocation.contact_phone) parts.push(`Tel: ${deliveryLocation.contact_phone}`);
        destinationInfo = parts.join(' <br> ') || destinationInfo;
      }
    } catch (error) {
      console.error('Delivery Location 조회 실패:', error);
    }
  }
  
  // 파트별 수량 정보 파싱
  let partQuantities = {};
  if (si.part_quantities) {
    try {
      partQuantities = JSON.parse(si.part_quantities);
    } catch (e) {
      console.error('Error parsing part_quantities:', e);
    }
  }

  const printHtml = `
    <style>
      @media print {
        @page { size: 11in 8.5in portrait; margin: 0; }
        body { margin: 0; }
      }
      .bol-table, .bol-table th, .bol-table td {
        border: 1.5px solid #222; border-collapse: collapse;
      }
      .bol-table th, .bol-table td {
        padding: 10px 18px; font-size: 18px;
      }
      .bol-table { width: 100%; margin: 0 auto 12px auto; }
      .bol-title { font-size: 38px; font-weight: bold; text-align: center; margin: 18px 0 12px 0; }
      .bol-header { font-size: 16px; }
      .bol-barcode { font-size: 18px; text-align: center; margin: 8px 0; }
      .bol-sign th, .bol-sign td { font-size: 16px; height: 40px; }
      .bol-sign { width: 100%; margin: 24px 0 0 0; }
      .bol-footer { font-size: 12px; color: #444; margin-top: 12px; }
    </style>
    <div style='font-family:sans-serif;width:100vw;max-width:900px;margin:auto;background:#fff;'>
      <div class='bol-title'>STRAIGHT BILL OF LADING</div>
      <table class='bol-table bol-header'>
        <tr>
          <th>Company</th>
          <td>Leehwa SCM, Inc</td>
          <th>BOL#</th>
          <td>${bolNo}</td>
        </tr>
        <tr>
          <th>Address</th>
          <td>1201 O G Skinner Dr, West Point, GA 31833</td>
          <th>Destination</th>
          <td>${destinationInfo}</td>
        </tr>
      </table>
      <table class='bol-table'>
        <tr>
          <th>No.</th>
          <th>Model</th>
          <th>Description</th>
          <th>Qty</th>
          <th>Unit</th>
          <th>Location</th>
          <th>Remarks</th>
        </tr>
        ${Object.entries(partQuantities).map(([partNo, qty], index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${partNo}</td>
            <td>${description}</td>
            <td>${qty}</td>
            <td>EA</td>
            <td>${location}</td>
            <td>${remarks}</td>
          </tr>
        `).join('')}
        ${Object.keys(partQuantities).length === 0 ? `
          <tr>
            <td>1</td>
            <td>${model}</td>
            <td>${description}</td>
            <td>${si.qty}</td>
            <td>EA</td>
            <td>${location}</td>
            <td>${remarks}</td>
          </tr>
        ` : ''}
        <tr><td colspan='7' style='height:32px;'></td></tr>
        <tr><td colspan='7' style='height:32px;'></td></tr>
        <tr><td colspan='7' style='height:32px;'></td></tr>
      </table>
      <table class='bol-table bol-sign'>
        <tr>
          <th>Consigned To (Carrier)</th>
          <th>Driver</th>
          <th>Authorizer</th>
          <th>Security Officer<br>(Through Main Gate)</th>
        </tr>
        <tr>
          <td></td><td></td><td></td><td></td>
        </tr>
      </table>
      <div style='display:flex;justify-content:space-between;align-items:center;margin-top:18px;'>
        <div>
          <div class='bol-barcode'>${bolNo}</div>
          <div style='font-size:16px;'>TOTAL Pieces: ${si.qty} EA</div>
          <div style='font-size:16px;'>${dateStr} ${timeStr}</div>
        </div>
        <div style='text-align:right;'>
          <canvas id='qr-shipping-print' width='120' height='120'></canvas>
        </div>
      </div>
      <div class='bol-footer'>
        ● The property described above and destined as indicated above with said carrier (person or corporation in possession of the property under contract) agrees to carry product/s to its place of delivery (Consignee) at said destination. It is mutually agreed as to each the service to be performed hereunder shall be subject to all the terms and conditions of Uniform Domestic Straight Bill of Lading set forth (1) in Uniform Freight Classification in effect on date hereof.<br>
        ● Leehwa SCM must keep copy of this receipt for the future reference.<br>
        ● Person who signed on this sheet agreed that the above information is correct and their company is responsible for any problem, after container leaves HTPG.<br>
      </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js"></script>
    <script>setTimeout(function(){
      var qr = new QRious({element:document.getElementById('qr-shipping-print'),value:'${bolNo}',size:120});
    },100);</script>
  `;
  const win = window.open('', '', 'width=900,height=1200');
  win.document.write('<html><head><title>Bill of Lading</title></head><body style="margin:0;">' + printHtml + '</body></html>');
  setTimeout(() => { win.print(); }, 900);
}

// LOCATION VIEW 자동 새로고침 메시지 리스너
window.addEventListener('message', (event) => {
  console.log('위치 보기: 메시지 수신:', event.data);
  if (event.data && event.data.type === 'refreshLocationView') {
    console.log('위치 보기: refreshLocationView 메시지 수신, resetLocationView() 호출');
    // 페이지 새로고침 대신 resetLocationView 호출 (더 부드러운 업데이트)
    resetLocationView();
  }
});

// 페이지 포커스가 돌아올 때 자동 새로고침 (시각적 편집기에서 돌아올 때)
let lastFocusTime = Date.now();
window.addEventListener('focus', () => {
  // 5초 이상 포커스를 잃었다가 돌아온 경우에만 새로고침
  const timeSinceLastFocus = Date.now() - lastFocusTime;
  console.log('위치 보기: 포커스 복귀, 경과 시간:', timeSinceLastFocus, 'ms');
  if (timeSinceLastFocus > 5000) {
    console.log('위치 보기: 5초 이상 경과, resetLocationView() 호출');
    resetLocationView();
  }
  lastFocusTime = Date.now();
});

// 페이지가 보일 때도 체크 (탭 전환 시)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    console.log('위치 보기: 페이지가 다시 보임, resetLocationView() 호출');
    // 페이지가 다시 보일 때 최신 데이터 로드
    resetLocationView();
  }
});

// 언어 변경 이벤트 리스너
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
});

// 초기 언어 설정
setLang(currentLang); 