const stack = [];
const MAX_STACK_LENGTH = 999;

export function sPush<T>(item: T): void {
  if (stack.length < MAX_STACK_LENGTH) {
    stack.push(item);
  } else {
    throw new Error('Stack overflow');
  }
}

export function sPop<T>(): T {
  if (!sIsEmpty()) {
    return stack.pop();
  } else {
    throw new Error('Stack is empty');
  }
}

export function sTop<T>(): T {
  return sIsEmpty() ? null : stack[stack.length - 1];
}

export function sBottom<T>(): T {
  return sIsEmpty() ? null : stack[0];
}

export function sIsEmpty(): boolean {
  return stack.length === 0;
}
