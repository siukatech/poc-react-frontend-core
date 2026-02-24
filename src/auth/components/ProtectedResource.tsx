import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { AxiosError } from 'axios';
import { Button, Stack, Typography } from '@mui/material';
import { useAuthContext } from '../hooks/useAuthContext';
import { DialogPrompt } from '../../ui';
import { recursiveCloneChildren } from '../../utils/render';

// enum ProtectedResourceDisplayType {
//   HIDDEN = 'HIDDEN',
//   DISABLED = 'DISABLED',
//   PROMPT = 'PROMPT',
//   MESSAGE = 'MESSAGE',
// }
const ProtectedResourceDisplayType = {
  HIDDEN: 'HIDDEN',
  DISABLED: 'DISABLED',
  PROMPT: 'PROMPT',
  MESSAGE: 'MESSAGE',
} as const;
type ProtectedResourceDisplayType = typeof ProtectedResourceDisplayType[keyof typeof ProtectedResourceDisplayType];

// enum ProtectedResourceAccessBy {
//   PUBLIC = 'PUBLIC', // non-authenticated
//   PROTECTED = 'PROTECTED', // authenticated
// }
const ProtectedResourceAccessBy = {
  PUBLIC: 'PUBLIC', // non-authenticated
  PROTECTED: 'PROTECTED', // authenticated
} as const;
type ProtectedResourceAccessBy = typeof ProtectedResourceAccessBy[keyof typeof ProtectedResourceAccessBy];

interface DialogPromptCfg {
  title?: string;
  message?: string;
  url?: string;
}

interface DeniedMessageCfg {
  message?: string;
  url?: string;
}

const checkShowChildren = (
  hasPermission: boolean,
  timeoutErr: undefined | AxiosError,
  accessBy: ProtectedResourceAccessBy,
  displayType: ProtectedResourceDisplayType,
  children: React.ReactNode
): any => {
  let showChildren = false;
  let dialogPromptCfg: undefined | DialogPromptCfg = undefined;
  let deniedMessageCfg: undefined | DeniedMessageCfg = undefined;
  // let disabledEleCfg: undefined | any = undefined;
  let refinedChildren: React.ReactNode = children;
  if (timeoutErr) {
    // console.debug(
    //   'ProtectedResource - checkShowChildren - timeoutErr: ',
    //   timeoutErr
    // );
    showChildren = false;
    if (timeoutErr.code == AxiosError.ERR_BAD_REQUEST) {
      dialogPromptCfg = {
        title: 'error.login.failed',
        message: 'warning.access.denied',
        url: '/?access=denied',
      };
    } else if (timeoutErr.code == AxiosError.ERR_CANCELED) {
      dialogPromptCfg = {
        title: 'error.login.timeout',
        message: 'warning.login.timeout',
        url: '/?access=timeout',
      };
    }
  }
  if (hasPermission) {
    showChildren = true;
  } else {
    if (accessBy === ProtectedResourceAccessBy.PUBLIC) {
      showChildren = true;
      // console.debug(
      //   `ProtectedResource - checkShowChildren - accessBy: [${accessBy}], refinedChildren: `,
      //   refinedChildren
      // );
    } else if (accessBy === ProtectedResourceAccessBy.PROTECTED) {
      showChildren = false;
      if (displayType === ProtectedResourceDisplayType.DISABLED) {
        showChildren = true;
        refinedChildren = recursiveCloneChildren(
          children as React.ReactElement[],
          { disabled: true, onClick: null, buttonOnClick: null }
        );
      } else if (displayType === ProtectedResourceDisplayType.MESSAGE) {
        deniedMessageCfg = {
          message: 'warning.access.denied',
          url: '/?access=denied',
        };
      } else if (displayType === ProtectedResourceDisplayType.PROMPT) {
      }
    } else {
      showChildren = false;
      if (dialogPromptCfg == null) {
        dialogPromptCfg = {
          title: 'error.login.failed',
          message: 'warning.access.denied',
          url: '/?access=unknown',
        };
      }
    }
  }
  let ret: any = {
    showChildren,
    refinedChildren,
  };
  if (displayType === ProtectedResourceDisplayType.PROMPT) {
    ret['dialogPromptCfg'] = dialogPromptCfg;
  } else if (displayType === ProtectedResourceDisplayType.MESSAGE) {
    ret['deniedMessageCfg'] = deniedMessageCfg;
  }

  return ret;
};

