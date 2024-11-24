import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../models/prismaClient.js";
import dotenv from "dotenv";

dotenv.config();

const generateToken = async (payload) => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid payload for token generation");
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10d" });
  return token;
};

export const adminSignup = async (req, res) => {
  try {
    const { user_name, email, password } = req.body;
    if (!user_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await prisma.signup.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const signup = await prisma.signup.create({
      data: {
        user_name,
        email,
        password: hashedPassword,
        account_type: "admin",
      },
    });
    return res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    const user = await prisma.signup.findUnique({
      where: {
        email,
      },
    });
    if (!user || user.account_type !== "admin") {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password!" });
    }
    const token = await generateToken({ id: user.id });
    return res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ message: "Invalid credentials.", error: error.message });
  }
};

export const getTotalList = async (req, res) => {
  try {
    const stu = await prisma.student.count();
    const tch = await prisma.teacher.count();
    const reviews = await prisma.teacherReview.count();
    const totalList = { students: stu, teachers: tch, reviews: reviews };
    return res.status(200).json(totalList);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const reviewsList = async (req, res) => {
  try {
    const { token } = req.body;
    // verify that token is valid Admin
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.account_type !== "admin") {
      return res.status(401).json({ message: "Invalid token" });
    }
    const reviews = await prisma.teacherReview.findMany({
      include: {
        teacher: {
          select: {
            name: true,
          },
        },
        student: {
          select: {
            name: true,
          },
        },
      },
    });
    return res.status(200).json({ message: "All the reviews.", list: reviews });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { token, review_id } = req.body;
    if (!token || !review_id) {
      return res
        .status(400)
        .json({ message: "Token and Review Id are required" });
    }
    // verify that token is valid Admin
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken || decodedToken.account_type !== "admin") {
      return res.status(401).json({ message: "Invalid token" });
    }

    await prisma.teacherReview.delete({
      where: {
        review_id,
      },
    });
    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const verifyTeacher = async (req, res) => {
  try {
    const { token, teacher_id } = req.body;
    if (!token || !teacher_id) {
      return res
        .status(400)
        .json({ message: "Token and Teacher Id are required" });
    }
    // verify that token is valid Admin
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken || decodedToken.account_type !== "admin") {
      return res.status(401).json({ message: "Invalid token" });
    }
    const teacher = await prisma.teacher.findUnique({
      where: {
        teacher_id,
      },
    });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    if (teacher.isVerified === true) {
      return res.status(400).json({ message: "Teacher is already verified" });
    }
    if (teacher.isVerified === false) {
      await prisma.teacher.update({
        where: {
          teacher_id,
        },
        data: {
          isVerified: true,
        },
      });
    }
    return res.status(200).json({ message: "Teacher verified successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

