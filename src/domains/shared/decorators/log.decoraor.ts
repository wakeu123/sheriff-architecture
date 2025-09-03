import { Observable, tap } from "rxjs";

export function Log(): MethodDecorator {

  return function (target: unknown, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    //console.log('Target :', target);
    //console.log('Method name :', propertyKey);
    //console.log('Descriptor :', descriptor);
    //console.log('Original method :', descriptor);

    descriptor.value = function (...args: unknown[]) {

      console.log(`Request name : ${propertyKey as string}(${args[0]})`)
      console.log(`Arguments ${JSON.stringify(args)} were passed in.`);

      const result = originalMethod.apply(this, args);

      if(!(result instanceof Observable)) throw new Error(`The method ${propertyKey as string} must return an instance of Observable to be tracked.`);

      console.log(`Result ${result}`);
      return result.pipe(
        tap(() => console.log('****************************'))
      );
    }

    return descriptor;
  };
}
