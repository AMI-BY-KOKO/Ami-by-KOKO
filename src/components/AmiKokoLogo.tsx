type AmiKokoLogoProps = {
  className?: string;
  height?: number;
};

export default function AmiKokoLogo({ className, height = 56 }: AmiKokoLogoProps) {
  return (
    <svg
      viewBox="40 120 550 130"
      height={height}
      className={className}
      role="img"
      aria-label="Àmì by Kòkò"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fontFamily="Nunito, Quicksand, system-ui, sans-serif" fontWeight="800" fontSize="120">
        <text x="50" y="240" textLength="182" lengthAdjust="spacingAndGlyphs" fill="#C4673A">
          Àmì
        </text>
        <text x="250" y="240" textLength="100" lengthAdjust="spacingAndGlyphs" fill="#F2B33D">
          by
        </text>
        <text x="370" y="240" textLength="200" lengthAdjust="spacingAndGlyphs" fill="#3E7D3E">
          Kòkò
        </text>
      </g>
    </svg>
  );
}