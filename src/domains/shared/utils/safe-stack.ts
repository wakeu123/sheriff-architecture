import { DynamicDialogRef } from "primeng/dynamicdialog";

export class SafeStack {
    private elements: DynamicDialogRef[] = [];

    push(element: DynamicDialogRef): void {
        this.elements.push(element);
    }

    pop(): DynamicDialogRef {
        if (this.isEmpty()) {
            throw new Error("Stack is empty");
        }
        return this.elements.pop() as DynamicDialogRef;
    }

    peek(): DynamicDialogRef {
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
          if (ref) ref.close();
      });
      this.clear();
    }
}
