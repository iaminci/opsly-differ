export type ThemeStyles = {
  light: Record<string, string>;
  dark: Record<string, string>;
};

export type ThemePreset = {
  label?: string;
  createdAt?: string;
  styles: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
};
