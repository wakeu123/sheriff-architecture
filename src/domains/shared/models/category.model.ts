import { FormControl } from "@angular/forms";

type CategoryDTO = {
  id: number;
  name: string;
  uniqueCode: string;
  description: string;
};

export type Category = CategoryDTO;


export type CategoryAddFormType = {
  name: FormControl<string>;
  description: FormControl<string>;
};
