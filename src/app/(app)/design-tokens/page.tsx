"use client";

/**
 * Design Tokens Test Page
 * Verifies Yoruba diacritics rendering in Baloo 2 and Nunito fonts.
 * If glyphs render correctly (not as □), fonts are safe for production use.
 */

export default function DesignTokensPage() {
  const diacriticsTestString = "Àmì by Kòkò — Àgbàdo, ṣẹ̀ṣẹ̀, ọmọ";

  return (
    <div className="min-h-screen bg-cream-bg p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-navy mb-2">
          Design Tokens Test
        </h1>
        <p className="text-navy-body text-base mb-12">
          Verify Yoruba diacritics render correctly in Baloo 2 and Nunito fonts.
        </p>

        {/* Test 1: Baloo 2 (Display font) */}
        <section className="mb-10 bg-white rounded-3xl p-8 shadow-sm ring-1 ring-border-warm">
          <h2 className="text-xs font-bold text-navy-muted uppercase tracking-wide mb-2">
            Font: Baloo 2 (Display/Headings)
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-navy font-display">
            {diacriticsTestString}
          </p>
          <p className="text-xs text-navy-muted mt-4">
            If all glyphs render (not as □), Baloo 2 supports Yoruba diacritics. ✅
          </p>
        </section>

        {/* Test 2: Nunito (Body font) */}
        <section className="mb-10 bg-white rounded-3xl p-8 shadow-sm ring-1 ring-border-warm">
          <h2 className="text-xs font-bold text-navy-muted uppercase tracking-wide mb-2">
            Font: Nunito (Body/UI)
          </h2>
          <p className="text-lg md:text-xl text-navy-body font-body">
            {diacriticsTestString}
          </p>
          <p className="text-xs text-navy-muted mt-4">
            If all glyphs render (not as □), Nunito supports Yoruba diacritics. ✅
          </p>
        </section>

        {/* Colour Palette */}
        <section className="mb-10 bg-white rounded-3xl p-8 shadow-sm ring-1 ring-border-warm">
          <h2 className="text-sm font-bold text-navy mb-4">Colour Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "Primary Green", var: "primary-green", hex: "#1FA463" },
              { name: "Accent Yellow", var: "accent-yellow", hex: "#FFC93C" },
              { name: "Coral", var: "coral", hex: "#F25C54" },
              { name: "Navy", var: "navy", hex: "#1B2A5B" },
              { name: "Cream BG", var: "cream-bg", hex: "#FFFBEF" },
              { name: "Border", var: "border-warm", hex: "#EFE8D8" },
            ].map(colour => (
              <div key={colour.var} className="flex flex-col gap-2">
                <div
                  className="w-full h-24 rounded-2xl ring-1 ring-border-warm"
                  style={{ backgroundColor: colour.hex }}
                  title={colour.hex}
                />
                <p className="text-xs font-semibold text-navy">{colour.name}</p>
                <p className="text-xs text-navy-muted font-mono">{colour.hex}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Category Colours */}
        <section className="bg-white rounded-3xl p-8 shadow-sm ring-1 ring-border-warm">
          <h2 className="text-sm font-bold text-navy mb-4">Category Colours</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "Orange (Games)", solid: "#FF8A3D", light: "#FFEEDD" },
              { name: "Blue (Learn)", solid: "#3B82F6", light: "#E6F0FF" },
              { name: "Purple (Stories)", solid: "#8B5CF6", light: "#F0E9FF" },
              { name: "Pink (Music)", solid: "#EC4899", light: "#FFE6F1" },
              { name: "Green (Nature)", solid: "#1FA463", light: "#E6F7EE" },
              { name: "Yellow (Culture)", solid: "#FFC93C", light: "#FFF9E6" },
            ].map(cat => (
              <div key={cat.name} className="flex flex-col gap-2">
                <div className="flex gap-1">
                  <div
                    className="flex-1 h-12 rounded-lg ring-1 ring-border-warm"
                    style={{ backgroundColor: cat.solid }}
                    title={cat.solid}
                  />
                  <div
                    className="flex-1 h-12 rounded-lg ring-1 ring-border-warm"
                    style={{ backgroundColor: cat.light }}
                    title={cat.light}
                  />
                </div>
                <p className="text-xs font-semibold text-navy">{cat.name}</p>
                <p className="text-xs text-navy-muted font-mono">
                  {cat.solid} / {cat.light}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
