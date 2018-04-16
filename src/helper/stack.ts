const stack: any[] = [];
const MAX_STACK_LENGTH: number = 999;

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
  }
  throw new Error('Stack is empty');
}

export function sTop<T>(): T {
  if (!sIsEmpty()) {
    return stack[stack.length - 1];
  }
  throw new Error('Stack is empty');
}

export function sBottom<T>(): T {
  if (!sIsEmpty()) {
    return stack[0];
  }
  throw new Error('Stack is empty');
}

export function sIsEmpty(): boolean {
  return stack.length === 0;
}
