
const patterns: any = { name: "Pastel Colors", cards: [] };

const colors = ['#41d8ca', '#c7e3e5', '#f4f3d4', '#f9d7c5', '#f4a2a9', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#1b85b8', '#5a5255', '#559e83', '#ae5a41', '#c3cb71'];
for (let i = 0; i < colors.length; i++) {
    patterns.cards.push({ name: "pastel-" + i, style: "background: " + colors[i] + ";", textStyles: 'color: #ffffff;' });
}

export const PastelTemplates = patterns;