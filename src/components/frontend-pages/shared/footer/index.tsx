import * as React from 'react';
import {
  Box,
  Grid,
  Typography,
  Container,
  Divider,
  Stack,
  Tooltip,
  Link as MuiLink,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link as RouterLink } from 'react-router-dom';

import IconInstagram from 'src/assets/images/logos/instagram.png';
import IconTiktok from 'src/assets/images/logos/tiktok.png';
import IconLinkedin from 'src/assets/images/logos/linkedin.png';
import IconYoutube from 'src/assets/images/logos/youtube.png';

/* ---------------------------- Data menu footer ---------------------------- */
type FooterItem = { title: boolean; titleText: string; to?: string; link?: string; openInNewTab?: boolean };
type FooterGroup = { id: number; children: FooterItem[] };

// Social Media Links dari environment variables
const LINK_YOUTUBE = import.meta.env.VITE_LINK_YOUTUBE || 'https://www.youtube.com/@zainzo_id';
const LINK_LINKEDIN = import.meta.env.VITE_LINK_LINKEDIN || 'https://www.linkedin.com/company/zainzo';
const LINK_TIKTOK = import.meta.env.VITE_LINK_TIKTOK || 'https://www.tiktok.com/@zainzo_id';
const LINK_INSTAGRAM = import.meta.env.VITE_LINK_INSTAGRAM || 'https://www.instagram.com/zainzo_id/';

const footerLinks: FooterGroup[] = [
  {
    id: 1,
    children: [
      { title: true, titleText: 'Produk' },
      { title: false, titleText: 'Zainzo Book', to: 'https://book.zainzo.com/' },
      { title: false, titleText: 'Zainzo Contact', to: 'https://zainzo.com/contact' },
    ],
  },
  {
    id: 2,
    children: [
      { title: true, titleText: 'Solusi' },
      { title: false, titleText: 'Solusi Untuk UMKM', link: 'https://help.zainzo.com/solusi-untuk-umkm/' },
      { title: false, titleText: 'Solusi Untuk Keuangan', link: 'https://help.zainzo.com/solusi-untuk-keuangan/' },
      { title: false, titleText: 'Solusi Untuk Pemasaran', link: 'https://help.zainzo.com/solusi-untuk-pemasaran/' },
      { title: false, titleText: 'Solusi Untuk Penjualan', link: 'https://help.zainzo.com/solusi-untuk-penjualan/' },
    ],
  },
  {
    id: 3,
    children: [
      { title: true, titleText: 'Komunitas' },
      { title: false, titleText: 'Pusat Bantuan', link: 'https://help.zainzo.com' },
      // { title: false, titleText: 'Program Affiliasi', link: '#' },
      { title: false, titleText: 'Komunitas Pengguna', link: 'https://help.zainzo.com/komunitas-pengguna-zainzo/' },
    ],
  },
  {
    id: 4,
    children: [
      { title: true, titleText: 'Perusahaan' },
      { title: false, titleText: 'Tentang Zainzo', link: 'https://help.zainzo.com/tentang-kami/' },
      // { title: false, titleText: 'Klien Kami', link: '#' },
      { title: false, titleText: 'Kebijakan Privasi', to: '/privacy-policy', openInNewTab: true },
      { title: false, titleText: 'Persyaratan Layanan', link: 'https://help.zainzo.com/syarat-dan-ketentuan/' },
    ],
  },
];

