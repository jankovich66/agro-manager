import { FarmDetailsDto } from "../dto/farm-details.dto";
import { FarmListItemDto } from "../dto/farm-list-item.dto";

export class FarmMapper {
    static toListDto(farm: any): FarmListItemDto {
        return {
            id: farm.id,
            name: farm.name,
            country: farm.country,
            city: farm.city,
            memberRole: farm.members[0].role.code,
            fieldCount: farm._count.fields,
            totalArea: Number(farm.fieldsAggregate?._sum?.area ?? 0)
        }
    }

    static toDetailsDto(farm: any): FarmDetailsDto {
        return {
            id: farm.id,
            name: farm.name,
            registrationNumber: farm.registrationNumber,
            taxNumber: farm.taxNumber,
            country: farm.country,
            city: farm.city,
            address: farm.address,
            postalCode: farm.postalCode,
            latitude: farm.latitude ? Number(farm.latitude) : null,
            longitude: farm.longitude ? Number(farm.longitude) : null,
            status: farm.status,
            memberCount: farm._count.members,
            fieldCount: farm._count.fields,
            totalArea: Number(farm.fieldsAggregate?._sum?.area ?? 0),
            createdAt: farm.createdAt,
            updatedAt: farm.updatedAt,
        };
    }
}