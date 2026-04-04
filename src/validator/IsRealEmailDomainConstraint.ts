import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { resolveMx } from "dns/promises";

@ValidatorConstraint({ name: "IsRealEmailDomain", async: true })
export class IsRealEmailDomainConstraint
  implements ValidatorConstraintInterface
{
  async validate(email: string, _args: ValidationArguments): Promise<boolean> {
    if (!email || typeof email !== "string") return false;
    // Basic check to ensure there's an '@' and a domain part

    const parts = email.split("@");
    if (parts.length !== 2) return false;
    // Extract the domain part and check for MX records

    const domain = parts[1]?.trim().toLowerCase();
    if (!domain) return false;

    try {
      const mxRecords = await resolveMx(domain);
      return mxRecords.length > 0;
    } catch {
      return false;
    }
  }

  defaultMessage(_args: ValidationArguments): string {
    return "Email domain cannot receive email";
  }
}