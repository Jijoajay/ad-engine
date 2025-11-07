export const deviceTypeColumns = [
  { key: "dvty_name", label: "Device Name" },
  { key: "dvty_desc", label: "Description" },
  { key: "dvty_status", label: "Status" },
  { key: "dvty_created_date", label: "Created On", isDate: true },
];

export const projectColumns = [
  { key: "file_url", label: "Project Image", isImage:true },
  { key: "proj_name", label: "Project Name" },
  { key: "proj_slug_name", label: "Slug Name" },
  { key: "proj_desc", label: "Description" },
  { key: "proj_status", label: "Status" },
  { key: "proj_created", label: "Created On", isDate: true },
];

export const mediaTypeColumns = [
  { key: "mdty_name", label: "Media Type Name" },
  { key: "mdty_status", label: "Status" },
  { key: "mdty_created_date", label: "Created On", isDate: true },
];

export const projectPageColumns = [
  { key: "page_name", label: "Page Name" },
  { key: "page_proj_id", label: "Project ID" },
  { key: "page_status", label: "Status" },
  { key: "page_created", label: "Created On", isDate: true },
];

export const mediaDetailColumns = [
    { key: "file_url", label: "Preview", isImage: true },
  { key: "mddt_name", label: "Media Name" },
  { key: "mddt_desc", label: "Description" },
  { key: "mddt_status", label: "Status" },
  { key: "mddt_created_date", label: "Created On", isDate: true },
];

export const deviceColumns = [
  { key: "device_udid", label: "Device UDID" },
  { key: "device_dvty_id", label: "Device Type ID" },
  { key: "device_position", label: "Position" },
  { key: "device_status", label: "Status" },
  { key: "device_created_date", label: "Created On", isDate: true },
];

export const targetTypeColumns = [
  { key: "trgt_name", label: "Target Type Name" },
  { key: "trgt_status", label: "Status" },
  { key: "trgt_created_date", label: "Created On", isDate: true },
];



