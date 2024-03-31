require("dotenv").config();
const doQuery = require("./config/doQuery");
const express = require("express");
const app = express();
const cors = require("cors");
const cron = require("node-cron");
const connection = require("./config/dbconfig");
const schedule = require('node-schedule');
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// ================= Modules =============
const category = require("./routes/categoryRoute");
const product = require("./routes/productRouter");
const color = require("./routes/colorRouter");
const color_props = require("./routes/colorPropRouter");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const shipping = require("./routes/shippingRoute");
const return_itemRoute = require("./routes/return_itemRoute");
const bannerRoute = require("./routes/bannerRouter");
const infoRoute = require("./routes/infoRouter");
const reasonRoute = require("./routes/reasonRoute");
const offersRoute = require("./routes/offersRoute");
// ================= Modules =============
const Pusher = require("pusher");
const roomsRoute = require("./routes/roomsRoute");
const { wss } = require("./socket");

const pusher = new Pusher({
  appId: "1762915",
  key: "d207d6ba54517230b8ab",
  secret: "76e0074d3e91abb542e3",
  cluster: "ap2",
  useTLS: true,
});
app.use("/v2/category", category);
app.use("/v2/product", product);
app.use("/v2/color", color);
app.use("/v2/color_props", color_props);
app.use("/v2/order", order);
app.use("/v2/user", user);
app.use("/v2/shipping", shipping);
app.use("/v2/return", return_itemRoute);
app.use("/v2/banner", bannerRoute);
app.use("/v2/site", infoRoute);
app.use("/v2/reason", reasonRoute);
app.use("/v2/offers", offersRoute);
app.use("/v2/rooms", roomsRoute);
app.get("/v2/command", async (req, res) => {
  // const command = await doQuery("INSERT INTO offer_rooms SET offer_id = 92");
  const command = await doQuery(`
  CREATE TABLE offer_rooms_queue (
    id int(11) NOT NULL AUTO_INCREMENT,
    room_id int(11) DEFAULT NULL,
    offer_id int(11) DEFAULT NULL,
    created_at timestamp NULL DEFAULT current_timestamp(),
    PRIMARY KEY (id)
  ) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci
`);

  res.json(command);
});
app.get("/v2", (req, res) => {
  res.send("sd");
});
const notifyMe = async (data) => {
  try {
    const notifies = await doQuery("SELECT * FROM notifyOffer");
    if (notifies && notifies?.length) {
      const scheduledDate = new Date(data?.will_av_after);
      schedule.scheduleJob(scheduledDate, async () => {
        // Your job logic here
        await doQuery(
          "INSERT INTO notifies ( user_id, text, link) VALUES (?,?,?)",
          [
            notifies[0]?.user_id,
            "The Offer Number #" +
              notifies[0]?.id +
              " Are Be Available Go To Explore This Offer..!",
            "/otherof",
          ]
        );
        pusher.trigger("my-channel", "my-event", {
          message: "hello world",
        });
      });
    }
  } catch (err) {}
  // console.log(sch);
};
notifyMe();

app.listen(3330);
