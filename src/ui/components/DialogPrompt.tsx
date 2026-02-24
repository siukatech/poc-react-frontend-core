import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
} from '@mui/material';

const DialogPrompt = ({
  open,
  title,
  message,
  onOk,
  onCancel,
}: {
  open: boolean;
  title: string;
  message?: string;
  onOk: (evt: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel?: (evt: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="confirm-dialog-title"
        // aria-aria-describedby="confirm-dialog-message"
      >
        <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
        {message && (
          <DialogContent>
            <DialogContentText id="confirm-dialog-message">
              {`${message}`}
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          {onCancel && (
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={onCancel}
            >
              {t('button.cancel')}
            </Button>
          )}
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={onOk}
          >
            {t('button.ok')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogPrompt;
