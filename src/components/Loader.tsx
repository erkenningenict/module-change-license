import { Spinner } from '@erkenningen/ui/components/spinner';
import React from 'react';

const Loader: React.FC<{ loading?: boolean; loadingText?: string }> = (props) => {
  if (props.loading) {
    return <Spinner text={props.loadingText || 'Gegevens laden...'} />;
  }
  return <>{props.children}</>;
};

export default Loader;
