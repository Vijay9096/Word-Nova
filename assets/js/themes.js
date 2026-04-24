const THEMES = [
  { name: "DEFAULT", bg: "#1e1e2f", accent: "#4cafef", text: "#ffffff"},
  { name: "DARK", bg: "#121212", accent: "#888888", text: "#f0f0f0"},
  { name: "CLOUD", bg: "#F5F5F5", accent: "#D9D9D9", text: "#000000"},
  { name: "LIGHT", bg: "#ffffff", accent: "#D4D4D4", text: "#f0f0f0"},
  { name: "SAND", bg: "#F4E7C5", accent: "#E8D6A8", text: "#000000"},

  { name: "ICE", bg: "#E0F7FA", accent: "#81D4FA", text: "#000000"},
  { name: "METAL", bg: "#2E2E2E", accent: "#757575", text: "#FFFFFF"},
  { name: "PEACH", bg: "#FFB07C", accent: "#FF8E63", text: "#000000"},
  { name: "MINT", bg: "#98FFDE", accent: "#5FF7D2", text: "#000000"},
  { name: "GREEN", bg: "#00FF00", accent: "#5CFF5F", text: "#ffffff"},

  { name: "CANDY PINK", bg: "#FF69B4", accent: "#FF85C2", text: "#FFFFFF"},
  { name: "SKY", bg: "#87CEEB", accent: "#5BB9E6", text: "#FFFFFF"},
  { name: "LIME", bg: "#32CD32", accent: "#7CFC00", text: "#FFFFFF"},
  { name: "AQUA", bg: "#00FFFF", accent: "#40E0D0", text: "#000000"},
  { name: "RED", bg: "#FF2424", accent: "#ff4d4d", text: "#ffffff"},

  { name: "PURPLE", bg: "#9900FF", accent: "#a270ff", text: "#ffffff"},
  { name: "ORANGE", bg: "#FFA600", accent: "#F2B530", text: "#f0f0f0"},
  { name: "CYAN", bg: "#00FFFB", accent: "#3dd6eb", text: "#ffffff"},
  { name: "OCEAN BLUE", bg: "#0066FF", accent: "#3399FF", text: "#FFFFFF"},
  { name: "COFFEE", bg: "#4E342E", accent: "#795548", text: "#FFFFFF"},

  { name: "GRAPE", bg: "#6A0DAD", accent: "#A64DFF", text: "#FFFFFF"},
  { name: "STEEL BLUE", bg: "#4682B4", accent: "#5F9EA0", text: "#FFFFFF"},
  { name: "VIOLET", bg: "#8F00FF", accent: "#C77DFF", text: "#FFFFFF"},
  { name: "COPPER", bg: "#B87333", accent: "#D99058", text: "#FFFFFF"},
  { name: "STORM", bg: "#2C3E50", accent: "#34495E", text: "#FFFFFF"},

  { name: "YELLOW", bg: "#FFFF00", accent: "#ffde59", text: "#ffffff"},
  { name: "SKY BLUE", bg: "#00F7FF", accent: "#00AAFF", text: "#f0f0f0"},
  { name: "SUNSET", bg: "#FF5733", accent: "#FFC300", text: "#FFFFFF"},
  { name: "VIVID BLUE", bg: "#007BFF", accent: "#339CFF", text: "#ffffff" },
  { name: "VIVID GREEN", bg: "#00C853", accent: "#5CFF85", text: "#ffffff" },

  { name: "VIVID RED", bg: "#FF1744", accent: "#FF5252", text: "#ffffff" },
  { name: "ROSE RED", bg: "#FF0048", accent: "#FF5C8D", text: "#FFFFFF"},
  { name: "VIVID ORANGE", bg: "#FF9100", accent: "#FFB74D", text: "#ffffff" },
  { name: "VIVID YELLOW", bg: "#FFEA00", accent: "#FFFF33", text: "#000000" },
  { name: "NEON GREEN", bg: "#00FF00", accent: "#39FF14", text: "#000000"},

  { name: "FIRE", bg: "#FF4500", accent: "#FF7F24", text: "#FFFFFF"},
  { name: "BLOOD RED", bg: "#8A0303", accent: "#CC0000", text: "#FFFFFF"},
  { name: "TOXIC", bg: "#B8FF00", accent: "#D4FF4A", text: "#000000"},
  { name: "FOREST", bg: "#054A29", accent: "#0FA85F", text: "#FFFFFF"},
  { name: "MIDNIGHT", bg: "#0A0A0A", accent: "#1F1F1F", text: "#FFFFFF"},

  { name: "VIVID PURPLE", bg: "#AA00FF", accent: "#C266FF", text: "#ffffff" },
  { name: "VIVID PINK", bg: "#FF4081", accent: "#FF80AB", text: "#ffffff" },
  { name: "VIVID CYAN", bg: "#00E5FF", accent: "#33FFFF", text: "#000000" },
  { name: "VIVID LIME", bg: "#AEEA00", accent: "#CDFF33", text: "#000000" },
  { name: "AURORA", bg: "#3A0CA3", accent: "#7209B7", text: "#FFFFFF"},

  { name: "DARK EMERALD", bg: "#003B2A", accent: "#007F5F", text: "#FFFFFF"},
  { name: "VIVID TEAL", bg: "#00BFA5", accent: "#40E0D0", text: "#ffffff" },
  { name: "VIVID SKY", bg: "#00C4FF", accent: "#33D4FF", text: "#ffffff" },
  { name: "VIVID MAGENTA", bg: "#E040FB", accent: "#EA80FC", text: "#ffffff" },
  { name: "VIVID GOLD", bg: "#FFB300", accent: "#FFD54F", text: "#000000" },

  { name: "SPACE", bg: "#1B0036", accent: "#4B0082", text: "#FFFFFF"},
  { name: "CYBER", bg: "#020F24", accent: "#00E5FF", text: "#FFFFFF"},
  { name: "VIVID AQUA", bg: "#00FFFF", accent: "#66FFFF", text: "#000000" },
  { name: "GOLD", bg: "#FFD700", accent: "#FFEA70", text: "#000000"},
  { name: "ARCTIC", bg: "#A8EFFF", accent: "#74D4FF", text: "#000000"},

  { name: "TROPICAL", bg: "#00D1A0", accent: "#4FFFD3", text: "#000000"},
  { name: "DESERT", bg: "#EDC9AF", accent: "#E3B98E", text: "#000000"},
  { name: "JUNGLE", bg: "#1B5E20", accent: "#4CAF50", text: "#FFFFFF"},
  { name: "MIDNIGHT BLUE", bg: "#001F3F", accent: "#003F7F", text: "#FFFFFF"},
  { name: "CHARCOAL", bg: "#222222", accent: "#555555", text: "#FFFFFF"},

  { name: "TEA GREEN", bg: "#D0F0C0", accent: "#A6D99B", text: "#000000"},
  { name: "SEAFOAM", bg: "#9FFFE0", accent: "#5FFFD4", text: "#000000"},
  { name: "CORAL", bg: "#FF7F50", accent: "#FFA78A", text: "#000000"},
  { name: "PLUM", bg: "#8E4585", accent: "#C774C5", text: "#FFFFFF"},
  { name: "EMERALD", bg: "#008F39", accent: "#00C45A", text: "#FFFFFF"},

  { name: "SAPPHIRE", bg: "#08457E", accent: "#0F6ABD", text: "#FFFFFF"},
  { name: "RUBY", bg: "#9B111E", accent: "#D7263D", text: "#FFFFFF"},
  { name: "AMETHYST", bg: "#9966CC", accent: "#B689FF", text: "#FFFFFF"},
  { name: "ONYX", bg: "#353839", accent: "#5A5D5E", text: "#FFFFFF"},
  { name: "MANGO", bg: "#FFCC4D", accent: "#FFA90A", text: "#000000" },

  { name: "GUM", bg: "#FFB3DA", accent: "#FF7BC3", text: "#000000" },
  { name: "GHOST MINT", bg: "#E9FFF9", accent: "#C4FDEB", text: "#000000" },
  { name: "BREEZE", bg: "#F2FAFF", accent: "#D2ECFF", text: "#000000" },
  { name: "OCEAN GLASS", bg: "#D6F4FF", accent: "#A2E6FF", text: "#000000" },
  { name: "PEARL", bg: "#F2F1EF", accent: "#DCD9D4", text: "#000000"},

  { name: "MOONGREY", bg: "#F1F1F5", accent: "#C7C7D3", text: "#000000" },
  { name: "CRYMINT", bg: "#C8FFE3", accent: "#7FFFD4", text: "#000000" },
  { name: "SEASHELL", bg: "#FFE6DF", accent: "#FFC8BC", text: "#000000" },
  { name: "MINT", bg: "#D9FFF8", accent: "#A5EDE1", text: "#000000" },
  { name: "GUMDROP", bg: "#C3FFB4", accent: "#7AE582", text: "#000000" },

  { name: "POWDER", bg: "#DAEFFF", accent: "#A8D8FF", text: "#000000" },
  { name: "ICEBERG", bg: "#F8FFFF", accent: "#D7F2FF", text: "#000000" },
  { name: "DUCK", bg: "#FFEB3B", accent: "#FFC400", text: "#000000" },
  { name: "AUROSE", bg: "#FFDBEC", accent: "#FF9BCB", text: "#000000" },
  { name: "CPEACH", bg: "#FFD1BD", accent: "#FF9F80", text: "#000000" },

  { name: "IVORY", bg: "#FFFFF0", accent: "#ECE6C8", text: "#000000"},
  { name: "FROSTBITE", bg: "#D8F6FF", accent: "#90D9FF", text: "#000000" },
  { name: "PEARL", bg: "#FFF0F6", accent: "#FFC7DE", text: "#000000" },
  { name: "SILVER", bg: "#C0C0C0", accent: "#D9D9D9", text: "#000000"},
  { name: "PIXEL", bg: "#003300", accent: "#00CC00", text: "#FFFFFF" },

  { name: "SOFT GOLD", bg: "#FFF7D1", accent: "#FFE07E", text: "#000000" },
  { name: "TURQ", bg: "#C7FFF8", accent: "#74F2CE", text: "#000000" },
  { name: "LILAC", bg: "#EFE1FF", accent: "#D6B8FF", text: "#000000" },
  { name: "LEMON", bg: "#F7FF9D", accent: "#E5FF57", text: "#000000" },
  { name: "GLACIAL", bg: "#CFEFFF", accent: "#9FD6FF", text: "#000000" },

  { name: "LAVENDER", bg: "#E6E6FA", accent: "#BFA2DB", text: "#000000" },
  { name: "STARDUST", bg: "#FFFFFF", accent: "#EDEDED", text: "#000000" },
  { name: "PLATINUM", bg: "#E0E0E0", accent: "#B5B5B5", text: "#000000" },
  { name: "HAZE PURPLE", bg: "#C7B4E3", accent: "#A48CC7", text: "#000000" },
  { name: "BLUEBERRY ICE", bg: "#E3E6FF", accent: "#AAB3FF", text: "#000000" },

  { name: "BRONZE", bg: "#CD7F32", accent: "#E5A05D", text: "#FFFFFF"},
  { name: "LUNARPEARL", bg: "#F3F4F6", accent: "#D9DCE1", text: "#000000" },
  { name: "BRICK RED", bg: "#8C1C13", accent: "#BF3B30", text: "#FFFFFF"},
  { name: "OLIVE", bg: "#556B2F", accent: "#7A8F3A", text: "#FFFFFF"},
  { name: "SAKURA", bg: "#F9D5E5", accent: "#F28DB2", text: "#000000" },

  { name: "NAVY", bg: "#001833", accent: "#003366", text: "#FFFFFF" },
  { name: "FOREST MOSS", bg: "#3A4F2D", accent: "#557A44", text: "#FFFFFF"},
  { name: "GRAFMIST", bg: "#3C3F45", accent: "#6B6E75", text: "#FFFFFF" },
  { name: "ASH GREY", bg: "#B2BEB5", accent: "#CED5D0", text: "#000000"},
  { name: "STEEL GREY", bg: "#71797E", accent: "#9EA4A8", text: "#FFFFFF"},

  { name: "PINKMETAL", bg: "#FFD0E8", accent: "#FF8DCB", text: "#000000" },
  { name: "ORBITGRAY", bg: "#2D2F36", accent: "#5A5D65", text: "#FFFFFF" },
  { name: "COBALT", bg: "#0047AB", accent: "#3A74D6", text: "#FFFFFF"},
  { name: "SANDSTONE", bg: "#D8B47A", accent: "#F1CE96", text: "#000000" },
  { name: "NIGHT SKY", bg: "#00111F", accent: "#003355", text: "#FFFFFF" },

  { name: "TWILIGHTSEA", bg: "#013A4A", accent: "#02788B", text: "#FFFFFF" },
  { name: "TEAL BLUE", bg: "#008080", accent: "#33A3A3", text: "#FFFFFF"},
  { name: "CARAMEL", bg: "#8C6338", accent: "#D0A373", text: "#FFFFFF" },
  { name: "MIDCYAN", bg: "#00252E", accent: "#00A7B3", text: "#FFFFFF" },
  { name: "FERN", bg: "#1B3B1A", accent: "#447A44", text: "#FFFFFF" },

  { name: "TANGERINE", bg: "#FF8A3D", accent: "#FF6A00", text: "#000000" },
  { name: "SUN", bg: "#FFEC66", accent: "#FFD23F", text: "#000000" },
  { name: "AQUA STEEL", bg: "#1C2E3A", accent: "#4DB6AC", text: "#FFFFFF" },
  { name: "VINTAGE BLUE", bg: "#A2CFFE", accent: "#78B5FF", text: "#000000"},
  { name: "GRAPHITE", bg: "#111113", accent: "#292A2E", text: "#FFFFFF" },

  { name: "SUNRISE", bg: "#FFB347", accent: "#FFD27F", text: "#000000"},
  { name: "DUSK", bg: "#4B3F72", accent: "#7F6DA0", text: "#FFFFFF"},
  { name: "DAWN", bg: "#FFE4C4", accent: "#FFD2A1", text: "#000000"},
  { name: "ARC SHADOW", bg: "#0E1E2E", accent: "#2F4C6E", text: "#FFFFFF" },
  { name: "HONEY", bg: "#FFC30B", accent: "#FFD95A", text: "#000000"},

  { name: "FIREBRICK", bg: "#B22222", accent: "#D44747", text: "#FFFFFF"},
  { name: "SUNCORE", bg: "#FF6A00", accent: "#FFC72C", text: "#000000" },
  { name: "MOCHA", bg: "#3C2F2F", accent: "#6F4E37", text: "#FFFFFF"},
  { name: "MIDNIGHT GREEN", bg: "#004953", accent: "#006F75", text: "#FFFFFF"},
  { name: "OLYMPIC BLUE", bg: "#0080FF", accent: "#4DA6FF", text: "#FFFFFF"},

  { name: "DARKWOOD", bg: "#0D1F0A", accent: "#395723", text: "#FFFFFF" },
  { name: "TIDAL", bg: "#0A4F41", accent: "#1AA57C", text: "#FFFFFF" },
  { name: "VELVET PURPLE", bg: "#800080", accent: "#B266B2", text: "#FFFFFF"},
  { name: "SUNPURPLE", bg: "#3D0066", accent: "#A64DFF", text: "#FFFFFF" },
  { name: "EMBER", bg: "#330000", accent: "#FF3D00", text: "#FFFFFF" },

  { name: "CHERRY", bg: "#990012", accent: "#FF3355", text: "#FFFFFF" },
  { name: "INDISHADOW", bg: "#140A33", accent: "#2C1A69", text: "#FFFFFF" },
  { name: "CRIMSON", bg: "#4B0000", accent: "#D10000", text: "#FFFFFF" },
  { name: "GOLDENROD", bg: "#DAA520", accent: "#F4C542", text: "#000000"},
  { name: "VIOLEDGE", bg: "#5A00A1", accent: "#B400FF", text: "#FFFFFF" },

  { name: "RASPBERRY", bg: "#B0005A", accent: "#FF1D8E", text: "#FFFFFF" },
  { name: "EMERALD SEA", bg: "#002F2F", accent: "#007F7F", text: "#FFFFFF" },
  { name: "TEAL", bg: "#002B36", accent: "#2AA198", text: "#FFFFFF" },
  { name: "SAPPSHADOW", bg: "#001B40", accent: "#003C8F", text: "#FFFFFF" },
  { name: "BLUEBERRY", bg: "#2E236C", accent: "#4F3EBF", text: "#FFFFFF" },

  { name: "CHAMPAGNE", bg: "#F7E7CE", accent: "#F2D7B5", text: "#000000"},
  { name: "OCEAN", bg: "#012E40", accent: "#026773", text: "#FFFFFF" },
  { name: "ARCTIC", bg: "#001F29", accent: "#005F73", text: "#FFFFFF" },
  { name: "BURGUNDY", bg: "#800020", accent: "#A63343", text: "#FFFFFF"},
  { name: "CYBERBERRY", bg: "#31002F", accent: "#D100BA", text: "#FFFFFF" },

  { name: "MAROON", bg: "#800000", accent: "#B03030", text: "#FFFFFF"},
  { name: "WINE", bg: "#722F37", accent: "#A04552", text: "#FFFFFF"},
  { name: "LILAC", bg: "#C8A2C8", accent: "#E1C4E1", text: "#000000"},
  { name: "PEACH FIZZ", bg: "#FFCCB3", accent: "#FFB199", text: "#000000"},
  { name: "CREAM", bg: "#FFFDD0", accent: "#F2E6B4", text: "#000000"},

  { name: "LATTE", bg: "#C5A880", accent: "#DDB892", text: "#000000"},
  { name: "MINT JULEP", bg: "#F1FFDA", accent: "#D3F7A5", text: "#000000"},
  { name: "GHOST WHITE", bg: "#F8F8FF", accent: "#E8E8FF", text: "#000000"},
  { name: "SLATE BLUE", bg: "#6A5ACD", accent: "#8974FF", text: "#FFFFFF"},
  { name: "COASTAL TEAL", bg: "#2BB6A8", accent: "#62D8C8", text: "#FFFFFF"},

  { name: "CYBER YLW", bg: "#0A0A0A", accent: "#E6FF00", text: "#FFFFFF" },
  { name: "GALAXY", bg: "#2B002E", accent: "#FF2EC4", text: "#FFFFFF" },
  { name: "CYAN XR", bg: "#001E26", accent: "#00F0FF", text: "#FFFFFF" },
  { name: "NEON PURPLE", bg: "#21003A", accent: "#BF00FF", text: "#FFFFFF" },
  { name: "AUBERGINE", bg: "#1A0016", accent: "#5A006A", text: "#FFFFFF" },

  { name: "GOLD FX", bg: "#FFE087", accent: "#FFCD47", text: "#000000" },
  { name: "ROYAL", bg: "#0A0033", accent: "#2D00A1", text: "#FFFFFF" },
  { name: "NEBULA", bg: "#0B0121", accent: "#4A148C", text: "#FFFFFF" },
  { name: "LIGHT BLUE", bg: "#3DD9BA", accent: "#45D6A8", text: "#FFFFFF" }
];
const THEME_PRICES = {
"DARK": 120,"CLOUD": 120,"LIGHT": 120,"SAND": 120,"ICE": 130,"METAL": 130,"PEACH": 130,"MINT": 130,"GREEN": 140,"CANDY PINK": 140,"SKY": 140,"LIME": 140,"AQUA": 140,"RED": 150,"PURPLE": 150,"ORANGE": 150,"CYAN": 150,"OCEAN BLUE": 150,"COFFEE": 150,"GRAPE": 150,"STEEL BLUE": 150,"VIOLET": 150,"COPPER": 150,"STORM": 150,"YELLOW": 160,"SKY BLUE": 160,"SUNSET": 160,
"VIVID BLUE": 170,"VIVID GREEN": 170,"VIVID RED": 170,"ROSE RED": 170,"VIVID ORANGE": 180,"VIVID YELLOW": 180,"NEON GREEN": 180,"FIRE": 180,"BLOOD RED": 180,"TOXIC": 180,"FOREST": 180,"MIDNIGHT": 180,"VIVID PURPLE": 190,"VIVID PINK": 190,"VIVID CYAN": 200,"VIVID LIME": 200,"AURORA": 200,"DARK EMERALD": 200,"VIVID TEAL": 210,"VIVID SKY": 210,"VIVID MAGENTA": 220,
"VIVID GOLD": 220,"SPACE": 220,"CYBER": 220,"VIVID AQUA": 230,"GOLD": 230,"ARCTIC": 240,"TROPICAL": 240,"DESERT": 240,"JUNGLE": 250,"MIDNIGHT BLUE": 250,"CHARCOAL": 250,"TEA GREEN": 260,"SEAFOAM": 260,"CORAL": 260,"PLUM": 270,"EMERALD": 270,"SAPPHIRE": 270,"RUBY": 280,"AMETHYST": 280,"ONYX": 280,"MANGO": 280,"GUM": 280,"GHOST MINT": 280,"BREEZE": 280,"OCEAN GLASS": 280,
"PEARL": 280,"MOONGREY": 280,"CRYMINT": 280,"SEASHELL": 280,"MINT": 280,"GUMDROP": 280,"POWDER": 280,"ICEBERG": 280,"DUCK": 290,"AUROSE": 290,"CPEACH": 290,"IVORY": 290,"FROSTBITE": 290,"PEARL": 290,"SILVER": 290,"PIXEL": 290,"SOFT GOLD": 290,"TURQ": 290,"LILAC": 290,"LEMON": 290,"GLACIAL": 290,"LAVENDER": 300,"STARDUST": 300,"PLATINUM": 300,"HAZEPURPLE": 300,
"BLUEBERRY ICE": 300,"BRONZE": 300,"LUNARPEARL": 300,"BRICK RED": 300,"OLIVE": 300,"SAKURA": 300,"NAVY": 310,"FOREST MOSS": 310,"GRAFMIST": 310,"ASH GREY": 310,"STEEL GREY": 310,"PINKMETAL": 310,"ORBITGRAY": 310,"COBALT": 320,"SANDSTONE": 320,"NIGHT SKY": 320,"TWILIGHTSEA": 320,"TEAL BLUE": 320,"CARAMEL": 320,"MIDCYAN": 320,"FERN": 320,"TANGERINE": 320,"SUN": 320,
"AQUA STEEL": 320,"VINTAGE BLUE": 320,"GRAPHITE": 320,"SUNRISE": 330,"DUSK": 330,"DAWN": 330,"ARC SHADOW": 330,"HONEY": 340,"FIREBRICK": 340,"SUNCORE": 340,"MOCHA": 340,"MIDNIGHT GREEN": 350,"OLYMPIC BLUE": 350,"DARKWOOD": 350,"TIDAL": 350,"VELVET PURPLE": 350,"SUNPURPLE": 360,"EMBER": 360,"CHERRY": 360,"INDISHADOW": 360,"CRIMSON": 360,"GOLDENROD": 360,"VIOLEDGE": 360,
"RASPBERRY": 360,"EMERALD SEA": 360,"TEAL": 360,"SAPPSHADOW": 360,"BLUEBERRY": 360,"CHAMPAGNE": 360,"OCEAN": 360,"ARCTIC": 360,"BURGUNDY": 360,"CYBERBERRY": 360,"MAROON": 370,"WINE": 370,"LILAC": 370,"PEACH FIZZ": 380,"CREAM": 380,"LATTE": 380,"MINT JULEP": 390,"GHOST WHITE": 390,"SLATE BLUE": 390,"COASTAL TEAL": 400,"CYBER YLW": 420,"GALAXY": 420,"CYAN XR": 420,
"NEON PURPLE": 420,"AUBERGINE": 420,"GOLD FX": 420,"ROYAL": 420,"NEBULA": 430,"LIGHT BLUE": 430
};
function renderThemes() {
  const grid = document.getElementById("theme-grid");
  if (!grid) return;
  grid.innerHTML = "";
  const unlockedThemes = JSON.parse(localStorage.getItem("unlockedThemes") || "[]");
  if (!unlockedThemes.includes("DEFAULT")) unlockedThemes.push("DEFAULT");
  THEMES.forEach((t, i) => {
    const btn = document.createElement("button");
    const isUnlocked = unlockedThemes.includes(t.name);
    btn.textContent = isUnlocked
      ? `✅ ${t.name}`
      : `🔒 ${t.name}-${THEME_PRICES[t.name]}⭐`;
    btn.style.background = t.accent;
    btn.style.color = t.text;
    btn.style.opacity = isUnlocked ? "1" : "0.5";
    btn.style.transition = "transform 0.2s ease, opacity 0.3s ease";
    if (isUnlocked) {
      btn.onclick = () => applyTHEME(i);
      btn.onmouseenter = () => (btn.style.transform = "scale(1.05)");
      btn.onmouseleave = () => (btn.style.transform = "scale(1)");
    } else {
      btn.onclick = () => alert(`Unlock this theme in the Shop first!`);
    }
    grid.appendChild(btn);
  });
}
window.addEventListener("load", renderThemes);
function applyTHEME(index) {
  const t = THEMES[index];
  localStorage.setItem("theme", index);
  document.documentElement.style.setProperty("--bg", t.bg);
  document.documentElement.style.setProperty("--accent", t.accent);
  document.documentElement.style.setProperty("--text", t.text);
  document.body.style.backgroundColor = t.bg;
  document.body.style.color = t.text;
  document.querySelectorAll(".screen").forEach(s => {
    s.style.backgroundColor = t.bg;
    s.style.color = t.text;
  });
  const grid = document.getElementById("grid");
  if (grid) {
    grid.style.backgroundColor = t.name === "DEFAULT" ? "rgba(255,255,255,0.05)" : t.accent;
  }
  const wordList = document.getElementById("word-list");
  if (wordList) {
    const items = wordList.querySelectorAll(".word-item");
    items.forEach(item => {
      if (t.name === "DEFAULT") {
        item.style.backgroundColor = "rgba(255,255,255,0.1)";
        item.style.color = "#ffffff";
      } else {
        item.style.backgroundColor = t.accent;
        item.style.color = t.text;
      }
    });
  }
  const profileBox = document.getElementById("profile-container");
  if (profileBox) {
    if (t.name === "DEFAULT") {
      profileBox.style.backgroundColor = "rgba(255,255,255,0.05)";
    } else {
      profileBox.style.backgroundColor = t.accent;
    }
  }
  if (typeof updateProfileScreen === "function") updateProfileScreen();
}
function loadTHEME() {
  const saved = localStorage.getItem("theme");
  if (saved !== null && THEMES[Number(saved)]) {
    applyTHEME(Number(saved));
  } else {
    applyTHEME(0);
  }
}
document.addEventListener("DOMContentLoaded", loadTHEME);