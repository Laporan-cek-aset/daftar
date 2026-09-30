import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'kunci-rahasia-kkgmi-10');

export async function createSession(user) {
  try {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Masa aktif 7 hari
    
    // Mendukung penamaan kolom dari hasil query Turso (Case-safe)
    const userRole = user.Role || user.role;
    const username = user.Username || user.username;
    const userId = user.ID || user.id;

    const session = await new SignJWT({ id: userId, role: userRole, username: username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secretKey);

    cookies().set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAt,
      path: '/',
      sameSite: 'lax',
    });
    
    return true;
  } catch (error) {
    console.error("Session Creation Error:", error);
    throw new Error("Gagal membuat kunci sesi login");
  }
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}
