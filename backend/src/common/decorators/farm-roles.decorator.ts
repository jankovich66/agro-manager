import { SetMetadata } from "@nestjs/common";
import { FarmRole } from "../constants/roles.constant";
import { METADATA_KEYS } from "../constants/metadata.constant";

export const FarmRoles = (...roles: FarmRole[]) => SetMetadata(METADATA_KEYS.FARM_ROLES, roles);