type ProtectedResourceProps = {
  children: React.ReactNode;
  accessBy: ProtectedResourceAccessBy;
  displayType?: ProtectedResourceDisplayType;
  resourceName?: string;
  accessRights?: string | string[];
};

const ProtectedResource = ({
  children,
  accessBy,
  displayType = ProtectedResourceDisplayType.PROMPT,
  resourceName = undefined,
  accessRights = undefined,
}: ProtectedResourceProps) => {
  const { user, checkTimeout, checkPermission, timeoutErr } =
    useAuthContext();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // const [timeoutErr, setTimeoutErr] = useState<any>(null);

  // useEffect(() => {
  //   if (accessBy === ProtectedResourceAccessBy.PROTECTED) {
  //     const fetchData = async () => {
  //       try {
  //         // // await checkTimeout();
  //         await checkTimeout();
  //         // try {
  //         //   checkTimeout();
  //         // } catch (err) {
  //         //   console.error('ProtectedResource - useEffect - err 1: ', err);
  //         //   setTimeoutErr(err);
  //         // }
  //       } catch (err) {
  //         console.error('ProtectedResource - useEffect - 2 - err: ', err);
  //       }
  //     };
  //     fetchData();
  //     // .catch((reject) => {
  //     //   console.error('ProtectedResource - useEffect - reject 2: ', reject);
  //     //   (reject as Promise<AxiosError>).then((err) => setTimeoutErr(err));
  //     //   // setTimeoutErr(err);
  //     // })
  //     // try {
  //     //   checkTimeout();
  //     // } catch (err) {
  //     //   console.error('ProtectedResource - useEffect - err: ', err);
  //     //   setTimeoutErr(err);
  //     // }
  //   }
  // }, [accessBy, checkTimeout]);

  const hasPermission = checkPermission(user, resourceName, accessRights);
  const {
    showChildren,
    dialogPromptCfg,
    deniedMessageCfg,
    // disabledEleCfg,
    refinedChildren,
  } = checkShowChildren(
    hasPermission,
    timeoutErr,
    accessBy,
    displayType,
    children
  );

  const debugInfo =
    'hasPermission: [' +
    `${hasPermission}` +
    '], showChildren: [' +
    `${showChildren}` +
    '], dialogPromptCfg?.title: [' +
    `${dialogPromptCfg?.title}` +
    '], timeoutErr?.code: [' +
    `${timeoutErr?.code}` +
    '], deniedMessageCfg.message: [' +
    `${deniedMessageCfg?.message}` +
    '], displayType: [' +
    `${displayType}` +
    '], accessBy: [' +
    `${accessBy}` +
    // + '], disabledEleCfg?.disabled: [' + `${disabledEleCfg?.disabled}`
    ']';
  // console.debug('ProtectedResource - debugInfo: ', debugInfo);

  // return <Navigate to="/?access=denied" />;
  return (
    <>
      {!showChildren && dialogPromptCfg && (
        <>
          <div>{debugInfo}</div>
          <DialogPrompt
            open={true}
            title={t(dialogPromptCfg.title)}
            // message={t(dialogPromptCfg.message)}
            onOk={() => {
              navigate(`${dialogPromptCfg.url}`);
            }}
          />
        </>
      )}
      {!showChildren && deniedMessageCfg && (
        <>
          <div>{debugInfo}</div>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {t(deniedMessageCfg.message)}
          </Typography>
          <Stack direction="row">
            <Button onClick={() => navigate(deniedMessageCfg.url)}>
              {t('button.back')}
            </Button>
          </Stack>
        </>
      )}
      {showChildren &&
        displayType === ProtectedResourceDisplayType.DISABLED && (
          <>{refinedChildren}</>
        )}
      {showChildren &&
        displayType !== ProtectedResourceDisplayType.DISABLED && (
          <>{refinedChildren}</>
        )}
    </>
  );
};

export default ProtectedResource;
export { ProtectedResourceAccessBy, ProtectedResourceDisplayType }
// export type { ProtectedResourceAccessBy, ProtectedResourceDisplayType };
