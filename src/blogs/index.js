import express from "express";
import Blogs from "./schema.js";

const blogRouter = express.Router();

blogRouter.get("/", async (req, resp, next) => {
  try {
    const blogs = await Blogs.find({});
    resp.send(blogs);
  } catch (err) {
    next(err);
  }
});

blogRouter.post("/", async (req, resp, next) => {
  try {
    const blog = await new Blogs(req.body).save();
    resp.status(201).send(blog);
  } catch (error) {
    console.log(error);
    res.send(500).send({ message: error.message });
  }
});

blogRouter.get("/:id", async (req, resp, next) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    if (!blog) {
      resp
        .status(404)
        .send({ message: `Blog with id ${req.params.id} not found!` });
    } else {
      resp.send(blog);
    }
  } catch (err) {
    next(err);
  }
});

blogRouter.put("/:id", async (req, resp, next) => {
  try {
    const updated = await Blogs.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    resp.send(updated);
  } catch (err) {
    next(err);
  }
});

blogRouter.delete("/:id", async (req, resp, next) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    if (!blog) {
      resp
        .status(404)
        .send({ message: `blog with ${req.params.id} is not found!` });
    } else {
      await Blogs.findByIdAndDelete(req.params.id);
      resp.status(204).send();
    }
  } catch (err) {
    next(err);
  }
});

blogRouter.get("/:id/comments", async (req, resp, next) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    if (blog) {
      resp.send(blog.comments);
    } else {
      resp
        .status(404)
        .send({ message: `blog with ${req.params.id} is not found!` });
    }
  } catch (err) {
    next(err);
  }
});

blogRouter.post("/:id/comments", async (req, resp, next) => {
  try {
    const comment = req.body;
    const updatedBlog = await Blogs.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: comment } },
      { new: true }
    );
    if (updatedBlog) {
      resp.send(updatedBlog);
    }
  } catch (err) {
    next(err);
  }
});

blogRouter.get("/:id/comments/:commentId", async (req, resp, next) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    if (blog) {
      const comment = await blog.comments.find(
        (c) => c._id.toString() === req.params.commentId
      );
      if (comment) {
        resp.send(comment);
      } else {
        resp
          .status(404)
          .send({ message: `Comment with ${req.params.commentId} not found!` });
      }
    } else {
      resp
        .status(404)
        .send({ message: `Blog with ${req.params.id} is not found!` });
    }
  } catch (err) {
    next(err);
  }
});

export default blogRouter;
