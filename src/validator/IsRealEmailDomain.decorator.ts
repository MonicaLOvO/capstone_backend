import { registerDecorator, ValidationOptions } from "class-validator";
import { IsRealEmailDomainConstraint } from "./IsRealEmailDomainConstraint";

export function IsRealEmailDomain(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsRealEmailDomain",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions ?? {},
      validator: IsRealEmailDomainConstraint,
    });
  };
}

// creates a custom validation decorator for checking if an email domain is real and can receive mail
// Usage example:
// import { IsEmail } from "class-validator";
// import { IsRealEmailDomain } from "../../validator/IsRealEmailDomain.decorator";