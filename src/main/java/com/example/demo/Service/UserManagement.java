package com.example.demo.Service;

import com.example.demo.DTO.*;
import com.example.demo.DTO.Shop.Cart;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResUser;
import com.example.demo.REQUEST_AND_RESPONSE.ResReqPond;
import com.example.demo.Repo.RoleRepo;
import com.example.demo.Repo.Shop.CartRepository;
import com.example.demo.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserManagement {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;
    @Autowired
    private PondService pondService;

    private final Map<String, SignupOTP> otpStorage = new ConcurrentHashMap<>();

    public ReqResUser sendOtpSignUp(ReqResUser email) {
        ReqResUser resp = new ReqResUser();
        Optional<UserModel> existingUser = userRepo.findByEmail(email.getEmail());

        if (existingUser.isPresent()) {
            resp.setMessage("This email has already been used to sign up");
            return resp;
        }
        int otp = OtpGen();
        Date expirationTime = new Date(System.currentTimeMillis() + 120000);
        MailDTO mailDTO = MailDTO.builder()
                .to(email.getEmail())
                .text("OTP to verify sign up : " + otp)
                .subject("KoiFish Control sign up request")
                .build();

        SignupOTP otpData = new SignupOTP(otp, expirationTime);
        otpStorage.put(email.getEmail(), otpData);

        emailService.sendSimpleMessage(mailDTO);

        resp.setMessage("Otp sent to " + email.getEmail());
        return resp;
    }

    public ReqResUser verifyOtpAndSignup(int otp, String email, String name, String password) {
        ReqResUser resp = new ReqResUser();

        SignupOTP su = otpStorage.get(email);
        if (su == null || su.getOtp() != otp) {
            throw new RuntimeException("Invalid OTP");
        }

        if (su.getExpirationTime().before(new Date())) {
            otpStorage.remove(email);
            throw new RuntimeException("OTP has expired");
        }

        otpStorage.remove(email);
        RoleModel userRole = roleRepo.findByName("USER");
        UserModel newUser = new UserModel();

        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setName(name);
        newUser.setRole(userRole);

        UserModel savedUser = userRepo.save(newUser);

        if (savedUser.getId() > 0) {
            resp.setUsers(savedUser);
            resp.setMessage("User signed up successfully");

            Cart userCart = new Cart(savedUser, new Date());
            userCart.setItems(new ArrayList<>());

            // Save the cart to the database
            cartRepository.save(userCart);
            PondModel pond = new PondModel();
            pond.setPondName("Pond");
            ResReqPond res = new ResReqPond();
            res.setPond(pond);
            pondService.createP(res, savedUser.getId());
            resp.setStatusCode(200);
        } else {
            resp.setMessage("Error during sign up");
            resp.setStatusCode(500);
        }

        return resp;
    }

    public int OtpGen() {
        Random random = new Random();
        return random.nextInt(100_000, 999_999);
    }

    public ReqResUser handleGoogleLogin(OidcUser authentication) {
        ReqResUser resp = new ReqResUser();

        try {
            String email = authentication.getAttribute("email");
            String name = authentication.getAttribute("name");

            UserModel user = findOrCreateGoogleUser(email, name);

            // Prepare response
            resp.setEmail(email);
            resp.setStatusCode(200);
            resp.setRole(user.getRole().getName());
            resp.setMessage("Google login successful");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage(e.getMessage());
        }
        return resp;
    }

    private UserModel findOrCreateGoogleUser(String email, String name) {
        Optional<UserModel> existingUser = userRepo.findByEmail(email);
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        RoleModel userRole = roleRepo.findByName("USER");
        UserModel newUser = new UserModel();
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setRole(userRole);

        return userRepo.save(newUser);
    }

    public ReqResUser Login(ReqResUser LoginRequest) {
        ReqResUser resp = new ReqResUser();

        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(LoginRequest.getEmail(), LoginRequest.getPassword()));

            var user = userRepo.findByEmail(LoginRequest.getEmail()).orElseThrow();
            var jwt = jwtUtils.generateToken(user, user.getId());
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
            resp.setStatusCode(200);
            resp.setRole(user.getRole().getName());
            resp.setToken(jwt);
            resp.setRefreshToken(refreshToken);
            resp.setMessage("Succesfully logged in");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage(e.getMessage());
        }
        return resp;
    }

    public ReqResUser Delete(int id) {
        ReqResUser resp = new ReqResUser();
        try {
            Optional<UserModel> user = userRepo.findById(id);
            if (user.isPresent()) {
                userRepo.deleteById(id);
                resp.setStatusCode(200);
                resp.setMessage("User deleted");
            } else {
                resp.setStatusCode(404);
                resp.setMessage("User not found");
            }
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage(e.getMessage());
        }
        return resp;
    }

    public ReqResUser checkEmail(String email) {
        ReqResUser resp = new ReqResUser();
        try {
            boolean check = userRepo.existsByEmail(email);
            if (check) {
                resp.setStatusCode(200);
                resp.setMessage("Found Email");
            } else {
                resp.setStatusCode(404);
                resp.setMessage("No Email found");
            }
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Server Error");
        }
        return resp;
    }

    public ReqResUser getUserByID(int id) {
        ReqResUser resp = new ReqResUser();
        try {
            UserModel user = userRepo.findById(id).orElseThrow();
            resp.setUsers(user);
            resp.setStatusCode(200);
            resp.setMessage("User Id:" + id);
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Server Error");
        }
        return resp;
    }

    public ReqResUser updateUser(int userid, UserModel updateUser) {
        ReqResUser resp = new ReqResUser();

        try {
            Optional<UserModel> user = userRepo.findById(userid);
            if (user.isPresent()) {
                UserModel existingUser = user.get();
                existingUser.setEmail(updateUser.getEmail());
                existingUser.setName(updateUser.getName());
                if (updateUser.getPassword() != null && !updateUser.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(updateUser.getPassword()));
                }
                UserModel saved = userRepo.save(existingUser);
                resp.setUsers(saved);
                resp.setStatusCode(200);
                resp.setMessage("Updated successfully");
            } else {
                resp.setStatusCode(404);
                resp.setMessage("User not found");
            }
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Server error: " + e.getMessage());
        }
        return resp;
    }

    public ReqResUser changePassword(String password, String email) {
        ReqResUser resp = new ReqResUser();
        try {
            String encodedPassword = passwordEncoder.encode(password);
            int rowsAffected = userRepo.updatePassword(email, encodedPassword);

            if (rowsAffected > 0) {
                resp.setMessage("Password updated successfully");
                resp.setStatusCode(202);
            } else {
                resp.setMessage("Failed to update password, user not found");
                resp.setStatusCode(404);
            }
        } catch (Exception e) {
            resp.setMessage("An error occurred: " + e.getMessage());
            resp.setStatusCode(500);
        }

        return resp;
    }

    public ReqResUser myProfile(String email) {
        ReqResUser resp = new ReqResUser();
        try {
            Optional<UserModel> user = userRepo.findByEmail(email);
            if (user.isPresent()) {
                resp.setUsers(user.get());
                resp.setStatusCode(200);
                resp.setMessage("success");
            } else {
                resp.setStatusCode(404);
            }
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage(e.getMessage());
        }
        return resp;
    }

    public ReqResUser getAllUser() {
        ReqResUser resp = new ReqResUser();

        try {
            List<UserModel> result = userRepo.findAll();
            if (!result.isEmpty()) {
                resp.setUsersList(result);
                resp.setStatusCode(200);

            } else {
                resp.setStatusCode(404);
                resp.setMessage("No user found");
            }
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage(e.getMessage());

        }
        return resp;
    }

    public ReqResUser refreshToken(ReqResUser token) {
        ReqResUser resp = new ReqResUser();
        try {
            String email = jwtUtils.extractUsername(token.getToken());
            UserModel users = userRepo.findByEmail(email).orElseThrow();
            if (jwtUtils.isTokenValid(token.getToken(), users)) {

                var jwt = jwtUtils.generateToken(users, users.getId());
                resp.setToken(jwt);
                resp.setRefreshToken(token.getToken());
                resp.setMessage("Successfully refreshed token");
            }

        } catch (Exception e) {
            resp.setMessage(e.getMessage());
        }
        resp.setStatusCode(200);
        return resp;
    }

    public ReqResUser getPhone(int userid) {
        ReqResUser resp = new ReqResUser();
        try {
            Optional<UserModel> user = userRepo.findById(userid);
            if (user.isPresent()) {
                UserModel userData = user.get();
                if (userData.getPhone() == null) {
                    resp.setPhone("");
                } else {
                    resp.setPhone(userData.getPhone());
                }
            } else {
                resp.setMessage("Failed to find the user with id: " + userid);
            }
        } catch (Exception e) {
            resp.setMessage(e.getMessage());
        }
        return resp;
    }
    public  ReqResUser updatePhone(int userId, ReqResUser phoneNumber) {
        ReqResUser resp = new ReqResUser();
        try {
            Optional<UserModel> users = userRepo.findById(userId);
            if (users.isPresent()) {
                UserModel userData = users.get();
                userData.setPhone(phoneNumber.getPhone());
                userRepo.save(userData);
                resp.setMessage("Successfully updated phone number");
            } else {
                resp.setMessage("Failed to find the user with id: " + userId);
            }
        }catch (Exception e){
            resp.setMessage(e.getMessage());
        }
        return resp;
    }


    public ReqResUser getAddress(int userId) {
        ReqResUser resp = new ReqResUser();
        try {
            Optional<UserModel> user = userRepo.findById(userId);
            if (user.isPresent()) {
                UserModel userData = user.get();
                if (userData.getAddress() == null) {
                    resp.setAddress("");
                } else {
                    resp.setAddress(userData.getAddress());
                }
            } else {
                resp.setError("No user found with the provided id");
            }
        } catch (Exception e) {
            resp.setError("Error at the get address" + e.getMessage());
        }
        return resp;
    }

    public ReqResUser updateAddress(int userId, ReqResUser address) {
        ReqResUser resp = new ReqResUser();
        try {
            Optional<UserModel> user = userRepo.findById(userId);
            if (user.isPresent()) {
                UserModel exsitUser = user.get();
                exsitUser.setAddress(address.getAddress());
                UserModel result = userRepo.save(exsitUser);
                resp.setUsers(result);
            }
        } catch (Exception e) {
            resp.setMessage(e.getMessage());
        }
        return resp;
    }
    public ReqResUser changePasswordProfile(int userId, String oldPassword, String newPassword) {
        ReqResUser resp = new ReqResUser();

        try {
            UserModel user = userRepo.findById(userId).orElseThrow(() ->
                    new UsernameNotFoundException("User not found"));

            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                resp.setStatusCode(400);
                resp.setMessage("Current password is incorrect");
                return resp;
            }

            if (passwordEncoder.matches(newPassword, user.getPassword())) {
                resp.setStatusCode(400);
                resp.setMessage("New password must be different from current password");
                return resp;
            }

            String encodedPassword = passwordEncoder.encode(newPassword);

            int rowsAffected = userRepo.updatePassword(user.getEmail(), encodedPassword);

            if (rowsAffected > 0) {
                resp.setStatusCode(200);
                resp.setMessage("Password successfully updated");
            } else {
                resp.setStatusCode(500);
                resp.setMessage("Failed to update password");
            }
        } catch (UsernameNotFoundException e) {
            resp.setStatusCode(404);
            resp.setMessage("User not found");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("An error occurred: " + e.getMessage());
        }

        return resp;
    }

}