import { execSync } from 'child_process';

const layers = [
  { file: '01_RanhGioiQuocGia.geojson', table: 'bien_gioi_quoc_gia' },
  { file: '02_RanhGioiTinh.geojson', table: 'bien_gioi_tinh' },
  { file: '03_SongSuoi.geojson', table: 'song_suoi' },
  { file: '04_HoMatNuoc.geojson', table: 'ho_mat_nuoc' },
  { file: '05_NhaMayThuyDien.geojson', table: 'ho_chua_dap' },
  { file: '08_DuongSatVietNam.geojson', table: 'duong_sat_viet_nam' },
  { file: '09_GiaoThongDuongDi.geojson', table: 'giao_thong_duong_di' },
  { file: '10_DiaDiemDanCu.geojson', table: 'dia_diem_dan_cu' },
  { file: '11_PhuBeMat_SuDungDat.geojson', table: 'phu_be_mat_su_dung_dat' },
];

console.log('🚀 Bắt đầu quá trình nạp (import) dữ liệu GeoJSON vào PostGIS...');

// Hàm thực thi lệnh an toàn qua Docker Compose hoặc Docker direct
function runOgr2Ogr(file, table) {
  const ogrParams = `-f "PostgreSQL" PG:"host=postgis dbname=gis user=postgres password=postgres" /data/processed/vector/${file} -nln ${table} -lco GEOMETRY_NAME=geom -lco FID=fid -lco SPATIAL_INDEX=GIST -nlt PROMOTE_TO_MULTI -overwrite`;
  
  const commands = [
    `docker compose exec -T mapserver ogr2ogr ${ogrParams}`,
    `docker exec webatlas-mapserver-1 ogr2ogr ${ogrParams}`
  ];

  let success = false;
  let lastError = null;

  for (const cmd of commands) {
    try {
      execSync(cmd, { stdio: 'inherit' });
      success = true;
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!success && lastError) {
    throw lastError;
  }
}

for (const { file, table } of layers) {
  const startTime = Date.now();
  console.log(`\n📦 Importing [${file}] -> Table [${table}]...`);
  
  try {
    runOgr2Ogr(file, table);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Thành công [${table}] (${duration}s)`);
  } catch (error) {
    console.error(`❌ Lỗi khi import [${file}]:`, error.message);
  }
}

// Tối ưu hóa hiệu năng sau khi nạp xong
try {
  console.log('\n⚡ Đang chạy ANALYZE để tối ưu hóa chỉ mục CSDL PostGIS...');
  execSync('docker compose exec -T postgis psql -U postgres -d gis -c "VACUUM ANALYZE;"', { stdio: 'ignore' });
} catch {
  try {
    execSync('docker exec webatlas-postgis-1 psql -U postgres -d gis -c "VACUUM ANALYZE;"', { stdio: 'ignore' });
  } catch {
    // Bỏ qua nếu lệnh vacuum phụ gặp lỗi kết nối
  }
}

console.log('\n🎉 Đã hoàn tất nạp toàn bộ các lớp dữ liệu GeoJSON vào CSDL PostGIS!');
