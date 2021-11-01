import { useGrowlContext } from '@erkenningen/ui/components/growl';

export default function useToast(): {
  showError: (summary: string, detail: string) => void;
  showSuccess: (summary: string, detail?: string) => void;
} {
  const { showGrowl } = useGrowlContext();

  const showError = (summary: string, detail: string): void => {
    showGrowl({
      severity: 'error',
      summary,
      detail,
      life: 15000,
    });
  };

  const showSuccess = (summary: string, detail?: string): void => {
    showGrowl({
      severity: 'success',
      summary,
      detail,
      life: 8000,
    });
  };

  return { showError, showSuccess };
}
