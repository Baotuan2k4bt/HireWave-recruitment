package com.example.hirewave.utility;

public class EmailUtil {

    public static String getOtpEmailBody(String otp, String username) {
        return """
            <html>
            <body>
                <h3>Hello %s,</h3>
                <p>Your OTP code is:</p>
                <h2>%s</h2>
                <p>This code will expire in 5 minutes.</p>
            </body>
            </html>
        """.formatted(username, otp);
    }
}