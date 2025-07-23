import { DynamicDialogRef } from "primeng/dynamicdialog";

export class SafeStack {
    private elements: DynamicDialogRef[] = [];

    //private readonly items: readonly DynamicDialogRef[] = [];

    push(element: DynamicDialogRef): void {
        // Mauvaise pratique car créé des effects de bords
        //this.elements.push(element);

        // Utilisation de la spread operator pour éviter les effets de bord
        this.elements = [element, ...this.elements];

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
      this.elements.map(ref => {
          if (ref) ref.close();
      });
      this.clear();
    }
}
