package com.skt.covid.web.rest;

import com.skt.covid.config.Constants;
import com.skt.covid.security.SecurityUtils;
import com.skt.covid.service.UserService;
import com.skt.covid.service.dto.UserDTO;
import com.skt.covid.web.rest.errors.CovidException;
import com.skt.covid.web.rest.errors.EmailAlreadyUsedException;
import com.skt.covid.web.rest.errors.InvalidPasswordException;
import com.skt.covid.web.rest.errors.LoginAlreadyUsedException;
import com.skt.covid.web.rest.vm.ManagedUserVM;
import com.skt.covid.web.rest.vm.Result;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/apps")
public class UserController {

    @Autowired
    UserService userService;

    /**
     * {@code POST  /register} : register the user.
     *
     * @param managedUserVM the managed user View Model.
     * @throws InvalidPasswordException {@code 400 (Bad Request)} if the password is incorrect.
     * @throws EmailAlreadyUsedException {@code 400 (Bad Request)} if the email is already used.
     * @throws LoginAlreadyUsedException {@code 400 (Bad Request)} if the login is already used.
     */
    @ApiOperation(value = "DEFAULT API", hidden = true)
    @PostMapping("/user/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Result registerAccount(@Valid @RequestBody ManagedUserVM managedUserVM) {
        Result result = new Result();
        if (!checkPasswordLength(managedUserVM.getPassword())) {
            throw new InvalidPasswordException();
        }
        try {
            result = userService.registerUser(managedUserVM, managedUserVM.getPassword());
        } catch (Exception e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("비지니스 로직 에러 관리자에게 문의하세요.");
        }

        return result;
//        mailService.sendActivationEmail(user);
    }

    /**
     * {@code GET  /account} : get the current user.
     *
     * @return the current user.
     * @throws RuntimeException {@code 500 (Internal Server Error)} if the user couldn't be returned.
     */
    @ApiOperation(value = "user me")
    @GetMapping("/user/me")
    public Result getUserMe() {
        Result result = new Result();
        String userId = SecurityUtils.getCurrentUserLogin().get();

        if ("anonymousUser".equals(userId)) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("로그인이 필요한 서비스 입니다.");
            return result;
        }

        result.setCode(Constants.CommonCode.SUCCESS);
        result.setData(userService.getUserWithAuthorities().map(UserDTO::new));

        if (result.getData() == null) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("User could not be found");
        };

        return result;
    }

    /**
     * 중복회원 가입 확인
     * @return
     */
    @ApiOperation(value = "", httpMethod = "GET", notes = "중복회원 가입 확인")
    @GetMapping(path = "/user/exist")
    public Result checkExist(@RequestParam("loginId") String loginId)  {
        Result result = new Result();
        try {
            result = userService.checkExist(loginId);
        } catch (CovidException e) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("비지니스 로직 에러 관리자에게 문의하세요.");
        }

        return result;
    }

    private static boolean checkPasswordLength(String password) {
        return !StringUtils.isEmpty(password) &&
            password.length() >= ManagedUserVM.PASSWORD_MIN_LENGTH &&
            password.length() <= ManagedUserVM.PASSWORD_MAX_LENGTH;
    }


}
