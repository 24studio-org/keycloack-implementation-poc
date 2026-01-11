import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { LoginDto, RegisterDto } from './dto';
import { KEYCLOAK_CONFIG } from './config/keycloak.config';

@Injectable()
export class KeycloackService {
  constructor(private readonly httpService: HttpService) {}

  async login(loginDto: LoginDto) {
    try {
      const url = `${KEYCLOAK_CONFIG.BASE_URL}/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/token`;

      const params = new URLSearchParams();
      params.append('grant_type', loginDto.grant_type);
      params.append('client_id', loginDto.client_id);
      params.append('username', loginDto.username);
      params.append('password', loginDto.password);

      const response$ = this.httpService.post(url, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const response = await firstValueFrom(response$);
      return response.data;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Login failed',
          details: error.response?.data,
        },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      // Step 1: Get admin token
      const accessToken = await this.getAdminToken();

      // Step 2: Create user
      const url = `${KEYCLOAK_CONFIG.BASE_URL}/admin/realms/${KEYCLOAK_CONFIG.REALM}/users`;

      const response$ = this.httpService.post(url, registerDto, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const response = await firstValueFrom(response$);

      // Step 3: Extract user ID and fetch user details
      const locationHeader = response.headers?.location;
      const userId = locationHeader?.split('/').pop();

      if (userId) {
        const user = await this.getUserById(userId, accessToken);
        return {
          message: 'User created successfully',
          status: response.status,
          userId,
          user,
        };
      }

      return {
        message: 'User created successfully',
        status: response.status,
        location: locationHeader,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: error.response?.data?.errorMessage || 'Registration failed',
          details: error.response?.data,
        },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getAdminToken(): Promise<string> {
    const tokenUrl = `${KEYCLOAK_CONFIG.BASE_URL}/realms/${KEYCLOAK_CONFIG.MASTER_REALM}/protocol/openid-connect/token`;

    const tokenParams = new URLSearchParams();
    tokenParams.append('grant_type', 'password');
    tokenParams.append('client_id', KEYCLOAK_CONFIG.ADMIN_CLIENT_ID);
    tokenParams.append('username', KEYCLOAK_CONFIG.ADMIN_USERNAME);
    tokenParams.append('password', KEYCLOAK_CONFIG.ADMIN_PASSWORD);

    const tokenResponse$ = this.httpService.post(
      tokenUrl,
      tokenParams.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    const tokenResponse = await firstValueFrom(tokenResponse$);
    return tokenResponse.data.access_token;
  }

  private async getUserById(userId: string, accessToken: string) {
    const getUserUrl = `${KEYCLOAK_CONFIG.BASE_URL}/admin/realms/${KEYCLOAK_CONFIG.REALM}/users/${userId}`;

    const userResponse$ = this.httpService.get(getUserUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userResponse = await firstValueFrom(userResponse$);
    return userResponse.data;
  }
}
