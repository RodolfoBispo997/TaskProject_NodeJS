import { Test, TestingModule } from "@nestjs/testing";
import { ClientProxy } from "@nestjs/microservices";
import { EMAIL_SERVICE, SEND_PASSWORD_RESET } from "../../consts";
import { MailService } from "./mail.service";

describe("MailService", () => {
  let service: MailService;

  const mockClientProxy = {
    connect: jest.fn(),
    emit: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: EMAIL_SERVICE,
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it("should be able to send the forgot password e-mail", async () => {
    await service.sendPasswordRequest("email@test.com", "token-123");

    expect(mockClientProxy.connect).toHaveBeenCalledTimes(1);

    expect(mockClientProxy.emit).toHaveBeenCalledWith(SEND_PASSWORD_RESET, {
      email: "email@test.com",
      url: "http://localhost:3000/v1/auth/reset-password?token=token-123",
    });
  });
});
