// HTML 렌더링 함수
function renderLocationMasterUI() {
  const app = document.getElementById('locationMasterApp');
  if (!app) {
    console.error('locationMasterApp 요소를 찾을 수 없습니다.');
    return;
  }
  
  app.innerHTML = `
  <div class="mb-6">
    <h2 class="text-xl font-bold mb-4">위치 등록</h2>
    <form id="addLocationForm" class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-semibold mb-1">위치코드 *</label>
          <input type="text" id="locationCodeInput" placeholder="예: A-01" required class="w-full border px-3 py-2 rounded">
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">상태 *</label>
          <select id="statusInput" class="w-full border px-3 py-2 rounded">
            <option value="available">사용가능</option>
            <option value="occupied">점유중</option>
            <option value="maintenance">점검중</option>
            <option value="disabled">사용불가</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">X 좌표 (SVG)</label>
          <input type="number" id="xInput" placeholder="예: 2" class="w-full border px-3 py-2 rounded">
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">Y 좌표 (SVG)</label>
          <input type="number" id="yInput" placeholder="예: 1" class="w-full border px-3 py-2 rounded">
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">너비 (SVG)</label>
          <input type="number" id="widthInput" placeholder="예: 60" class="w-full border px-3 py-2 rounded">
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">높이 (SVG)</label>
          <input type="number" id="heightInput" placeholder="예: 20" class="w-full border px-3 py-2 rounded">
        </div>
        <div class="col-span-2">
          <label class="block text-sm font-semibold mb-1">비고</label>
          <input type="text" id="remarkInput" placeholder="비고 입력" class="w-full border px-3 py-2 rounded">
        </div>
      </div>
      <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">등록</button>
    </form>
  </div>
  <div>
    <h2 class="text-xl font-bold mb-4">위치 목록</h2>
    <div class="mb-4">
      <label class="block text-sm font-semibold mb-1">상태 필터</label>
      <select id="statusFilter" class="border px-3 py-2 rounded">
        <option value="">전체</option>
        <option value="available">사용가능</option>
        <option value="occupied">점유중</option>
        <option value="maintenance">점검중</option>
        <option value="disabled">사용불가</option>
      </select>
    </div>
    <table id="locationTable" class="w-full border mb-12 bg-white">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-3 py-2">위치코드</th>
          <th class="border px-3 py-2">상태</th>
          <th class="border px-3 py-2">X</th>
          <th class="border px-3 py-2">Y</th>
          <th class="border px-3 py-2">너비</th>
          <th class="border px-3 py-2">높이</th>
          <th class="border px-3 py-2">비고</th>
          <th class="border px-3 py-2">수정/삭제</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
`;
}

