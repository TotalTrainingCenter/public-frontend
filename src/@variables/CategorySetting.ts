export interface ICategorySettingForm {
  id: number
  dashboard: boolean
  public: boolean
  onlyCustomer: boolean
  targetCustomerId: number | undefined
}

export const defaultCategorySettingForm = reactive<ICategorySettingForm>({
  id: 0,
  dashboard: false,
  public: false,
  onlyCustomer: false,
  targetCustomerId: undefined,
})
