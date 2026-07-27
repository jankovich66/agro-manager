import { Injectable } from '@nestjs/common';
import { FarmRole } from 'src/common/constants/roles.constant';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthorizationService {
    constructor(private readonly prisma: PrismaService) {}

    async getMembership(userId: string, farmId: string) {
        return this.prisma.farmMember.findFirst({
            where: {
                userId,
                farmId,
                status: 'ACTIVE'
            },
            include: {
                role: true
            }
        })
    }

    async hasFarmRole(userId: string, farmId: string, roles: FarmRole[]) {
        const membership = await this.getMembership(userId, farmId);

        if(!membership) {
            return false;
        }

        return roles.includes(membership.role.code as FarmRole);
    }
}
