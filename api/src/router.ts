import express from "express";
// Get と Post のルーティンング
const router: express.Router = express.Router();
router.get(
  "/api/getTest/:id",
  (req: express.Request, res: express.Response) => {
    //res.send(req.query); // ?id=id
    res.send(req.params); // /:id // or access through req.param("tagId"));
  }
);
router.get("/", (req: express.Request, res: express.Response) => {
  res.render("index", { title: "Hey", message: "Hello there!" });
});

export default router;