// 위치 목록 불러오기
async function loadLocations() {
  if (!window.supabase) {
    console.error('Supabase가 아직 로드되지 않았습니다.');
    const tbody = document.querySelector('#locationTable tbody');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-red-600 text-center py-4">Supabase 로드 중... 페이지를 새로고침하세요.</td></tr>';
    }
    return;
  }
  
  const supabase = window.supabase;
  const tbody = document.querySelector('#locationTable tbody');
  if (!tbody) {
    console.error('locationTable tbody를 찾을 수 없습니다.');
    return;
  }
  
  const statusFilter = document.getElementById('statusFilter');
  const filterValue = statusFilter ? statusFilter.value : '';
  
  tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4">로딩 중...</td></tr>';
  
  let query = supabase.from('wp1_locations').select('*');
  if (filterValue) {
    query = query.eq('status', filterValue);
  }
  query = query.order('location_code');
  
  const { data, error } = await query;
  if (error) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-red-600 text-center py-4">Error: ${error.message}</td></tr>`;
    return;
  }
  tbody.innerHTML = '';
  
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-gray-500">등록된 위치가 없습니다.</td></tr>';
    return;
  }
  
  data.forEach(loc => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="border px-3 py-2 font-semibold">${loc.location_code || '-'}</td>
      <td class="border px-3 py-2">
        <select data-id="${loc.id}" class="statusEdit border rounded px-2 py-1 w-full">
          <option value="available" ${loc.status === 'available' ? 'selected' : ''}>사용가능</option>
          <option value="occupied" ${loc.status === 'occupied' ? 'selected' : ''}>점유중</option>
          <option value="maintenance" ${loc.status === 'maintenance' ? 'selected' : ''}>점검중</option>
          <option value="disabled" ${loc.status === 'disabled' ? 'selected' : ''}>사용불가</option>
        </select>
      </td>
      <td class="border px-3 py-2"><input type="number" value="${loc.x || ''}" data-id="${loc.id}" data-field="x" class="coordEdit border rounded px-2 py-1 w-20" placeholder="X"></td>
      <td class="border px-3 py-2"><input type="number" value="${loc.y || ''}" data-id="${loc.id}" data-field="y" class="coordEdit border rounded px-2 py-1 w-20" placeholder="Y"></td>
      <td class="border px-3 py-2"><input type="number" value="${loc.width || ''}" data-id="${loc.id}" data-field="width" class="coordEdit border rounded px-2 py-1 w-20" placeholder="W"></td>
      <td class="border px-3 py-2"><input type="number" value="${loc.height || ''}" data-id="${loc.id}" data-field="height" class="coordEdit border rounded px-2 py-1 w-20" placeholder="H"></td>
      <td class="border px-3 py-2"><input type="text" value="${loc.remark || ''}" data-id="${loc.id}" class="remarkEdit border rounded px-2 py-1 w-full" placeholder="비고"></td>
      <td class="border px-3 py-2">
        <button class="updateLocBtn bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700" data-id="${loc.id}">수정</button>
        <button class="deleteLocBtn bg-red-600 text-white px-3 py-1 rounded ml-1 hover:bg-red-700" data-id="${loc.id}">삭제</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 위치 등록 이벤트 리스너 설정
function setupLocationForm() {
  const addLocationForm = document.getElementById('addLocationForm');
  if (!addLocationForm) {
    console.error('addLocationForm을 찾을 수 없습니다.');
    return;
  }
  
  const newForm = addLocationForm.cloneNode(true);
  addLocationForm.parentNode.replaceChild(newForm, addLocationForm);
  
  newForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!window.supabase) {
      alert('Supabase가 아직 로드되지 않았습니다. 페이지를 새로고침하세요.');
      return;
    }
    const supabase = window.supabase;
    
    let location_code = document.getElementById('locationCodeInput').value.trim();
    const status = document.getElementById('statusInput').value;
    const remark = document.getElementById('remarkInput').value.trim();
    const x = document.getElementById('xInput').value ? parseInt(document.getElementById('xInput').value) : null;
    const y = document.getElementById('yInput').value ? parseInt(document.getElementById('yInput').value) : null;
    const width = document.getElementById('widthInput').value ? parseInt(document.getElementById('widthInput').value) : null;
    const height = document.getElementById('heightInput').value ? parseInt(document.getElementById('heightInput').value) : null;
    
    if (!location_code) {
      alert('위치코드를 입력하세요.');
      return;
    }
    
    // 위치 코드 정규화 (A1 -> A-01)
    location_code = normalizeLocationCode(location_code);
    
    const locationData = {
      location_code,
      status,
      remark: remark || null
    };
    
    if (x !== null) locationData.x = x;
    if (y !== null) locationData.y = y;
    if (width !== null) locationData.width = width;
    if (height !== null) locationData.height = height;
    
    const { error } = await supabase.from('wp1_locations').insert(locationData);
    if (error) {
      alert('등록 실패: ' + error.message);
      return;
    }
    alert('위치가 등록되었습니다.');
    newForm.reset();
    loadLocations();
  });
}

