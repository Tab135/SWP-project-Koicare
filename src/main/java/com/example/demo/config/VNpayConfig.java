package com.example.demo.config;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

/**
 * VNPay Configuration and Utility Methods.
 */
public class VNpayConfig {
    private static final Logger logger = LoggerFactory.getLogger(VNpayConfig.class);

    public static final String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static final String vnp_ReturnUrl = "http://localhost:8080/public/payment/vn-pay-callback";
    public static final String vnp_TmnCode = getEnvVariable("vnp_code");
    public static final String vnp_Version = "2.1.0";
    public static final String vnp_Command = "pay";
    public static final String secretKey = getEnvVariable("vnp_secret");
    public static final String vnp_ApiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";

    private static String getEnvVariable(String name) {
        String value = System.getenv(name);
        if (value == null) {
            throw new IllegalArgumentException("Environment variable " + name + " is not set.");
        }
        return value;
    }

    public static String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) {
                throw new IllegalArgumentException("Key or data cannot be null");
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes(StandardCharsets.UTF_8);
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();

        } catch (Exception ex) {
            throw new RuntimeException("Error generating HMAC SHA512", ex);
        }
    }

    public static String hashAllFields(Map<String, String> fields) {
        if (fields == null || fields.isEmpty()) {
            throw new IllegalArgumentException("Fields cannot be null or empty");
        }
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                sb.append(fieldName).append("=").append(fieldValue);
            }
            if (itr.hasNext()) {
                sb.append("&");
            }
        }
        return hmacSHA512(secretKey, sb.toString());
    }

    public static String getIpAddress(HttpServletRequest request) {
        String ipAddress;
        try {
            ipAddress = request.getHeader("X-FORWARDED-FOR");
            if (ipAddress == null) {
                ipAddress = request.getRemoteAddr();
            }
        } catch (Exception e) {
            ipAddress = "Invalid IP:" + e.getMessage();
        }
        return ipAddress;
    }

    public static String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }

    public static boolean verifyPayment(HttpServletRequest request) {
        // Extract parameters from the request
        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        String expectedSecureHash = generateExpectedSecureHash(request); // Assuming this method generates the expected hash

        if (vnp_SecureHash == null) {
            logger.warn("vnp_SecureHash is null. Payment verification failed.");
            return false;
        }

        if (!vnp_SecureHash.equals(expectedSecureHash)) {
            logger.warn("vnp_SecureHash does not match. Payment verification failed.");
            return false;
        }

        logger.info("Verifying payment with parameters: " + request.getParameterMap());

        // Exclude secure hash from params to verify
        Map<String, String> params = new HashMap<>();
        Enumeration<String> paramNames = request.getParameterNames();
        while (paramNames.hasMoreElements()) {
            String paramName = paramNames.nextElement();
            if (!"vnp_SecureHash".equals(paramName)) {
                params.put(paramName, request.getParameter(paramName));
            }
        }
        // Generate secure hash using your secret key
        String generatedHash = hmacSHA512(secretKey, createHashData(params));
        return vnp_SecureHash.equals(generatedHash);
    }

    private static String createHashData(Map<String, String> params) {
        // Sort and concatenate parameters to create hash data string
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append('=').append(fieldValue).append('&');
            }
        }
        // Remove last '&' character
        if (hashData.length() > 0) {
            hashData.deleteCharAt(hashData.length() - 1);
        }
        return hashData.toString();
    }
    public static String generateExpectedSecureHash(HttpServletRequest request) {
        // Extract parameters from the request, excluding vnp_SecureHash
        Map<String, String[]> parameterMap = request.getParameterMap();
        StringBuilder sb = new StringBuilder();

        // Sort the parameters by name and concatenate them
        parameterMap.keySet().stream()
                .filter(key -> !key.equals("vnp_SecureHash")) // Exclude the secure hash
                .sorted()
                .forEach(key -> {
                    String[] values = parameterMap.get(key);
                    if (values != null) {
                        for (String value : values) {
                            sb.append(key).append("=").append(value).append("&");
                        }
                    }
                });

        // Append the secret key to the string
        sb.append("vnp_SecureHashKey=").append(secretKey); // Replace with your secret key

        // Generate the secure hash using SHA-256
        return generateSHA256(sb.toString());
    }

    private static String generateSHA256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();

            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            return hexString.toString().toUpperCase(); // Return uppercase for VNPay
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
