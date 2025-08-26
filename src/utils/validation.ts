export type PasswordValidationResult = {
  isValid: boolean;
  errors: string[];
};

export const urlRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const validatePassword = (
  password: string
): PasswordValidationResult => {
  const errors: string[] = [];
  if (password.length === 0)
    return {
      isValid: true,
      errors,
    };

  const lengthValid = password.length >= 8 && password.length <= 32;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (!lengthValid || !hasUpper || !hasNumber || !hasSpecial) {
    errors.push(
      "Mật khẩu phải dài 8–32 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ số và 1 ký tự đặc biệt."
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export function isValidUrl(url: string): boolean {
  return urlRegex.test(url);
}
