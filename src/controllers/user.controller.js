import { User } from "../models/User.model.js";
import { Token } from "../models/Token.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessToken = async (user) => {
    try {
        const accessToken = await user.generateAccessToken();

        return accessToken
    } catch (error) {
        throw new ApiError(500, error);
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if ([username, email, password].some((item) => item?.trim() === "")) {
        throw new ApiError(400, "all fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existingUser) {
        throw new ApiError(409, "user with email or username already exists")
    }

    const user = await User.create({
        username,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password")

    res.status(201).json(new ApiResponse(201, {}, "user registered successfully"))
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if ([email, password].some((item) => item?.trim() === "")) {
        throw new ApiError(400, "all fields are required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "user not found")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "incorrect password")
    }

    const accessToken = await generateAccessToken(user)
    const loggedInUser = await User.findById(user._id).select("-password")

    const DAILY_REFRESH_HOUR = 10;
    const DAILY_TOKEN_REWARD = 1;

    const now = new Date();
    const todayRefreshTime = new Date();
    todayRefreshTime.setHours(DAILY_REFRESH_HOUR, 0, 0, 0);

    const lastRefreshTime = now < todayRefreshTime 
        ? new Date(todayRefreshTime.getTime() - 24 * 60 * 60 * 1000) 
        : todayRefreshTime;

    try {
        let userToken = await Token.findOne({ user: user._id });
        
        if (!userToken) {
            userToken = await Token.create({
                user: user._id,
                token: DAILY_TOKEN_REWARD,
                lastLogin: now
            });
        } else {
            if (userToken.lastLogin < lastRefreshTime) {
                userToken.token += DAILY_TOKEN_REWARD;
                userToken.lastLogin = now;
                await userToken.save();
            } else {
                userToken.lastLogin = now;
                await userToken.save();
            }
        }

        // Add token info to response
        const responseData = {
            user: loggedInUser,
            tokens: userToken.token,
            tokensEarnedToday: userToken.lastLogin >= lastRefreshTime ? 
                (userToken.lastLogin.getTime() - lastRefreshTime.getTime() < 60000 ? DAILY_TOKEN_REWARD : 0) : 0
        };

        const options = {
            httpOnly: true,
            secure: true
        }

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .json(new ApiResponse(200, responseData, "logged in successfully"));

    } catch (tokenError) {
        console.error('Token system error:', tokenError);
        const options = {
            httpOnly: true,
            secure: true
        }

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .json(new ApiResponse(200, loggedInUser, "logged in successfully"));
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(403, "you are not authenticated")
    }

    const options = {
        httpOnly: true,
        secure: true,
    };

    res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "user logged out"));
})

const getUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(403, "you are not authenticated")
    }
    res
        .status(200)
        .json(new ApiResponse(200, req.user, "user retrieved successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(403, "you are not authenticated")
    }
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "both old and new passwords are required");
    }
    if (oldPassword === newPassword) {
        throw new ApiError(400, "same password not allowed");
    }

    const user = await User.findById(req.user?._id);

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
        throw new ApiError(401, "old password wrong");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    res
        .status(200)
        .json(new ApiResponse(200, {}, "password changed sucessfully"));
});

const getUserTokens = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(403, "you are not authenticated")
    }

    const userToken = await Token.findOne({ user: req.user._id });
    
    res.status(200).json(new ApiResponse(200, {
        tokens: userToken ? userToken.token : 0,
        lastLogin: userToken ? userToken.lastLogin : null
    }, "tokens retrieved successfully"));
});

const claimTokens = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(403, "you are not authenticated")
    }

    const userToken = await Token.findOne({ user: req.user._id });
    
    if (!userToken || userToken.token === 0) {
        throw new ApiError(400, "no tokens available to claim");
    }

    const claimedAmount = userToken.token;
    userToken.token = 0;
    await userToken.save();

    res.status(200).json(new ApiResponse(200, {
        claimedTokens: claimedAmount,
        remainingTokens: 0
    }, "tokens claimed successfully"));
});

export { registerUser, loginUser, logoutUser, changePassword, getUser, getUserTokens, claimTokens }


