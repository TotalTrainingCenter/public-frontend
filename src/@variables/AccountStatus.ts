export interface IAccountStatusForm {
  id: number
  activated: boolean
  banned: boolean
  banReason: string
  banStartDate: Date | null
  banEndDate: Date | null
}

export const defaultAccountStatusForm = reactive<IAccountStatusForm>({
  id: 0,
  activated: true,
  banned: false,
  banReason: '',
  banStartDate: null,
  banEndDate: null,
})
