import { DynamicDialogRef } from "primeng/dynamicdialog";

export class SafeStack<T> {
    private elements: T[] = [];

    push(element: T): void {
        this.elements.push(element);
    }

    pop(): T {
        if (this.isEmpty()) {
            throw new Error("Stack is empty");
        }
        return this.elements.pop() as T;
    }

    peek(): T {
        if (this.isEmpty()) {
            throw new Error("Stack is empty");
        }
        return this.elements[this.elements.length - 1];
    }

    isEmpty(): boolean {
        return this.elements.length === 0;
    }

    size(): number {
        return this.elements.length;
    }

    private clear(): void {
        this.elements = [];
    }

    closeAllRefs(): void {
      this.elements.forEach(ref => {
          if (ref && ref instanceof DynamicDialogRef) {
            ref.close();
          }
      });
      this.clear();
    }
}
