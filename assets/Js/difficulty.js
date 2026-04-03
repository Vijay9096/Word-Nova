function chooseDifficulty(diff) {
    currentDifficulty = diff;
    localStorage.setItem("currentDifficulty", diff);
    if (!unlockedLevels[diff]) {
        unlockedLevels[diff] = {};
        localStorage.setItem("unlockedLevels", JSON.stringify(unlockedLevels));
    }
    goto("categories");
}
let currentDifficulty = localStorage.getItem("currentDifficulty") || "easy";
const difficulties = ["easy", "normal", "hard"];
for (const d of difficulties) {
    if (!unlockedLevels[d]) unlockedLevels[d] = {};
}
localStorage.setItem("unlockedLevels", JSON.stringify(unlockedLevels));
document.querySelectorAll("#difficulty-buttons button[data-diff]").forEach(btn => {
    btn.addEventListener("click", () => {
        const diff = btn.dataset.diff;
        currentDifficulty = diff;
        localStorage.setItem("currentDifficulty", diff);
        document.querySelectorAll("#difficulty-buttons button[data-diff]")
            .forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        chooseDifficulty(diff);
    });
});
const lastBtn = document.querySelector(`#difficulty-buttons button[data-diff="${currentDifficulty}"]`);
if (lastBtn) lastBtn.classList.add("active");