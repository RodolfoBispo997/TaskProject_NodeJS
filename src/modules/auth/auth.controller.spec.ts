import { Test, TestingModule } from "@nestjs/testing";
import { mockedUsers } from "../users/users.mocks";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  describe("signUp", () => {
    it("should be able to sign up a new user", async () => {
      const user = mockedUsers[0];

      const mockedResponse = {
        token: "123",
      };

      service.signUp.mockResolvedValue(mockedResponse);

      const response = await controller.signUp(user);

      expect(response).toEqual(mockedResponse);

      expect(service.signUp).toHaveBeenCalledTimes(1);

      expect(service.signUp).toHaveBeenCalledWith(user);
    });

    it("should be able to handle validation errors", async () => {
      const error = new Error("E-mail is required");

      service.signUp.mockRejectedValue(error);

      await expect(
        controller.signUp({
          email: "",
          name: "",
          password: "",
        }),
      ).rejects.toThrow("E-mail is required");
    });
  });

  describe("signIn", () => {
    it("should be able to sign in with the correct credentials", async () => {
      const user = mockedUsers[0];

      const mockedResponse = {
        token: "123",
      };

      service.signIn.mockResolvedValue(mockedResponse);

      const response = await controller.signIn(user);

      expect(response).toEqual(mockedResponse);

      expect(service.signIn).toHaveBeenCalledTimes(1);

      expect(service.signIn).toHaveBeenCalledWith(user);
    });

    it("should be able to handle validation errors", async () => {
      const error = new Error("E-mail is required");

      service.signIn.mockRejectedValue(error);

      await expect(
        controller.signIn({
          email: "",
          password: "",
        }),
      ).rejects.toThrow("E-mail is required");
    });
  });

  describe("forgotPassword", () => {
    it("should be able to request the e-mail to reset the password", async () => {
      const mockedResponse = {
        message: "Password request email sent",
      };

      service.forgotPassword.mockResolvedValue(mockedResponse);

      const response = await controller.forgotPassword({
        email: "john@example.com",
      });

      expect(response).toEqual(mockedResponse);

      expect(service.forgotPassword).toHaveBeenCalledTimes(1);

      expect(service.forgotPassword).toHaveBeenCalledWith("john@example.com");
    });

    it("should be able to handle validation errors", async () => {
      const error = new Error("E-mail is required");

      service.forgotPassword.mockRejectedValue(error);

      await expect(
        controller.forgotPassword({
          email: "",
        }),
      ).rejects.toThrow("E-mail is required");
    });
  });

  describe("resetPassword", () => {
    it("should be able to reset the password from e-mail link", async () => {
      const user = mockedUsers[0];

      service.resetPassword.mockResolvedValue(user);

      const response = await controller.resetPassword({
        newPassword: "123",
        token: "123",
      });

      expect(response).toEqual(user);

      expect(service.resetPassword).toHaveBeenCalledTimes(1);

      expect(service.resetPassword).toHaveBeenCalledWith("123", "123");
    });

    it("should be able to handle validation errors", async () => {
      const error = new Error("Token is required");

      service.resetPassword.mockRejectedValue(error);

      await expect(
        controller.resetPassword({
          token: "",
          newPassword: "",
        }),
      ).rejects.toThrow("Token is required");
    });
  });
});
