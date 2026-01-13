import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { LoginDto, RegisterDto, CreateRoleDto, AssignRoleDto } from './dto';
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

  async createRole(createRoleDto: CreateRoleDto) {
    try {
      // Step 1: Get admin token
      const accessToken = await this.getAdminToken();

      // Step 2: Get the internal client ID (UUID) from the clientId
      const internalClientId = await this.getClientInternalId(
        createRoleDto.clientId,
        accessToken,
      );

      // Step 3: Create the client role
      const url = `${KEYCLOAK_CONFIG.BASE_URL}/admin/realms/${KEYCLOAK_CONFIG.REALM}/clients/${internalClientId}/roles`;

      const rolePayload = {
        name: createRoleDto.name,
        description: createRoleDto.description || '',
      };

      const response$ = this.httpService.post(url, rolePayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      await firstValueFrom(response$);

      // Step 4: Fetch and return the created role
      const createdRole = await this.getClientRoleByName(
        internalClientId,
        createRoleDto.name,
        accessToken,
      );

      return {
        message: 'Role created successfully',
        role: createdRole,
      };
    } catch (error) {
      throw new HttpException(
        {
          message:
            error.response?.data?.errorMessage || 'Failed to create role',
          details: error.response?.data,
        },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getClientInternalId(
    clientId: string,
    accessToken: string,
  ): Promise<string> {
    const url = `${KEYCLOAK_CONFIG.BASE_URL}/admin/realms/${KEYCLOAK_CONFIG.REALM}/clients?clientId=${clientId}`;

    const response$ = this.httpService.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const response = await firstValueFrom(response$);
    const clients = response.data;

    if (!clients || clients.length === 0) {
      throw new HttpException(
        { message: `Client with clientId '${clientId}' not found` },
        HttpStatus.NOT_FOUND,
      );
    }

    return clients[0].id;
  }

  private async getClientRoleByName(
    internalClientId: string,
    roleName: string,
    accessToken: string,
  ) {
    const url = `${KEYCLOAK_CONFIG.BASE_URL}/admin/realms/${KEYCLOAK_CONFIG.REALM}/clients/${internalClientId}/roles/${roleName}`;

    const response$ = this.httpService.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const response = await firstValueFrom(response$);
    return response.data;
  }

  async assignRole(assignRoleDto: AssignRoleDto) {
    try {
      // Step 1: Get admin token
      const accessToken = await this.getAdminToken();

      // Step 2: Get user ID by username
      const userId = await this.getUserIdByUsername(
        assignRoleDto.username,
        accessToken,
      );

      // Step 3: Get the internal client ID (UUID) from the clientId
      const internalClientId = await this.getClientInternalId(
        assignRoleDto.clientId,
        accessToken,
      );

      // Step 4: Get the role details
      const role = await this.getClientRoleByName(
        internalClientId,
        assignRoleDto.roleName,
        accessToken,
      );

      // Step 5: Assign the role to the user
      const url = `${KEYCLOAK_CONFIG.BASE_URL}/admin/realms/${KEYCLOAK_CONFIG.REALM}/users/${userId}/role-mappings/clients/${internalClientId}`;

      const rolePayload = [
        {
          id: role.id,
          name: role.name,
          description: role.description || '',
          composite: role.composite,
          clientRole: role.clientRole,
          containerId: role.containerId,
        },
      ];

      const response$ = this.httpService.post(url, rolePayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      await firstValueFrom(response$);

      return {
        message: 'Role assigned successfully',
        userId,
        username: assignRoleDto.username,
        role: {
          name: role.name,
          client: assignRoleDto.clientId,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          message:
            error.response?.data?.errorMessage || 'Failed to assign role',
          details: error.response?.data,
        },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getUserIdByUsername(
    username: string,
    accessToken: string,
  ): Promise<string> {
    const url = `${KEYCLOAK_CONFIG.BASE_URL}/admin/realms/${KEYCLOAK_CONFIG.REALM}/users?username=${username}&exact=true`;

    const response$ = this.httpService.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const response = await firstValueFrom(response$);
    const users = response.data;

    if (!users || users.length === 0) {
      throw new HttpException(
        { message: `User with username '${username}' not found` },
        HttpStatus.NOT_FOUND,
      );
    }

    return users[0].id;
  }
}
