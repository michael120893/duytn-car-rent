import { IsEmail, IsEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    // @IsPhoneNumber()
    phone: string;

    @IsOptional()
    @IsString()
    avatar_url?: string;
}
