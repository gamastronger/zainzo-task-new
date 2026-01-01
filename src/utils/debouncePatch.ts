// src/utils/debouncePatch.ts

export function debounce<F extends (...args: never[]) => void>(
  fn: F,
  delay = 500
) {
  let timer: number | undefined;

  return (...args: Parameters<F>) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}
