const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture');

// Mengakses Kamera 
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => { video.srcObject = stream; })
  .catch(err => alert('Kamera tidak dapat diakses'));

function getDateTime() {
  const now = new Date();
  const tanggal = now.toLocaleDateString('id-ID');
  const waktu = now.toLocaleTimeString('id-ID');
  const hari = now.toLocaleDateString('id-ID', { weekday: 'long' });
  return { tanggal, waktu, hari };
}

captureBtn.addEventListener('click', async () => {
  const nama = document.getElementById('nama').value;
  const kelas = document.getElementById('kelas').value;
  const status = document.getElementById('absenceReason').value;

  // Validasi input
  if (!nama || !kelas) return alert('Isi nama dan kelas dulu');

  // Menganmbil Foto
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const foto = canvas.toDataURL('image/jpeg');
  const { tanggal, waktu, hari } = getDateTime();

  const data = { nama, kelas, status, tanggal, waktu, hari, foto };

  // Mengirim Data Ke Server
  try {
    const res = await fetch('http://localhost:5000/api/absen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.message || 'Berhasil absen');
  } catch (err) {
    alert('Gagal mengirim data');
    console.error(err);
  }
});

// Menampilkan jam
setInterval(() => {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('id-ID');
}, 1000);

// Contoh pengendali tombol absen
document.getElementById('capture').addEventListener('click', () => {
  const loader = document.getElementById('loader');
  const successMsg = document.getElementById('successMsg');
  const errorMsg = document.getElementById('errorMsg');

  loader.style.display = 'block';
  successMsg.style.display = 'none';
  errorMsg.style.display = 'none';

  setTimeout(() => {
    loader.style.display = 'none';
    successMsg.style.display = 'block'; // atau errorMsg.style.display = 'block';
  }, 2000);
});


