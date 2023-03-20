import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { themeModeAtom } from 'store';
import { globalDesignToken } from 'style';

interface MaterialUIRootProps {
  children: ReactNode;
}

function MaterialUIRoot({ children }: MaterialUIRootProps) {
  const themeMode = useRecoilValue(themeModeAtom);
  const theme = useMemo(
    () =>
      responsiveFontSizes(createTheme(globalDesignToken({ mode: themeMode }))),
    [themeMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>{children}</CssBaseline>
    </ThemeProvider>
  );
}
export { MaterialUIRoot };
