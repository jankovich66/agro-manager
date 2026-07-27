import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "src/prisma/prisma.service";
import { METADATA_KEYS } from "../constants/metadata.constant";
import { AuthorizationService } from "src/authorization/authorization.service";
import { FarmRole } from "../constants/roles.constant";
import { AuthRequest } from "src/auth/types/auth-request.type";

@Injectable()
export class FarmRoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly authorizationService: AuthorizationService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<FarmRole[]>(METADATA_KEYS.FARM_ROLES, [
            context.getHandler(),
            context.getClass()
        ]);

        if(!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest<AuthRequest>();

        const { user, params } = request;

        const farmId = params.farmId as string;

        if(!farmId) {
            throw new BadRequestException('Farm id is required.');
        }

        // const membership = await this.prisma.farmMember.findFirst({
        //     where: {
        //         farmId,
        //         userId: user.id,
        //         status: 'ACTIVE'
        //     },
        //     include: {
        //         role: true
        //     }
        // });

        // if(!membership) {
        //     throw new ForbiddenException('You are not a member of this farm.');
        // }

        // const hasPermission = requiredRoles.includes(membership.role.code);

        // if(!hasPermission) {
        //     throw new ForbiddenException('You do not have permission.');
        // }

        const hasRole = await this.authorizationService.hasFarmRole(user.id, farmId, requiredRoles);

        if(!hasRole) {
            throw new ForbiddenException();
        }

        return true;
    }
}