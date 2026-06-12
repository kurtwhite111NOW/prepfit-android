import colors from "@/constants/colors";
import { useTheme } from "@/lib/theme";

type ColorPalette = typeof colors.light;

export function useColors(): ColorPalette & { radius: number } {
  const { resolvedTheme } = useTheme();
  const palette: ColorPalette =
    resolvedTheme === "dark"
      ? (colors.dark as ColorPalette)
      : colors.light;
  return { ...palette, radius: colors.radius };
}
