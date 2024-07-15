import { z } from "zod";
import { FieldValues } from "react-hook-form";
import { FieldType } from "../model";
export const messages = {
  passwordOneUppercase: `The Password must contain at least one uppercase character`,
  passwordOneLowercase: `The Password must contain at least one lowercase character`,
  passwordOneNumeric: `The password must contain at least one numerical character.`,
  passwordRequired: "Password is required",
  passwordLengthMin: "Password must be at least 6 characters",
  passwordLengthMax: `Password can't be more than 32 characters`,
  newPasswordRequired: "New Password is required",
  newPasswordLength: "New Password must be at least 6 characters",
  confirmPasswordRequired: "Confirm Password is required",
  passwordsDidNotMatch: "Passwords don't match",
  emailIsRequired: "Email address is required",
  invalidEmail: "Invalid email address",
  errorSendingEmail: "Error sending email",
  emailSentSuccessfully: "Your email has been sent successfulldy.",
};
export type ConditionType = keyof typeof validation | CustomValidation;

type CustomValidation = (value: string | number | string[]) => string | null;

interface CustomValidationResult {
  isValid: (value: string | number) => boolean;
  message: (value: string | number) =>
    | any
    | {
        message: string | null;
      };
}

const validation = {
  required: () => z.string().nonempty("This field is required"),
  "required-multi-select": () =>
    z.array(z.string()).nonempty("This field is required"),
  number: () =>
    z.coerce
      .number()
      .int()
      .min(1, { message: "Invalid number must be greater than 0" }),
  age: () =>
    z.coerce
      .number()
      .int()
      .min(18, {
        message:
          "At least one passenger must be greater than or equal to 18 years old",
      })
      .max(1000)
      .optional(),
  email: () =>
    z
      .string()
      .min(1, { message: messages.emailIsRequired })
      .email({ message: messages.invalidEmail }),
  minLength: (minLength: number = 1) =>
    z.string().min(minLength, `Must be at least ${minLength} characters long`),
  maxLength: (maxLength: number = 150) =>
    z.string().max(maxLength, `Must be at most ${maxLength} characters long`),
  minValue: (minValue: number = 1) =>
    z.number().min(minValue, `Must be at least ${minValue}`),
  maxValue: (maxValue: number = 150) =>
    z.number().max(maxValue, `Must be at most ${maxValue}`),
  pattern: (pattern: RegExp) => z.string().regex(pattern, "Invalid format"),
  date: () =>
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  url: () => z.string().url("Invalid URL"),
  alpha: () => z.string().regex(/^[a-zA-Z]+$/, "Must contain only letters"),
  alphanumeric: () =>
    z.string().regex(/^[a-zA-Z0-9]+$/, "Must contain only letters and numbers"),
  phoneNumber: () =>
    z.string().regex(/^\+?[0-9]{1,3}-?[0-9]{3,14}$/, "Invalid phone number"),
  creditCard: () =>
    z
      .string()
      .regex(/^(?:[0-9]{4}-?){3}[0-9]{4}$/, "Invalid credit card number"),
  postalCode: () =>
    z
      .string()
      .regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "Invalid postal code"),
  ipv4: () =>
    z.string().regex(/^(\d{1,3}\.){3}\d{1,3}$/, "Invalid IPv4 address"),
  ipv6: () =>
    z
      .string()
      .regex(
        /^((?=.*(::))(?!.*\3.+\3))\3?(([0-9A-Fa-f]{1,4}\3?){1,7}|.{1,7})\3?((([0-9A-Fa-f]{1,4}\3)|.{1,4}){1,7}|.{1,7})$/,
        "Invalid IPv6 address"
      ),
  password: () =>
    z
      .string()
      .min(1, { message: messages.passwordRequired })
      .min(6, { message: messages.passwordLengthMin })
      .regex(new RegExp(".*[A-Z].*"), {
        message: messages.passwordOneUppercase,
      })
      .regex(new RegExp(".*[a-z].*"), {
        message: messages.passwordOneLowercase,
      })
      .regex(new RegExp(".*\\d.*"), { message: messages.passwordOneNumeric }),
  confirmPassword: () =>
    z
      .string()
      .min(1, { message: messages.confirmPasswordRequired })
      .min(6, { message: messages.passwordLengthMin })
      .regex(new RegExp(".*[A-Z].*"), {
        message: messages.passwordOneUppercase,
      })
      .regex(new RegExp(".*[a-z].*"), {
        message: messages.passwordOneLowercase,
      })
      .regex(new RegExp(".*\\d.*"), { message: messages.passwordOneNumeric }),
};

const toCustomValidation = (
  validate: CustomValidation
): CustomValidationResult => ({
  isValid: (value: string | number) => !validate(value),
  message: (value: string | number) =>
    !!validate(value) ? { message: validate(value) } : "",
});

export const constructSchema = <T extends FieldValues>(
  fields: FieldType<T>[]
) => {
  // Extract validation schemas from field configurations
  const validationSchema = fields.reduce((acc: any, curr) => {
    if (curr.condition && curr.condition[0]) {
      const [validationType, validationParam] = curr.condition;
      const cValidations = curr.condition
        .filter((val) => typeof val === "function")
        .map((val) => val);
      if (cValidations.length > 0) {
        const schema = z
          .union([z.string(), z.coerce.number()])
          .superRefine((value, ctx) => {
            cValidations.forEach((condition) => {
              //@ts-ignore
              const { isValid, message } = toCustomValidation(condition);
              if (!isValid(value)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: message(value),
                });
              }
            });
          });
        acc[curr.name] = z.union([z.string(), z.coerce.number()]).refine(
          (val) => {
            const result = schema.safeParse(val)?.error?.flatten()
              .formErrors[0] as any;
            return !result?.message as boolean;
          },
          (val) => {
            const result = schema.safeParse(val)?.error?.flatten()
              .formErrors[0] as { message?: string };
            console.log(result);
            return result;
          }
        );
      } else if (validation[validationType as keyof typeof validation]) {
        acc[curr.name] = validation[validationType as keyof typeof validation](
          validationParam as any
        );
      } else {
        console.warn("Invalid validation function format");
      }
    } else {
      if (curr.type === "multi-select") {
        acc[curr.name] = z.array(z.string().optional()).optional();
      } else if (curr.type === "number") {
        acc[curr.name] = z.coerce.number().optional();
      } else if (curr.type === "checkbox") {
        acc[curr.name] = z.coerce.boolean().optional();
      } else {
        acc[curr.name] = z.string().optional();
      }
    }
    return acc;
  }, {});

  return z.object<T>(validationSchema);
};