/* ---------- Link helper ---------- */
function SmartLink({
  to = '#',
  children,
  sx,
  openInNewTab,
}: {
  to?: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  openInNewTab?: boolean;
}) {
  const isExternal = /^https?:\/\//i.test(to || '');
  const baseSx = {
    display: 'block',
    py: 0.75,
    fontSize: 15,
    color: (t: Theme) => t.palette.text.secondary,
    textDecoration: 'none',
    '&:hover': { color: (t: Theme) => t.palette.primary.main },
    ...sx,
  };

  // If caller explicitly requested opening in a new tab, render a normal anchor
  if (openInNewTab) {
    return (
      <MuiLink href={to} target="_blank" rel="noopener noreferrer" underline="none" sx={baseSx}>
        {children}
      </MuiLink>
    );
  }

  return isExternal ? (
    <MuiLink href={to} target="_blank" rel="noopener noreferrer" underline="none" sx={baseSx}>
      {children}
    </MuiLink>
  ) : (
    <MuiLink component={RouterLink} to={to || '#'} underline="none" sx={baseSx}>
      {children}
    </MuiLink>
  );
}

/* ---------- Sections ---------- */
function DesktopSection({ group }: { group: FooterGroup }) {
  const title = group.children.find((c) => c.title)?.titleText ?? '';
  const items = group.children.filter((c) => !c.title);

  return (
    <Box sx={{ minWidth: 180 }}>
      <Typography fontSize={17} fontWeight={600} mb={2.25} color="text.primary">
        {title}
      </Typography>
      <Box>
        {items.map((it, idx) => (
          <SmartLink key={idx} to={it.to ?? it.link ?? '#'} openInNewTab={it.openInNewTab}>
            {it.titleText}
          </SmartLink>
        ))}
      </Box>
    </Box>
  );
}

function MobileSection({ group }: { group: FooterGroup }) {
  const title = group.children.find((c) => c.title)?.titleText ?? '';
  const items = group.children.filter((c) => !c.title);
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Accordion
      disableGutters
      square
      elevation={0}
      expanded={expanded}
      onChange={(_, e) => setExpanded(e)}
      sx={{
        bgcolor: 'transparent',
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ px: 0, py: 1.25, minHeight: 0, '& .MuiAccordionSummary-content': { m: 0 } }}
      >
        <Typography fontSize={16} fontWeight={600} color="text.primary">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pb: 1.25, pt: 0 }}>
        {items.map((it, idx) => (
          <SmartLink key={idx} to={it.to ?? it.link ?? '#'} sx={{ py: 1 }} openInNewTab={it.openInNewTab}>
            {it.titleText}
          </SmartLink>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}

/* ----------------------------------- Footer ----------------------------------- */
const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobileLike = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 3.5, lg: 7.5 } }}>
      <Grid
        container
        rowSpacing={{ xs: 1.5, md: 2.5 }}
        columnSpacing={{ xs: 3, md: 6 }}
        justifyContent="center"
        alignItems="flex-start"
        mb={{ xs: 2, md: 5 }}
      >
        {footerLinks.map((group) => (
          <Grid key={group.id} item xs={12} sm={6} md={2.5}>
            {isMobileLike ? <MobileSection group={group} /> : <DesktopSection group={group} />}
          </Grid>
        ))}
      </Grid>

      <Divider />

      <Box
        py={{ xs: 3, md: 5 }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Tooltip title="Instagram">
            <MuiLink href={LINK_INSTAGRAM} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={IconInstagram} alt="instagram" width={22} height={22} />
            </MuiLink>
          </Tooltip>
          <Tooltip title="Tiktok">
            <MuiLink href={LINK_TIKTOK} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={IconTiktok} alt="tiktok" width={22} height={22} />
            </MuiLink>
          </Tooltip>
          <Tooltip title="LinkedIn">
            <MuiLink href={LINK_LINKEDIN} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={IconLinkedin} alt="linkedin" width={22} height={22} />
            </MuiLink>
          </Tooltip>
          <Tooltip title="Youtube">
            <MuiLink href={LINK_YOUTUBE} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={IconYoutube} alt="youtube" width={28} height={22} />
            </MuiLink>
          </Tooltip>
        </Stack>

        <Typography variant="body1" fontSize={15} color="text.secondary">
          © Copyright 2025 - PT. Jalani Aja Dulu
        </Typography>
      </Box>
    </Container>
  );
};

export default Footer;
