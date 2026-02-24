import { useState } from 'react';

import { Modal, CircularProgress, Box } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <>
      <Modal open={true} hideBackdrop={true} >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* <Box flexGrow={1}
            sx={{
              display: 'flex',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          > */}
            <CircularProgress color="secondary" size={50} />
          {/* </Box> */}
        </Box>
      </Modal>
    </>
  );
};

export default LoadingSpinner;
