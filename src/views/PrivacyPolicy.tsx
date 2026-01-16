import { Box, Typography, Container, Paper } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

const PrivacyPolicy = () => {
  return (
    <PageContainer
      title="Kebijakan Privasi"
      description="Kebijakan Privasi Zainzo Task"
    >
      <Box
        sx={{
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
          bgcolor: '#F8FAFC',
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              userSelect: 'text',
            }}
          >
            {/* HEADER */}
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Kebijakan Privasi
            </Typography>

            <Typography sx={{ color: '#64748B', mb: 4 }}>
              Terakhir diperbarui: 14 Januari 2026
            </Typography>

            {/* CONTENT */}
            {[
              {
                title: 'Pendahuluan',
                body: `Zainzo Task menghargai privasi pengguna dan berkomitmen untuk melindungi data pribadi
                yang dipercayakan kepada kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengakses,
                menggunakan, dan melindungi informasi saat Anda menggunakan Zainzo Task.`,
              },
              {
                title: '1. Informasi yang Kami Akses',
                body: `Zainzo Task menggunakan Google OAuth 2.0 dan Google Tasks API resmi untuk berfungsi.
                Saat Anda masuk menggunakan akun Google, Zainzo Task dapat mengakses informasi identitas dasar
                seperti alamat email dan nama profil, serta data Google Tasks yang Anda buat dan kelola,
                termasuk judul tugas, status tugas, tanggal jatuh tempo, dan catatan tugas (jika ada).`,
              },
              {
                title: 'Informasi yang Tidak Kami Akses',
                body: `Zainzo Task tidak mengakses email Gmail, file Google Drive, kontak, atau kalender Google,
                kecuali keterkaitan tugas yang memang disediakan melalui Google Tasks.`,
              },
              {
                title: '2. Cara Kami Menggunakan Informasi',
                body: `Informasi yang diakses digunakan hanya untuk menampilkan dan mengelola tugas Anda
                di Zainzo Task, menyinkronkan perubahan tugas dengan Google Tasks, serta menjaga konsistensi
                data di seluruh perangkat Anda.`,
              },
              {
                title: 'Penggunaan yang Tidak Kami Lakukan',
                body: `Kami tidak menggunakan data untuk iklan, profiling pengguna, atau analitik perilaku
                lintas layanan.`,
              },
              {
                title: '3. Penyimpanan dan Keamanan Data',
                body: `Zainzo Task tidak pernah menyimpan kata sandi Google Anda. Proses autentikasi sepenuhnya
                ditangani oleh Google. Token akses disimpan dan digunakan secara aman sesuai standar keamanan
                OAuth. Kami menerapkan langkah-langkah keamanan teknis yang wajar untuk melindungi data dari
                akses yang tidak sah.`,
              },
              {
                title: '4. Pembagian Data',
                body: `Zainzo Task tidak menjual, menyewakan, atau membagikan data pribadi maupun data Google Tasks
                Anda kepada pihak ketiga mana pun. Data hanya digunakan untuk menjalankan fungsi aplikasi
                sebagaimana dijelaskan dalam kebijakan ini.`,
              },
              {
                title: '5. Penghapusan dan Pencabutan Akses',
                body: `Anda memiliki kendali penuh atas data Anda. Anda dapat mencabut akses Zainzo Task kapan
                saja melalui halaman izin akun Google di https://myaccount.google.com/permissions.
                Setelah akses dicabut, Zainzo Task tidak lagi dapat mengakses data Google Tasks Anda.`,
              },
              {
                title: '6. Layanan Pihak Ketiga',
                body: `Zainzo Task bergantung pada layanan Google untuk autentikasi dan sinkronisasi tugas.
                Penggunaan layanan Google tunduk pada Kebijakan Privasi Google yang dapat diakses di
                https://policies.google.com/privacy.`,
              },
              {
                title: '7. Perubahan Kebijakan Privasi',
                body: `Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Setiap perubahan
                akan ditampilkan di halaman ini dengan tanggal pembaruan terbaru.`,
              },
            ].map((section, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {section.title}
                </Typography>
                <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                  {section.body}
                </Typography>
              </Box>
            ))}

            {/* HIGHLIGHT */}
            <Box
              sx={{
                mt: 6,
                p: 3,
                bgcolor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: 2,
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                Pernyataan Tambahan
              </Typography>
              <Typography sx={{ mt: 1, color: '#475569' }}>
                Zainzo Task menggunakan Google Tasks API dan mematuhi Google API Services
                User Data Policy, termasuk persyaratan Limited Use.
              </Typography>
            </Box>

            {/* CONTACT */}
            <Box sx={{ mt: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Hubungi Kami
              </Typography>
              <Typography sx={{ color: '#475569' }}>
                Email: <strong>zainzoindonesia@gmail.com</strong>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </PageContainer>
  );
};

export default PrivacyPolicy;
