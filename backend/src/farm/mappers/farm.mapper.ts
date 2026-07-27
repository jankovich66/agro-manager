import { Farm } from "@prisma/client";
import { FarmResponseDto } from "../dto/farm-response.dto";

export class FarmMapper {
    static toResponse(farm: Farm): FarmResponseDto {
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
            createdAt: farm.createdAt,
            updatedAt: farm.updatedAt,
        }
    }
}