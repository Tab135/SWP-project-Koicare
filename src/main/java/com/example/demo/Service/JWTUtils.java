package com.example.demo.Service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;
@Component
public class JWTUtils {
    private final SecretKey Key;
    private static final long Expiration_Time = 8640000;

    public JWTUtils(){
        String serectString ="b25nY25nY2Fub25nY2Fub25nY2FubFub225nY2Fub25nY2Fub25nY2Fub25nY2Fub25nY2Fub25nY2Fub25nY2Fub25nY2Fub25nY2Fub25nY2Fub25nY2Fub25nY2Fub25nY2Fub25nY2Fu";
        byte[] keyBytes = Base64.getDecoder().decode(serectString.getBytes(StandardCharsets.UTF_8));
        this.Key = new SecretKeySpec(keyBytes,"HmacSHA256");
    }

    public String generateToken(UserDetails userDetails,int userId) {

        return Jwts.builder()
                .claim("userId", userId)
                .claim("email",userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + Expiration_Time ))
                .signWith(Key)
                .compact();
    }

    public String generateRefreshToken(HashMap<String,Object> claims, UserDetails userDetails){
        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + Expiration_Time ))
                .signWith(Key)
                .compact();
    }

    public String extractUsername(String token){
        return extractClaims(token, claims -> claims.get("email", String.class));
    }
    public int extractUserId(String token) {
        return extractClaims(token, claims -> claims.get("userId", Integer.class));
    }
    private <T> T extractClaims(String token, Function<Claims,T> claimsTFunction){
        return claimsTFunction.apply(Jwts.parser().verifyWith(Key).build().parseSignedClaims(token).getPayload());
    }

    public boolean isTokenValid(String token, UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())&& !isTokenExpired(token));
    }
    public boolean isTokenExpired(String token){
        return extractClaims(token,Claims::getExpiration).before(new Date());
    }
}
