export interface SignupFormData {
  firstname: string
  lastname: string
  mobile_no: string
  email: string
  password: string
  c_password: string
  user_proj_id: string
  first_login: number
  user_type: number
}

export interface SignupStore {
  formData: SignupFormData
  errors: Record<string, string>
  setField: (field: keyof SignupFormData, value: string) => void
  validate: () => boolean
  reset: () => void
}

export interface ProjectStore {
    
}

export interface DeviceType {
  dvty_id: number
  dvty_name: string
  dvty_desc: string
  dvty_created_date?: string
  dvty_modified_date?: string | null
  dvty_status: number
  hash_id?: string
}


export interface DeviceTypeState {
  formData: Pick<DeviceType, "dvty_id" | "dvty_name" | "dvty_desc" | "dvty_status">
  deviceTypeData: DeviceType[]
  setFormData: (data: Partial<DeviceTypeState["formData"]>) => void
  resetForm: () => void
  setDeviceTypeData: (data: DeviceType[]) => void
  fetchDeviceTypeData: () => Promise<void>
}