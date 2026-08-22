import { UserRole, DocumentAccessTier } from '../types';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  VERIFIED_LP: 2,
  PROSPECT_LP: 1,
};

export const hasRoleLevel = (currentRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[requiredRole];
};

export const canAccessDocumentTier = (userRole: UserRole, tier: DocumentAccessTier): boolean => {
  if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
    return true;
  }
  if (tier === 'PUBLIC') {
    return true;
  }
  if (tier === 'PROSPECT_ONLY') {
    return userRole === 'PROSPECT_LP' || userRole === 'VERIFIED_LP';
  }
  if (tier === 'VERIFIED_LP_ONLY') {
    return userRole === 'VERIFIED_LP';
  }
  if (tier === 'INTERNAL_ADMIN') {
    return false;
  }
  return false;
};

export const canPerformAction = (
  userRole: UserRole, 
  action: 'CMS_EDIT' | 'USER_MANAGE' | 'DOCUMENT_UPLOAD' | 'VIEW_AUDIT_TRAIL' | 'DOWNLOAD_CONFIDENTIAL_LP'
): boolean => {
  switch (action) {
    case 'CMS_EDIT':
    case 'USER_MANAGE':
    case 'DOCUMENT_UPLOAD':
    case 'VIEW_AUDIT_TRAIL':
      return userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';
    case 'DOWNLOAD_CONFIDENTIAL_LP':
      return userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' || userRole === 'VERIFIED_LP';
    default:
      return false;
  }
};
