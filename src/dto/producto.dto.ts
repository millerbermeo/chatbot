import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateProductoDto {

    @IsString({ message: 'El nombre es obligatorio y debe ser una cadena de texto.' })
    nombre: string;

    @IsOptional()
    @IsString({ message: 'la descripcion debe ser una cadena de texto.' })
    descripcion: string;

    @IsInt({ message: 'El precio es obligatorio' })
    precio: number;

    @IsInt({ message: 'La edad debe ser un número entero.' })
    cantidad: number;

    @IsInt({ message: 'La categoria no puede ser nula' })
    categoria_id: number;

    @IsOptional()
    @IsString({ message: 'la foto debe ser una cadena de texto.' })
    imagen: string;

}

export class UpdateProductoDto {

    @IsOptional()
    @IsString({ message: 'El nombre es obligatorio y debe ser una cadena de texto.' })
    nombre: string;

    @IsOptional()
    @IsString({ message: 'la descripcion debe ser una cadena de texto.' })
    descripcion: string;

    @IsOptional()
    @IsInt({ message: 'El precio es obligatorio' })
    precio: number;

    @IsInt({ message: 'La edad debe ser un número entero.' })
    cantidad: number;

    @IsOptional()
    @IsInt({ message: 'La categoria no puede ser nula' })
    categoria_id: number;

    @IsOptional()
    @IsString({ message: 'la foto debe ser una cadena de texto.' })
    imagen: string;

}