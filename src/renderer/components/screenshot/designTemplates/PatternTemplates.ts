
const patterns: any = { name: "Patterns", cards: [] };

for (let i = 1; i < 22; i++) {
    patterns.cards.push({ name: "pattern-" + i, style: "background: url('assets/screenshots/patterns/p" + i + ".jpg')" });
}

export const PatternTemplates = patterns;