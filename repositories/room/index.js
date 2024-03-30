const groupProducts = require("../../functions/groupProducts");
const doQuery = require("../../config/doQuery");
const moment = require("moment/moment");
const cron = require("node-cron");
const pusher = require("../../pusher");
const { wss } = require("../../socket");

module.exports = class {
  constructor() { }
  async make(data) {
    const offers = await doQuery("SELECT * FROM offers WHERE id = ?", [
      data?.offer_id,
    ]);
    // console.log(offers);
    if (!offers || !offers?.length) {
      return { status: 0, message: "Offer Not Found" };
    }
    let varients = JSON.parse(offers[0]?.varients);

    let duration = moment.duration(
      moment(offers[0].will_av_after).diff(moment())
    );

    offers[0].time_av_after = {
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
      milliSeconds: moment(offers[0].will_av_after).diff(moment()),
    };

    const will_av_for_in_millSec = moment.duration(
      moment(offers[0].will_av_for).diff(moment())
    );

    offers[0].time_av_for = {
      days: will_av_for_in_millSec.days(),
      hours: will_av_for_in_millSec.hours(),
      minutes: will_av_for_in_millSec.minutes(),
      seconds: will_av_for_in_millSec.seconds(),
      milliSeconds: moment(offers[0].time_av_for).diff(moment()),
    };
    if (parseInt(offers[0]?.shippingStatus)) {
      data.shipping_price = 0;
    }
    let av_stores = offers[0]?.store?.split("***");
    let check_av_store = av_stores?.filter((item) => item == data?.store);
    if (!check_av_store || !check_av_store.length) {
      return { status: 0, message: "Offer Not Available in this store" };
    }
    if (moment(offers[0].will_av_after).diff(moment()) >= 0) {
      return { status: 0, message: "Offer Not Availabel Yet" };
    }

    if (
      moment(offers[0].will_av_after).diff(moment()) <= 0 &&
      moment(offers[0].will_av_for).diff(moment()) <= 0
    ) {
      return { status: 0, message: "Offer Endded" };
    }

    const insertRoom = await doQuery(
      "INSERT INTO offer_rooms SET offer_id = ?, cost = ?, max_members= ?, max_time=?",
      [
        data?.offer_id,
        offers[0]?.cost,
        offers[0]?.maximunJoiners,
        offers[0]?.tenderEndTime,
      ]
    );
    if (insertRoom?.affectedRows) {
      return { status: 1, message: "Room Created" };
    } else {
      return { status: 0, message: "Room Not Inserted", reason: insertRoom };
    }
  }

  async join(data) {
    const {
      user_id,
      user_image,
      user_joined_date,
      user_name,
      cost,
      rooms_id,
      offer_id,
    } = data;

    // التحقق من وجود الغرفة للعرض
    const roomExistQuery =
      "SELECT * FROM offer_rooms WHERE id = ? AND offer_id = ?";
    const roomExistValues = [rooms_id, offer_id];
    const roomExistResult = await doQuery(roomExistQuery, roomExistValues);
    if (!roomExistResult || roomExistResult.length === 0) {
      const offers = await doQuery("SELECT * FROM offers WHERE id = ?", [
        data?.offer_id,
      ]);
      // console.log(offers);
      if (!offers || !offers?.length) {
        return { status: 0, message: "Offer Not Found" };
      }
      let varients = JSON.parse(offers[0]?.varients);

      let duration = moment.duration(
        moment(offers[0].will_av_after).diff(moment())
      );

      offers[0].time_av_after = {
        days: duration.days(),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
        milliSeconds: moment(offers[0].will_av_after).diff(moment()),
      };

      const will_av_for_in_millSec = moment.duration(
        moment(offers[0].will_av_for).diff(moment())
      );

      offers[0].time_av_for = {
        days: will_av_for_in_millSec.days(),
        hours: will_av_for_in_millSec.hours(),
        minutes: will_av_for_in_millSec.minutes(),
        seconds: will_av_for_in_millSec.seconds(),
        milliSeconds: moment(offers[0].time_av_for).diff(moment()),
      };
      if (parseInt(offers[0]?.shippingStatus)) {
        data.shipping_price = 0;
      }
      let av_stores = offers[0]?.store?.split("***");
      let check_av_store = av_stores?.filter((item) => item == data?.store);
      if (!check_av_store || !check_av_store.length) {
        return { status: 0, message: "Offer Not Available in this store" };
      }
      if (moment(offers[0].will_av_after).diff(moment()) >= 0) {
        return { status: 0, message: "Offer Not Availabel Yet" };
      }

      if (
        moment(offers[0].will_av_after).diff(moment()) <= 0 &&
        moment(offers[0].will_av_for).diff(moment()) <= 0
      ) {
        return { status: 0, message: "Offer Endded" };
      }

    }


    // التحقق من وجود المستخدم في الغرفة
    const userInRoomQuery =
      "SELECT * FROM rooms_joined WHERE user_id = ? AND rooms_id = ?";
    const userInRoomValues = [user_id, rooms_id];
    const userInRoomResult = await doQuery(userInRoomQuery, userInRoomValues);
    const oldRooms = await doQuery(
      "SELECT * FROM rooms_joined WHERE rooms_id = ?",
      [rooms_id]
    );

    if (oldRooms?.length == roomExistResult[0]?.max_members) {

      return { status: 0, message: "Room already completed" };

    }
    if (userInRoomResult.length > 0) {
      return { status: 0, message: "You are already joined in this room" };
    }

    // التحقق من توفر جميع البيانات المطلوبة
    const requiredFields = [
      "user_id",
      "user_image",
      "user_name",
      "cost",
      "rooms_id",
      "offer_id",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return { status: 0, message: `Missing field: ${field}` };
      }
    }

    const query =
      "INSERT INTO rooms_joined (user_id, user_image, user_joined_date, user_name, cost, rooms_id) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      user_id,
      user_image,
      user_joined_date,
      user_name,
      cost,
      rooms_id,
    ];
    pusher.trigger("my-channel", "NewJoiner", {
      message: "New Person Joined",
      data: [],
    });

    try {
      await doQuery(query, values);
      const newRooms = await doQuery(
        "SELECT * FROM rooms_joined WHERE rooms_id = ?",
        [rooms_id]
      );
      const schedule = require('node-schedule');

      const getOffer = await doQuery("SELECT * FROM offers WHERE id = ?", [
        offer_id,
      ]);
      

      if (newRooms?.length == roomExistResult[0]?.max_members) {
        pusher.trigger("my-channel", "startTender", {
          message: "Tender Began",
          data: newRooms,
        });
        // ===================================================
        const job = schedule.scheduleJob(
          new Date(Date.now() + roomExistResult[0]?.max_time * 1 * 60 * 1000),
          async function () {
            await doQuery(
              `UPDATE offers
      SET will_av_after = DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY),
          will_av_for = DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), stopped = 1 WHERE id = ?`,
              [roomExistResult[0]?.offer_id]
            );
          }
        );
        const offerProductsDetails = (JSON.parse(getOffer[0]?.varients))

        if (getOffer[0]?.isTendered) {
          await doQuery("UPDATE offers SET started = ? WHERE id = ?", [
            1,
            getOffer[0]?.id,
          ]);
          const scheduledDate = new Date(getOffer[0]?.rate_time);
          const job = cron.schedule(`*/${getOffer[0]?.rate_time / 1000} * * * * *`, async () => {
            const offerSelected = await doQuery("SELECT * FROM offers WHERE id = ?", [
              getOffer[0]?.id,
            ]);
            if (!offerSelected[0]?.hold && !offerSelected[0]?.stopped&& !offerSelected[0]?.success&& !offerSelected[0]?.archive) {
              let varients = JSON.parse(offerSelected[0]?.varients);
              for (let i = 0; i < varients.length; i++) {
                const item = varients[i];
                const newPrice = parseFloat(item.new_price);
                const minPrice = parseFloat(item.min_price);
                const rateTime = parseInt(offerSelected[0]?.rate_time);
                const rateMoney = parseFloat(item.rate_money);

                await decreasePrice(
                  getOffer[0]?.id,
                  i,
                  newPrice,
                  minPrice,
                  rateTime,
                  rateMoney
                );
                pusher.trigger("my-channel", "priceReduced", {
                  message: "Price Reduced",
                  data: [],
                });
              }
            }else if(offerSelected[0]?.hold&& !offerSelected[0]?.stopped&& !offerSelected[0]?.success&& !offerSelected[0]?.archive){
              pusher.trigger("my-channel", "priceReduced", {
                message: "Price Reduced",
                data: [],
              });
              setTimeout(async ()=>{
                const holded = await doQuery("UPDATE offers SET hold = 0 WHERE id = ?", [
                  getOffer[0]?.offer_id,
                ]);
              }, 120000)
            }
          });
          async function decreasePrice(
            offerId,
            varientIndex,
            newPrice,
            minPrice,
            rateTime,
            rateMoney
          ) {
            if (newPrice <= minPrice) return;
            const updatedPrice = newPrice - rateMoney;

            const x = await doQuery(
              "UPDATE offers SET varients = JSON_SET(varients, '$[" +
              varientIndex +
              "].new_price', ?) WHERE id = ?",
              [updatedPrice, offerId]
            );
              pusher.trigger("my-channel", "priceReduced", {
                message: "Price Reduced",
                data: [offerId, updatedPrice],
              });

            const nextTime = moment().add(rateTime, 'minutes');
            const timeDiff = moment(nextTime).diff(moment());
            // setTimeout(async () => {
            // const updatedPrice = newPrice - rateMoney;
            // await decreasePrice(
            //   offerId,
            //   varientIndex,
            //   updatedPrice,
            //   minPrice,
            //   rateTime,
            //   rateMoney
            // );
            // const getOffer = await doQuery("SELECT * FROM offers WHERE id = ?", [
            //   offer_id,
            // ]);
            // let varients = JSON.parse(getOffer[0]?.varients);


            // }, rateTime);
          }
        }
        // ===================================================
      }

      return { status: 1, message: "Data inserted successfully" };
    } catch (error) {
      return {
        status: 0,
        message: "Failed to insert data",
        error: error.message,
      };
    }
  }

  async archive(data) {
    const Archive = await doQuery(
      "UPDATE offers SET archive = ? , success = ? , notes = ?  WHERE id = ?",
      [data?.archive, data?.success, data?.notes,data?.offer_id]
    );
    if (Archive?.changedRows) {
      return { status: 1, message: "Offer Editted" };
    } else {
      return { status: 0, message: "Offer Not Editted" };
    }
  }

  async Select_Offer_Rooms(data) {
    const getRooms = await doQuery(
      `
        SELECT 
            offer_rooms.*,
            offer_rooms.id AS room_id,
            offers.*
        FROM 
            offer_rooms 
        JOIN 
            offers ON offer_rooms.offer_id = offers.id 
        WHERE 
            offer_rooms.offer_id = ?
        GROUP BY 
            offer_rooms.id
        `,
      [data?.offer_id]
    );

 

    try {
      const getQueues = await doQuery("SELECT * FROM rooms_joined WHERE rooms_id = ?", [getRooms[0]?.room_id]);
      if (getRooms && getRooms?.length)
        getRooms[0].participants = getQueues
      // const getQueuesJoined = await doQuery("SELECT * FROM queue_rooms_joined WHERE queue_id = ?", [getRooms[0]?.queue?.id]);
      // getRooms[0].queue.joiners = getQueuesJoined?.sort((a, b) => a - b)
    } catch (e) {
      console.log(e)
    }
    const OfferRepository = require("../offer/index");
    const offerRepository = new OfferRepository();

    const offerDetails = await offerRepository.select_offer_by_id({
      type: "user",
      offer_id: data?.offer_id,
    });
    if (getRooms && getRooms.length) {
      getRooms.forEach((room) => {
        try {
          room.varients = JSON.parse(room.varients);
          room.varients.forEach((variant) => {
            const matchingVariant =
              offerDetails?.message[0]?.products[0]?.colors.find(
                (v) => v.id == variant.color_id
              );

            if (matchingVariant) {
              variant.data = matchingVariant;
            }
          });
          if (offerDetails?.message && offerDetails.message.length) {
            room.offer = offerDetails.message[0];
          }
        } catch (e) {
          console.log(e);
        }
        // room.participants = JSON.parse(room.participants);
      });
    }

    return { status: 1, message: getRooms };
  }


  async join_queue(data) {
    const {
      user_id,
      user_image,
      user_joined_date,
      user_name,
      cost,
      rooms_id,
      offer_id,
      queue_id
    } = data;



    // التحقق من وجود المستخدم في الغرفة
    const userInRoomQuery =
      "SELECT * FROM queue_rooms_joined WHERE user_id = ? AND queue_id = ?";
    const userInRoomValues = [user_id, queue_id];
    const userInRoomResult = await doQuery(userInRoomQuery, userInRoomValues);
    const oldRooms = await doQuery(
      "SELECT * FROM queue_rooms_joined WHERE queue_id = ?",
      [queue_id]
    );

    if (oldRooms?.length == 5) {

      return { status: 0, message: "Queue already completed" };

    }
    if (userInRoomResult.length > 0) {
      return { status: 0, message: "You are already joined in this Queue" };
    }

    // التحقق من توفر جميع البيانات المطلوبة
    const requiredFields = [
      "user_id",
      "user_image",
      "user_name",

      "rooms_id",
      "offer_id",
      "queue_id"
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return { status: 0, message: `Missing field: ${field}` };
      }
    }

    try {

      const selectaya = await doQuery("SELECT * FROM queue_rooms_joined WHERE queue_id = ?", [queue_id]);
      const new_order_no = selectaya && selectaya?.length ? selectaya[0]?.order_no + 1 : 1;

      const query =
        "INSERT INTO queue_rooms_joined (user_id, user_image, user_name, rooms_id, queue_id, order_no) VALUES (?, ?, ?, ?, ?, ?)";
      const values = [
        user_id,
        user_image,
        user_name,
        rooms_id,
        queue_id,
        new_order_no
      ];
      const JoinQueues = await doQuery(query, values);
      pusher.trigger("my-channel", "newUserJoined", {
        message: "New User Joined",
      });

      if (JoinQueues?.insertId) {
        if (new_order_no == 1 || selectaya[0]?.order_no < 1) {
          this.changeUserQueueStatus({ user_status: "active", order_no: 1, queue_id: queue_id, user_id })
        }
        // await doQuery("DELETE FROM rooms_joined WHERE user_id = ? AND rooms_id = ?", [
        //   user_id,
        //   rooms_id
        // ])
        return { status: 1, message: "Joined successfully" };
      } else return { status: 0, message: "Not Joined" };
    } catch (error) {
      return {
        status: 0,
        message: "Failed to insert data",
        error: error.message,
      };
    }
  }

  async Select_Offer_Rooms_Queue(data) {

    const getRooms = await doQuery(
      `SELECT *, JSON_ARRAYAGG(
        JSON_OBJECT(
          'user_id', queue_rooms_joined.user_id,
          'user_name', queue_rooms_joined.user_name,
          'user_image', queue_rooms_joined.user_image
        )
      ) AS participants
      FROM queue_rooms_joined
      JOIN offer_rooms_queue ON queue_rooms_joined.queue_id = offer_rooms_queue.id
      JOIN offer_rooms ON offer_rooms_queue.room_id = offer_rooms.id
      JOIN offers ON offer_rooms.offer_id = offers.id
      WHERE offers.id = ?`,
      [data?.offer_id]
    );
    const OfferRepository = require("../offer/index");
    const offerRepository = new OfferRepository();

    const offerDetails = await offerRepository.select_offer_by_id({
      type: "user",
      offer_id: data?.offer_id,
    });

    // const getRooms = await doQuery("SELECT * FROM offer_rooms_queue")

    // if (getRooms && getRooms.length) {
    //   getRooms.forEach((room) => {
    //     try {
    //       room.varients = JSON.parse(room.varients);
    //       room.varients.forEach((variant) => {
    //         const matchingVariant =
    //           offerDetails?.message[0]?.products[0]?.colors.find(
    //             (v) => v.id == variant.color_id
    //           );

    //         if (matchingVariant) {
    //           variant.data = matchingVariant;
    //         }
    //       });
    //       if (offerDetails?.message && offerDetails.message.length) {
    //         room.offer = offerDetails.message[0];
    //       }
    //     } catch (e) {
    //       console.log(e);
    //     }
    //     room.participants = JSON.parse(room.participants);
    //   });
    // }
    const query = await doQuery(`SELECT JSON_ARRAYAGG(
  JSON_OBJECT(
      'user_id', queue_rooms_joined.user_id,
      'user_name', queue_rooms_joined.user_name,
      'user_image', queue_rooms_joined.user_image
  )
) AS participants FROM queue_rooms_joined`)
    return { status: 1, message: getRooms };
  }

  async changeUserQueueStatus(data) {
    const selectaya = await doQuery("SELECT * FROM queue_rooms_joined WHERE queue_id = ?", [data?.queue_id]);

    const update = await doQuery("UPDATE queue_rooms_joined SET user_status = ?, order_no = ? WHERE queue_id = ? AND user_id = ?", [data?.user_status, data?.order_no, selectaya[0]?.queue_id, data?.user_id]);
    console.log(update, data)
    if (update?.affectedRows) {
      if (data?.user_status == "inactive") {
        const resetOrder = await doQuery(
          "UPDATE queue_rooms_joined SET order_no = order_no - 1 WHERE order_no > ? AND queue_id = ?",
          [data?.order_no, data?.queue_id]
        );
        const updateActive = await doQuery("UPDATE queue_rooms_joined SET user_status = ? WHERE queue_id = ? AND order_no = ?", ["active", data?.queue_id, 1]);

      }
      pusher.trigger("my-channel", "changedUserQueueStatus", {
        message: "Tender Began",
      });
      return { status: 1, message: "Updated" };
    } else {
      return { status: 0, message: "Not Updated" };
    }
  }

  async updateOfferPrice(data) {
    try {
      const requiredFields = ["newPrice", "offerId", "userId"];
      for (const field of requiredFields) {
        if (!data[field]) {
          return { status: 0, message: `Missing field: ${field}` };
        }
      }

      // التحقق من وجود الغرفة
      const roomExistQuery = "SELECT * FROM offer_rooms WHERE id = ?";
      const roomExistValues = [data.rooms_id];
      const roomExistResult = await doQuery(roomExistQuery, roomExistValues);
      if (!roomExistResult || roomExistResult.length === 0) {
        return { status: 0, message: "Room not found" };
      }

      // التحقق من وجود العرض في الغرفة
      const offerExistQuery =
        "SELECT * FROM offer_rooms WHERE id = ? AND offer_id = ?";
      const offerExistValues = [data.rooms_id, data.offerId];
      const offerExistResult = await doQuery(offerExistQuery, offerExistValues);
      if (!offerExistResult || offerExistResult.length === 0) {
        return { status: 0, message: "Offer not found in the room" };
      }

      // التحقق من وجود المستخدم في الغرفة
      const userInRoomQuery =
        "SELECT * FROM rooms_joined WHERE user_id = ? AND rooms_id = ?";
      const userInRoomValues = [data.userId, data.rooms_id];
      const userInRoomResult = await doQuery(userInRoomQuery, userInRoomValues);
      if (!userInRoomResult || userInRoomResult.length === 0) {
        return { status: 0, message: "User not joined in this room" };
      }

      // التحقق من أن السعر المحدث أقل من أو يساوي الحد الأدنى للسعر (min_price)
      if (data.newPrice < offerExistResult[0].min_price) {
        return { status: 0, message: "New price is lower than minimum price" };
      }

      // تحديث السعر في جدول العروض
      const updateOfferQuery = "UPDATE offers SET new_price = ? WHERE id = ?";
      const updateOfferValues = [data.newPrice, data.offerId];
      await doQuery(updateOfferQuery, updateOfferValues);

      // تحديث السعر للمشاركين في الغرفة
      const updateRoomCostQuery =
        "UPDATE rooms_joined SET cost = ? WHERE user_id = ?";
      const updateRoomCostValues = [data.newPrice, data.userId];
      await doQuery(updateRoomCostQuery, updateRoomCostValues);

      return { status: 1, message: "Offer price updated successfully" };
    } catch (error) {
      return {
        status: 0,
        message: "Failed to update offer price",
        error: error.message,
      };
    }
  }
};
