import { Box } from '@mui/material';
import type { SxProps } from '@mui/material';

type ImgProps = {
  src: string;
  alt?: string;
  sx?: SxProps;
};

const ImgComponent: React.FC<ImgProps> = (props) => {
  return <Box component="img" {...props}></Box>;
};

export default ImgComponent;

export type { ImgProps };

