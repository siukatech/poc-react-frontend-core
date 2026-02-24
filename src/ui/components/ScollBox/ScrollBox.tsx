import React, { useRef } from 'react';
// import PropTypes from 'prop-types';

import { Box } from '@mui/material';

import useScrollBox from './useScrollBox';
// import './scrollBox.css';

/**
 * Reference:
 * https://dev.to/murilovarela/an-easy-scroll-box-implementation-2b6a
 *
 * @returns
 */
type ScrollBoxProps = {
  children: React.ReactNode[];
};

const ScrollBox: React.FC<ScrollBoxProps> = ({ children }) => {
  const scrollWrapperRef = useRef();
  const { isDragging } = useScrollBox(scrollWrapperRef);
  return (
    <Box
      // className="scroll-box"
      component={'div'}
      sx={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Box
        // className="scroll-box__wrapper"
        ref={scrollWrapperRef}
        component={'div'}
        sx={{
          // width: '100%',
          width: '96vw',
          // height: '100%',
          overflowY: 'hidden',
          overflowX: 'scroll',
          boxSizing: 'border-box',
          ['-ms-overflow-style']: 'none',
          overflow: '-moz-scrollbars-none',
        }}
      >
        <Box
          // className="scroll-box__container"
          role="list"
          style={{ pointerEvents: isDragging ? 'none' : undefined }}
          component={'div'}
          sx={{
            height: '100%',
            display: 'inline-flex',
            mb: 2,
          }}
        >
          {children.map((child, i) => (
            <Box
              role="listitem"
              key={`scroll-box-item-${i}`}
              className="scroll-box__item"
            >
              {child}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// ScrollBox.propTypes = {
//   children: PropTypes.node.isRequired,
// };

export default ScrollBox;
