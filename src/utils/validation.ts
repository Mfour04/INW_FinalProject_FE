export type PasswordValidationResult = {
  isValid: boolean;
  errors: string[];
};

export const validatePassword = (
  password: string
): PasswordValidationResult => {
  const errors: string[] = [];
  if (password.length == 0) return {
    isValid: true,
    errors,
  }  

  if (password.length < 8 || password.length > 32) {
    errors.push('Mật khẩu phải dài từ 8 đến 32 ký tự.');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất một chữ thường.');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất một chữ hoa.');
  }

  if (!/\d/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất một số.');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất một ký tự đặc biệt.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

