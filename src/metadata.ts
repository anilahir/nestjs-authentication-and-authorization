/* eslint-disable */
export default async () => {
  const t = {
    ['./users/entities/user.entity']: await import(
      './users/entities/user.entity'
    ),
  };
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('./users/entities/user.entity'),
          {
            User: {
              id: { required: true, type: () => String },
              email: { required: true, type: () => String },
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
            },
          },
        ],
        [
          import('./auth/dto/sign-in.dto'),
          {
            SignInDto: {
              email: { required: true, type: () => String, maxLength: 255 },
              password: {
                required: true,
                type: () => String,
                minLength: 8,
                maxLength: 20,
                pattern:
                  '/((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$/',
              },
            },
          },
        ],
        [
          import('./auth/dto/sign-up.dto'),
          {
            SignUpDto: {
              email: { required: true, type: () => String, maxLength: 255 },
              password: {
                required: true,
                type: () => String,
                minLength: 8,
                maxLength: 20,
                pattern:
                  '/((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$/',
              },
              passwordConfirm: { required: true, type: () => String },
            },
          },
        ],
      ],
      controllers: [
        [
          import('./app.controller'),
          { AppController: { getHello: { type: String } } },
        ],
        [
          import('./auth/auth.controller'),
          { AuthController: { signUp: {}, signIn: {}, signOut: {} } },
        ],
        [
          import('./users/users.controller'),
          {
            UsersController: {
              getMe: { type: t['./users/entities/user.entity'].User },
            },
          },
        ],
      ],
    },
  };
};
