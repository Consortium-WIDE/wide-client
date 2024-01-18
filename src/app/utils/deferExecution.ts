//Used to avoid https://angular.io/errors/NG0100
export function deferExecution(fn: () => void): void {
  Promise.resolve().then(fn);
}