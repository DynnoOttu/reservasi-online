const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb+srv://dynno:dynno@cluster0.cf6xbyu.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error Connecting to MongoDB");
  });

app.listen(port, () => {
  console.log("server is running on port 3000");
});

const User = require("./models/user");
const Dokter = require("./models/dokter");
const Reservation = require("./models/Reservation");
const Pemeriksaan = require("./models/pemeriksaan");

//endpoint to register a user in the backend
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    //create a new user
    const newUser = new User({ name, email, password });

    //generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    //save the  user to the database
    await newUser.save();

    //send the verification email to the user
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.log("error registering user", error);
    res.status(500).json({ message: "error registering user" });
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  //create a nodemailer transporter

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dynnoottu968@gmail.com",
      pass: "amko jdym fwcr uyqf",
    },
  });

  //compose the email message
  const mailOptions = {
    from: "Klinik",
    to: email,
    subject: "Verifikasi Email",
    text: `Silahkan klik link ini untuk verifikasi email anda http://localhost:3000/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error sending email", error);
  }
};

app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("error getting token", error);
    res.status(500).json({ message: "Email verification failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }

    if (user.password !== password) {
      return res.status(404).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

//endpoint to access all the users except the logged in the user
app.get("/user/:userId", (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    User.find({ _id: { $ne: loggedInUserId } })
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        console.log("Error: ", error);
        res.status(500).json("errror");
      });
  } catch (error) {
    res.status(500).json({ message: "error getting the users" });
  }
});

//endpoint to follow a particular user
app.post("/follow", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { followers: currentUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in following a user" });
  }
});

//endpoint to unfollow a user
app.post("/users/unfollow", async (req, res) => {
  const { loggedInUserId, targetUserId } = req.body;

  try {
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedInUserId },
    });

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unfollowing user" });
  }
});

//endpoint to create a new post in the backend
app.post("/create-post", async (req, res) => {
  try {
    const { content, userId } = req.body;

    const newPostData = {
      user: userId,
    };

    if (content) {
      newPostData.content = content;
    }

    const newPost = new Post(newPostData);

    await newPost.save();

    res.status(200).json({ message: "Post saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "post creation failed" });
  }
});

//endpoint for liking a particular post
app.put("/posts/:postId/:userId/like", async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId; // Assuming you have a way to get the logged-in user's ID

  try {
    const post = await Post.findById(postId).populate("user", "name");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } }, // Add user's ID to the likes array
      { new: true } // To return the updated post
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    updatedPost.user = post.user;

    res.json(updatedPost);
  } catch (error) {
    console.error("Error liking post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while liking the post" });
  }
});

//endpoint to unlike a post
app.put("/posts/:postId/:userId/unlike", async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId;

  try {
    const post = await Post.findById(postId).populate("user", "name");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );

    updatedPost.user = post.user;

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("Error unliking post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while unliking the post" });
  }
});

//endpoint to get all the posts
app.get("/get-posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while getting the posts" });
  }
});

app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error while getting the profile" });
  }
});

app.get("/get-dokter", async (req, res) => {
  try {
    const posts = await Dokter.find();

    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while getting the posts" });
  }
});

app.patch('/update-dokter/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedDokter = await Dokter.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedDokter) {
      return res.status(404).json({ message: 'Dokter not found' });
    }

    res.status(200).json(updatedDokter);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the Dokter' });
  }
});


app.post("/create-pemeriksaan", async (req, res) => {
  try {
    const { userId, dokterId, tanggal, jam, keterangan, status } = req.body;

    const newPostData = {
      user: userId,
      dokter: dokterId,
      tanggal,
      jam,
      keterangan,
      status
    };
    const newPost = new Pemeriksaan(newPostData);

    await newPost.save();

    res.status(200).json({ message: "Post saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "post creation failed" });
    console.log("Pemeriksaan", error)
  }
});

app.get('/get-pemeriksaan/:userId', async (req, res) => {
  
  try {
    const userId = req.params.userId;

    const posts = await Pemeriksaan.find({ user: userId })
    .populate({
      path: 'user',
      select: 'name',
    })
      .populate({
        path: 'dokter',
        select: '-__v', // Menampilkan semua field kecuali __v
      })

    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while getting the posts" });
  }
});


// Reservation
app.post("/create-reservation", async (req, res) => {
  try {
    const { userId, dokterId, tanggal, jam, keterangan, status } = req.body;

    const newPostData = {
      user: userId,
      dokter: dokterId,
      tanggal,
      jam,
      keterangan,
      status
    };
    const newPost = new Reservation(newPostData);

    await newPost.save();

    res.status(200).json({ message: "Reservation saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Reservation creation failed" });
    console.log("Reservation", error)
  }
});

app.get('/get-reservation/:userId', async (req, res) => {
  
  try {
    const userId = req.params.userId;

    const posts = await Reservation.find({ user: userId })
    .populate({
      path: 'user',
      select: 'name',
    })
      .populate({
        path: 'dokter',
        select: '-__v', // Menampilkan semua field kecuali __v
      })

    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while getting the posts" });
  }
});



app.put("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email, password, profilePicture } = req.body;

    // Pastikan minimal satu field yang akan diupdate ada dalam request
    if (!name && !email && !password && !profilePicture) {
      return res.status(400).json({ message: "At least one field is required for update" });
    }

    // Cek apakah user dengan userId ada
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update field yang diberikan dalam request
    if (name) existingUser.name = name;
    if (email) existingUser.email = email;
    if (password) existingUser.password = password;
    if (profilePicture) existingUser.profilePicture = profilePicture;

    // Simpan perubahan
    await existingUser.save();

    return res.status(200).json({ message: "Profile updated successfully", user: existingUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while updating the profile" });
  }
});

app.put("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email, password } = req.body;

    // Pastikan minimal satu field yang akan diupdate ada dalam request
    if (!name && !email && !password) {
      return res.status(400).json({ message: "At least one field is required for update" });
    }

    // Cek apakah user dengan userId ada
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update field yang diberikan dalam request
    if (name) existingUser.name = name;
    if (email) existingUser.email = email;
    if (password) existingUser.password = password;

    // Simpan perubahan
    await existingUser.save();

    return res.status(200).json({ message: "Profile updated successfully", user: existingUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while updating the profile" });
  }
});