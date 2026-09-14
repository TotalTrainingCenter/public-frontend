export interface IInformation {
  id: number
  attributes: IInformationAttribute[]
  createdAt?: string
  updatedAt?: string
}

export interface IInformationAttribute {
  attributeKey: string
  attributeValue: string
  createdAt?: string
  updatedAt?: string
}
