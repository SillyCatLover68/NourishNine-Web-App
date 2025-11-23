export function getProgress(): Record<string, number> {
  try {
    const raw = localStorage.getItem('nutrientProgress');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function setProgress(progress: Record<string, number>) {
  localStorage.setItem('nutrientProgress', JSON.stringify(progress));
  // notify components
  window.dispatchEvent(new Event('nutrientsUpdated'));
}

export function addProgress(amounts: Record<string, number> | undefined) {
  if (!amounts) return;
  const progress = getProgress();
  Object.keys(amounts).forEach(k => {
    const v = amounts[k] || 0;
    progress[k] = (progress[k] || 0) + v;
  });
  setProgress(progress);
}

export function subtractProgress(amounts: Record<string, number> | undefined) {
  if (!amounts) return;
  const progress = getProgress();
  Object.keys(amounts).forEach(k => {
    const v = amounts[k] || 0;
    progress[k] = Math.max(0, (progress[k] || 0) - v);
  });
  setProgress(progress);
}

export function resetProgress() {
  localStorage.removeItem('nutrientProgress');
  window.dispatchEvent(new Event('nutrientsUpdated'));
}
