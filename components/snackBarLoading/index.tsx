/* Vendor */
import Snackbar from '@mui/material/Snackbar';
import { CircularProgress } from "@nextui-org/react";
/* Static */
import styles from '@/styles/SnackbarLoading.module.css';

export default function SnackBarLoading({
  isOpen
}: {
  isOpen: boolean,
}) {
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={6000}
    >
      <span className={styles.snackBarLoadingBase}>
        <span className={styles.mtgLoadingContainer}>
          <CircularProgress size="sm" color="secondary" aria-label="Loading..." />
        </span>
        <span className={styles.snackBarLoadingText}>
          Loading...
        </span>
      </span>
    </Snackbar>
  );
};
