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

export type ProductRequest = {
  name: string;
  description: string;
};

export type ProductResponse = {
  id: number;
  name: string;
  uniqueCode: string;
  description: string;
};

export type Order = 'ASC' | 'DESC';
