import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JWTPayload, expiresIn: string = config.jwtExpire): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpire as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string, secret: string = config.jwtSecret): JWTPayload => {
  return jwt.verify(token, secret) as JWTPayload;
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
};

export const generateAuthTokens = (payload: JWTPayload) => {
  return {
    accessToken: generateToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};
