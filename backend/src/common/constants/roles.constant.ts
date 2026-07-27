export const FARM_ROLES = {
    OWNER: 'OWNER',
    MANAGER: 'MANAGER',
    OPERATOR: 'OPERATOR',
    VIEWER: 'VIEWER'
} as const;

export type FarmRole = (typeof FARM_ROLES)[keyof typeof FARM_ROLES];
