import { BaseEntity } from "./base-entity.model"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BaseState<T extends BaseEntity> = {
  items: T[],
  newItem: T | null
}
