package ch.admin.seco.jobroom.security;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.security.crypto.codec.Hex;
import org.springframework.security.crypto.codec.Utf8;
import org.springframework.security.crypto.password.PasswordEncoder;

public class MD5PasswordEncoder implements PasswordEncoder {
    @Override
    public String encode(CharSequence rawPassword) {
        return new String(Hex.encode(getMessageDigest().digest(Utf8.encode(rawPassword))));
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        String pass1 = "" + encodedPassword;
        return pass1.equals(encode(rawPassword));
    }

    private MessageDigest getMessageDigest() {
        try {
            return MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalArgumentException(
                "No such algorithm [MD5]");
        }
    }
}
