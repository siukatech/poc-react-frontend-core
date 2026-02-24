import * as Icons from '@mui/icons-material';
import type { SxProps } from '@mui/material';

type IconNames = keyof typeof Icons;
type IconProps = {
  name: IconNames;
  sx?: SxProps;
};

/**
 * References:
 * https://stackoverflow.com/a/75906013
 *
 * @param param0
 * @returns
 */
const IconComponent: React.FC<IconProps> = ({ name, sx }) => {
  const Icon = Icons[name];
  return (
    <>
      <Icon sx={sx} />
    </>
  );
};

export default IconComponent;

export type { IconNames, IconProps };
