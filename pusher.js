const Pusher = require("pusher");

    const pusher = new Pusher({
  appId: "1762915",
  key: "d207d6ba54517230b8ab",
  secret: "76e0074d3e91abb542e3",
  cluster: "ap2",
  useTLS: true,
});
module.exports = pusher;
