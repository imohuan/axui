export interface ThemeColors {
  primary: string
  ball: string
  ballLight: string
  onPrimary: string
  secondary: string
  onSecondary: string
  tertiary: string
  error: string
  onError: string
  background: string
  surface: string
  surfaceContainerLowest: string
  surfaceContainerLow: string
  surfaceContainer: string
  surfaceContainerHigh: string
  surfaceContainerHighest: string
  surfaceVariant: string
  onSurface: string
  onSurfaceVariant: string
  onBackground: string
  outline: string
  outlineVariant: string
  secondaryContainer: string
  onSecondaryContainer: string
  errorContainer: string
  onErrorContainer: string
  shadow: string
  scrim: string
  inverseSurface: string
  inverseOnSurface: string
  inversePrimary: string
  surfaceDim: string
  surfaceBright: string
}

export interface ThemeSpacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  gutter: string
  margin: string
  buttonXsY: string
  buttonXsX: string
  buttonSmY: string
  buttonSmX: string
  buttonMdY: string
  buttonMdX: string
  buttonLgY: string
  buttonLgX: string
  buttonXlY: string
  buttonXlX: string
  inputXsY: string
  inputXsX: string
  inputSmY: string
  inputSmX: string
  inputMdY: string
  inputMdX: string
  inputLgY: string
  inputLgX: string
  inputXlY: string
  inputXlX: string
  cardPadding: string
  cardGap: string
}

export interface ThemeRadius {
  none: string
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  full: string
}

export interface ThemeShadows {
  elevation1: string
  elevation2: string
  elevation3: string
  elevation4: string
  elevation5: string
  elevationDialog: string
  elevationMenu: string
  elevationTooltip: string
}

export interface ThemeBorders {
  width: string
  color: string
  focusRing: string
}

export interface TypographyScale {
  fontFamily: string
  fontSize: string
  lineHeight: string
  fontWeight: number | string
  letterSpacing?: string
}

export interface ThemeTypography {
  fontDisplay: string
  headlineLg: TypographyScale
  headlineLgMobile: TypographyScale
  headlineMd: TypographyScale
  headlineSm: TypographyScale
  bodyLg: TypographyScale
  bodyMd: TypographyScale
  bodySm: TypographyScale
  labelMd: TypographyScale
  display: TypographyScale
}

export interface AxiomTheme {
  colors: ThemeColors
  spacing: ThemeSpacing
  radius: ThemeRadius
  shadows: ThemeShadows
  borders: ThemeBorders
  typography: ThemeTypography
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface ThemeConfig {
  colors?: DeepPartial<ThemeColors>
  spacing?: DeepPartial<ThemeSpacing>
  radius?: DeepPartial<ThemeRadius>
  shadows?: DeepPartial<ThemeShadows>
  borders?: DeepPartial<ThemeBorders>
  typography?: DeepPartial<ThemeTypography>
}
