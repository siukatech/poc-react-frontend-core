import { useState } from 'react';

import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  useScrollTrigger,
  Box,
  Container,
  Fab,
  Fade,
} from '@mui/material';

import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';

const ScrollTop = ({
  children,
  window,
  open,
}: {
  window?: () => Window;
  children: React.ReactElement;
  open: boolean;
}) => {
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleBackToTop = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector('#back-to-top-anchor');

    if (anchor) {
      // anchor.scrollIntoView({
      //   block: 'center',
      // });
      anchor.scrollIntoView(true);
    }
  };

  return (
    <>
      {
        // !open &&
        <Fade in={trigger}>
          <Box
            onClick={handleBackToTop}
            role="presentation"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
          >
            {children}
          </Box>
        </Fade>
      }
    </>
  );
};

export default ScrollTop;
