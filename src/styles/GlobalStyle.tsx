import { createGlobalStyle } from 'styled-components';

import themeDefinition from 'styles/theme';

export default createGlobalStyle`
  * {
    box-sizing: border-box;
    ${({ theme }: { theme: typeof themeDefinition }) => theme.font.medium};
  } 

  body {
    margin: 0;
  }

  h2 {
    ${({ theme }: { theme: typeof themeDefinition }) => theme.font.large};
  }

  p {
    ${({ theme }: { theme: typeof themeDefinition }) => theme.font.small};
  }
`;
