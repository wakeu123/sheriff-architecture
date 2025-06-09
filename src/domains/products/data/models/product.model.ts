import { City } from "./city-model";

interface ProductDto {
  objet: string;
  reference: string;
  description: string;
  etatCourrier: string;
  city: City | undefined;
  natureCourrier: string;
  prioriteCourrier: string;
  utilisateurCreation: string;
}

export type Product = ProductDto;