// 상태 필터 이벤트 설정
function setupStatusFilter() {
  const statusFilter = document.getElementById('statusFilter');
  if (!statusFilter) {
    console.error('statusFilter를 찾을 수 없습니다.');
    return;
  }
  
  const newFilter = statusFilter.cloneNode(true);
  statusFilter.parentNode.replaceChild(newFilter, statusFilter);
  
  newFilter.addEventListener('change', () => {
    loadLocations();
  });
}

// 수정/삭제 이벤트 위임 설정
function setupLocationTable() {
  const locationTable = document.getElementById('locationTable');
  if (!locationTable) {
    console.error('locationTable을 찾을 수 없습니다.');
    return;
  }
  
  locationTable.addEventListener('click', async function(e) {
    if (!window.supabase) {
      alert('Supabase가 아직 로드되지 않았습니다.');
      return;
    }
    const supabase = window.supabase;
    
    const id = e.target.dataset.id;
    if (e.target.classList.contains('updateLocBtn')) {
      const status = locationTable.querySelector(`select.statusEdit[data-id='${id}']`).value;
      const remark = locationTable.querySelector(`input.remarkEdit[data-id='${id}']`).value;
      const xInput = locationTable.querySelector(`input.coordEdit[data-id='${id}'][data-field='x']`);
      const yInput = locationTable.querySelector(`input.coordEdit[data-id='${id}'][data-field='y']`);
      const widthInput = locationTable.querySelector(`input.coordEdit[data-id='${id}'][data-field='width']`);
      const heightInput = locationTable.querySelector(`input.coordEdit[data-id='${id}'][data-field='height']`);
      
      const updateData = {
        status,
        remark: remark || null
      };
      
      if (xInput && xInput.value) updateData.x = parseInt(xInput.value);
      if (yInput && yInput.value) updateData.y = parseInt(yInput.value);
      if (widthInput && widthInput.value) updateData.width = parseInt(widthInput.value);
      if (heightInput && heightInput.value) updateData.height = parseInt(heightInput.value);
      
      const { error } = await supabase.from('wp1_locations').update(updateData).eq('id', id);
      if (error) {
        alert('수정 실패: ' + error.message);
        return;
      }
      alert('수정되었습니다.');
      loadLocations();
    } else if (e.target.classList.contains('deleteLocBtn')) {
      if (!confirm('정말 삭제하시겠습니까? 이 위치를 사용 중인 데이터가 있을 수 있습니다.')) return;
      const { error } = await supabase.from('wp1_locations').delete().eq('id', id);
      if (error) {
        alert('삭제 실패: ' + error.message);
        return;
      }
      alert('삭제되었습니다.');
      loadLocations();
    }
  });
}

// 초기화 함수
function initLocationMaster() {
  if (!window.supabase) {
    console.error('Supabase가 아직 로드되지 않았습니다.');
    const app = document.getElementById('locationMasterApp');
    if (app) {
      app.innerHTML = '<div class="text-red-600 p-4">Supabase가 로드되지 않았습니다. 페이지를 새로고침하세요.</div>';
    }
    return;
  }
  
  renderLocationMasterUI();
  setupLocationForm();
  setupStatusFilter();
  setupLocationTable();
  loadLocations();
}

// DOM 로드 및 Supabase 준비 대기
document.addEventListener('DOMContentLoaded', function() {
  function tryInit() {
    if (window.supabase) {
      initLocationMaster();
    } else {
      window.addEventListener('supabaseReady', initLocationMaster, { once: true });
      setTimeout(function() {
        if (!window.supabase) {
          console.error('Supabase 초기화 타임아웃');
          const app = document.getElementById('locationMasterApp');
          if (app) {
            app.innerHTML = '<div class="text-red-600 p-4">Supabase 초기화에 실패했습니다. 페이지를 새로고침하세요.</div>';
          }
        }
      }, 5000);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    tryInit();
  }
});
