export interface PermissionSet {
  view?: boolean;
  edit?: boolean;
  delete?: boolean;
  verify?: boolean; // For pilots only
}

export type PermissionKey = keyof PermissionSet;

export interface AdminPermissions {
  pilots?: PermissionSet;
  enterprises?: PermissionSet;
  objectives?: PermissionSet;
  events?: PermissionSet;
  settings?: PermissionSet;
  audit_log?: PermissionSet;
}

export function hasPermission(
  adminPermissions: AdminPermissions | null | undefined,
  resource: keyof AdminPermissions,
  action: keyof PermissionSet
): boolean {
  if (!adminPermissions) return false;
  const resourcePerms = adminPermissions[resource];
  if (!resourcePerms) return false;
  return resourcePerms[action] === true;
}

export function canView(adminPermissions: AdminPermissions | null | undefined, resource: keyof AdminPermissions): boolean {
  return hasPermission(adminPermissions, resource, 'view');
}

export function canEdit(adminPermissions: AdminPermissions | null | undefined, resource: keyof AdminPermissions): boolean {
  return hasPermission(adminPermissions, resource, 'edit');
}

export function canDelete(adminPermissions: AdminPermissions | null | undefined, resource: keyof AdminPermissions): boolean {
  return hasPermission(adminPermissions, resource, 'delete');
}

export function canVerify(adminPermissions: AdminPermissions | null | undefined): boolean {
  return hasPermission(adminPermissions, 'pilots', 'verify');
}

// Default full permissions for super_admin
export const FULL_PERMISSIONS: AdminPermissions = {
  pilots: { view: true, edit: true, delete: true, verify: true },
  enterprises: { view: true, edit: true, delete: true },
  objectives: { view: true, edit: true, delete: true },
  events: { view: true, edit: true, delete: true },
  settings: { view: true, edit: true },
  audit_log: { view: true },
};

// Default read-only permissions
export const READ_ONLY_PERMISSIONS: AdminPermissions = {
  pilots: { view: true, edit: false, delete: false, verify: false },
  enterprises: { view: true, edit: false, delete: false },
  objectives: { view: true, edit: false, delete: false },
  events: { view: true, edit: false, delete: false },
  settings: { view: true, edit: false },
  audit_log: { view: false },
};
