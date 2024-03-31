const groupProducts = require("../../functions/groupProducts");
const doQuery = require("../../config/doQuery");
const moment = require("moment/moment");
const cron = require("node-cron");
const pusher = require("../../pusher");
const schedule = require('node-schedule');

module.exports = class {
  constructor() {}
  async make(data) {
    const product = await doQuery("SELECT * FROM product WHERE id = ?", [
      data?.product_id,
    ]);
    if (!product || !product?.length) {
      return { status: 0, message: "Product Not Found" };
    }
    // console.log(data);
    if (data?.shippingStatus) {
      data.shippingStatus = 1;
    } else {
      data.shippingStatus = 0;
    }
    const productStore = product[0]?.store?.split("***");
    const offerStore = data?.store?.split("***");
    let NotFoundStore = [];
    let found = true;

    if (data?.varients.startsWith("***")) {
      data.varients = data?.varients?.slice(3);
    }

    if (data?.varients.endsWith("***")) {
      data.varients = data?.varients?.slice(0, -3);
    }
    let varients = data?.varients?.split("***");
    // console.log(data?.varients);
    let offerProductsDetails = varients?.map((item) => {
      return {
        color_id: item?.split("*")[0],
        prop_id: item?.split("*")[1],
        prop_value_id: item?.split("*")[2],
        av_quantity: item?.split("*")[3],
        remainig_quantity: item?.split("*")[3],
        old_price: item?.split("*")[4],
        new_price: item?.split("*")[5],
        min_price: item?.split("*")[6],
        rate_money: item?.split("*")[7],
      };
    });

    if (
      !varients ||
      !varients?.length ||
      !offerProductsDetails ||
      !offerProductsDetails.length
    ) {
      return { status: 0, message: "Please Add Varients" };
    }

    let colors = [];
    let props = [];
    let props_values = [];
    for (let i = 0; i < offerProductsDetails.length; i++) {
      let item = offerProductsDetails[i];
      const color = await doQuery(
        "SELECT * FROM colors WHERE id = ? AND product_id = ?",
        [item?.color_id, data?.product_id]
      );
      colors.push(color[0]);
      if (!color || !color?.length) {
        colors = [];
        break;
      }
      if (item?.prop_id) {
        const prop = await doQuery(
          "SELECT * FROM product_props WHERE id = ? AND color_id = ?",
          [item?.prop_id, item?.color_id]
        );
        props.push(prop[0]);
        if (!prop || !prop?.length) {
          props = [];
          break;
        }
        const prop_value = await doQuery(
          "SELECT * FROM product_props_value WHERE id = ? AND prop_id = ?",
          [item?.prop_value_id, item?.prop_id]
        );
        props_values.push(prop_value[0]);
        if (!prop_value || !prop_value?.length) {
          props_values = [];
          break;
        }
      }
    }
    if (!colors || !colors?.length) {
      return { status: 0, message: "Color Not Found In This Product" };
    }

    if (!props || !props?.length) {
      return { status: 0, message: "Prop Not Found In This Color" };
    }
    if (!props_values || !props_values?.length) {
      return { status: 0, message: "Prop Value Not Found In This Prop" };
    }

    if (
      moment(data?.will_av_for).diff(moment()) <= 0 ||
      moment(data?.will_av_after).diff(moment()) >=
        moment(data?.will_av_for).diff(moment())
    ) {
      return { status: 0, message: "Error In Offer Time" };
    }

    const insertOffer = await doQuery(
      "INSERT INTO offers SET product_id=?, store= ?, varients= ?, will_av_after= ?, will_av_for=?, shippingStatus = ?, isTendered = ?, maximunJoiners=?, cost=?, tenderEndTime=?, rate_time=?",
      [
        data?.product_id,
        data?.store,
        JSON.stringify(offerProductsDetails),
        data?.will_av_after,
        data?.will_av_for,
        data?.shippingStatus,
        data?.isTendered,
        data?.maximunJoiners,
        data?.cost,
        data?.tenderEndTime,
        data?.rate_time * 1000,
      ]
    );

    // if (data?.isTendered) {
    const insertRoom = await doQuery(
      "INSERT INTO offer_rooms SET offer_id = ?, cost = ?, max_members= ?, max_time=?",
      [
        insertOffer?.insertId,
        data?.cost ? data?.cost : 0,
        data?.maximunJoiners ? data?.maximunJoiners : 0,
        data?.tenderEndTime ? data?.tenderEndTime : 0,
      ]
    );
    const insertQueue = await doQuery(
      "INSERT INTO offer_rooms_queue SET offer_id = ?,room_id=?",
      [insertOffer?.insertId, insertRoom?.insertId]
    );
    console.log(insertQueue);
    // }

    const selectOffer = await doQuery("SELECT * FROM offers WHERE id = ?", [
      insertOffer?.insertId,
    ]);
    await doQuery("UPDATE offers SET source_offer_id=? WHERE id = ?", [
      selectOffer[0]?.id,
      insertOffer?.insertId,
    ]);

    if (insertOffer?.affectedRows) {
      return { status: 1, message: "Offer Inserted" };
    } else {
      return { status: 0, message: "Offer Not Inserted" };
    }
  }

  async copy(data) {
    // console.log(data);
    const offer = await doQuery("SELECT * FROM offers WHERE id = ?", [
      data?.offer_id,
    ]);
    if (!offer || !offer?.length) {
      return { status: 0, message: "Offer Not Found" };
    }

    const product = await doQuery("SELECT * FROM product WHERE id = ?", [
      data?.product_id,
    ]);
    if (!product || !product?.length) {
      return { status: 0, message: "Product Not Found" };
    }
    const productStore = product[0]?.store?.split("***");
    let offerStore = [];
    if (Array.isArray(data?.store)) {
      offerStore = data?.store;
    } else {
      offerStore = data?.store?.split("***");
    }
    let NotFoundStore = [];
    let found = true;

    let varients = data?.varients?.split("***");

    let offerProductsDetails = varients?.map((item) => {
      return {
        color_id: item?.split("*")[0],
        prop_id: item?.split("*")[1],
        prop_value_id: item?.split("*")[2],
        av_quantity: item?.split("*")[3],
        remainig_quantity: item?.split("*")[3],
        old_price: item?.split("*")[4],
        new_price: item?.split("*")[5],
      };
    });

    if (
      !varients ||
      !varients?.length ||
      !offerProductsDetails ||
      !offerProductsDetails.length
    ) {
      return { status: 0, message: "Please Add Varients" };
    }

    let colors = [];
    let props = [];
    let props_values = [];
    for (let i = 0; i < offerProductsDetails.length; i++) {
      let item = offerProductsDetails[i];
      const color = await doQuery(
        "SELECT * FROM colors WHERE id = ? AND product_id = ?",
        [item?.color_id, data?.product_id]
      );
      colors.push(color[0]);
      if (!color || !color?.length) {
        colors = [];
        break;
      }
      if (item?.prop_id) {
        const prop = await doQuery(
          "SELECT * FROM product_props WHERE id = ? AND color_id = ?",
          [item?.prop_id, item?.color_id]
        );
        props.push(prop[0]);
        if (!prop || !prop?.length) {
          props = [];
          break;
        }
        const prop_value = await doQuery(
          "SELECT * FROM product_props_value WHERE id = ? AND prop_id = ?",
          [item?.prop_value_id, item?.prop_id]
        );
        props_values.push(prop_value[0]);
        if (!prop_value || !prop_value?.length) {
          props_values = [];
          break;
        }
      }
    }
    if (!colors || !colors?.length) {
      return { status: 0, message: "Color Not Found In This Product" };
    }

    if (!props || !props?.length) {
      return { status: 0, message: "Prop Not Found In This Color" };
    }
    if (!props_values || !props_values?.length) {
      return { status: 0, message: "Prop Value Not Found In This Prop" };
    }

    let group = 0;
    if (data?.same && !offer[0]?.group_id) {
      group = await doQuery("INSERT INTO group_offers SET offer_source_id	= ?", [
        offer[0]?.source_offer_id,
      ]);
      // console.log(group);
      await doQuery("UPDATE offers SET group_id = ? WHERE id = ?", [
        group?.insertId,
        offer[0]?.id,
      ]);
    }
    if (data?.shippingStatus) {
      data.shippingStatus = 1;
    } else {
      data.shippingStatus = 0;
    }
    const copyOffer = await doQuery(
      "INSERT INTO offers SET source_offer_id=?, product_id=?, store=?, varients=?, will_av_after=?, will_av_for=?, group_id = ?, shippingStatus = ?",
      [
        offer[0]?.source_offer_id,
        data?.product_id ? data?.product_id : offer[0]?.product_id,
        data?.store ? data?.store : offer[0]?.store,
        data?.varients && !data?.same
          ? JSON.stringify(offerProductsDetails)
          : offer[0]?.varients,
        data?.will_av_after ? data?.will_av_after : offer[0]?.will_av_after,
        data?.will_av_for ? data?.will_av_for : offer[0]?.will_av_for,
        offer[0]?.group_id && data?.same
          ? offer[0]?.group_id
          : data?.same
          ? group?.insertId
          : null,
        data?.shippingStatus ? data?.shippingStatus : offer[0]?.shippingStatus,
      ]
    );

    if (copyOffer?.affectedRows) {
      return { status: 1, message: "Offer Copied" };
    } else {
      return { status: 0, message: "Offer Not Copied" };
    }
  }

  async select_offers(data) {
    if (data?.type != "admin") {
      return { status: 0, message: "You Are Not authorized" };
    }
    const offer = await doQuery(
      "SELECT * FROM offers ORDER BY offers.createdAt DESC"
    );
    if (!offer || !offer?.length) {
      return { status: 0, message: "Offer Not Found" };
    }
    let offers = [];
    await Promise.all(
      offer.map(async (item, index) => {
        let duration = moment.duration(
          moment(item.will_av_after).diff(moment())
        );

        item.time_av_after = {
          days: duration.days(),
          hours: duration.hours(),
          minutes: duration.minutes(),
          seconds: duration.seconds(),
          milliSeconds: moment(item.will_av_after).diff(moment()),
        };

        const will_av_for_in_millSec = moment.duration(
          moment(item.will_av_for).diff(moment())
        );

        item.time_av_for = {
          days: will_av_for_in_millSec.days(),
          hours: will_av_for_in_millSec.hours(),
          minutes: will_av_for_in_millSec.minutes(),
          seconds: will_av_for_in_millSec.seconds(),
          milliSeconds: moment(item.time_av_for).diff(moment()),
        };

        if (
          moment(item.will_av_after).diff(moment()) <= 0 &&
          moment(item.will_av_for).diff(moment()) <= 0
        ) {
          if (item.stopped == 1) {
            item.status = "Stopped";
            item.status_ar = "تم إيقافه";
          } else if (item.archive == 1) {
            item.status = "Archived";
            item.status_ar = "تمت أرشفته";
          } else if (item.success == 1) {
            item.status = "Sold Successfully";
            item.status_ar = "تمت عملية البيع بنجاح";
          } else {
            item.status = "Expired";
            item.status_ar = "منتهى";
          }
        } else {
          if (moment(item.will_av_after).diff(moment()) >= 0) {
            item.status_ar = "غير متاح بعد";
            item.status = "Not Available Yet";
          } else {
            item.status = "Available";
            item.status_ar = "متاح";
          }
          if (item.stopped == 1) {
            item.status = "Stopped";
            item.status_ar = "تم إيقافه";
          } else if (item.archive == 1) {
            item.status = "Archived";
            item.status_ar = "تمت أرشفته";
          } else if (item.success == 1) {
            item.status = "Sold Successfully";
            item.status_ar = "تمت عملية البيع بنجاح";
          } else {
            item.status = "Available";
            item.status_ar = "متاح";
          }
        }
        const product = await doQuery(
          "SELECT product.*, category.title as category_name , category.title_ar as category_name_ar FROM product JOIN category ON product.category_id = category.id WHERE product.id = ?",
          [item?.product_id]
        );

        let colors = [];
        let props = [];
        let props_values = [];
        let varient = JSON.parse(item?.varients);
        item.varients = item?.varients ? JSON.parse(item?.varients) : null;
        item.store = item?.store?.split("***");

        for (let i = 0; i < varient?.length; i++) {
          let var_item = varient[i];
          const color = await doQuery(
            "SELECT * FROM colors WHERE id = ? AND product_id = ?",
            [var_item?.color_id, item?.product_id]
          );

          if (var_item?.prop_id) {
            const prop = await doQuery(
              "SELECT * FROM product_props WHERE id = ? AND color_id = ?",
              [var_item?.prop_id, var_item?.color_id]
            );

            if (!props.filter((item) => item?.id == var_item?.prop_id)[0]) {
              props.push(prop[0]);
            }

            const prop_value = await doQuery(
              "SELECT * FROM product_props_value WHERE id = ? AND prop_id = ?",
              [var_item?.prop_value_id, var_item?.prop_id]
            );
            if (
              !props_values.filter(
                (item) => item?.id == var_item?.prop_value_id
              )[0]
            ) {
              try {
                prop_value[0].stock = var_item?.av_quantity;
                prop_value[0].remainig_stock = var_item?.remainig_quantity;
                prop_value[0].old_price = var_item?.old_price;
                prop_value[0].new_price = var_item?.new_price;
                props_values.push(prop_value[0]);
              } catch (e) {}
            }
          }
          if (!colors.filter((item) => item?.id == var_item?.color_id)[0]) {
            colors.push(color[0]);
          }
        }
        const images = await doQuery("SELECT * FROM images");
        const customerReviews = await doQuery("SELECT * FROM customer_reviews");
        let products = product;
        // console.log(products, colors, images, props, props_values);
        await groupProducts({
          products,
          colors: colors ? colors : [],
          images: images ? images : [],
          customerReviews: customerReviews ? customerReviews : [],
          props: props ? props : [],
          props_values: props_values ? props_values : [],
        });
        item.products = products;
        offers.push(item);
        const levelCount = await doQuery(
          "SELECT COUNT(*) FROM orders WHERE offer_id = ?",
          [item?.id]
        );
        const getAll = await doQuery(
          `SELECT
        COUNT(*) AS levelCount,
        SUM(CASE WHEN userLevel < 2 THEN 1 ELSE 0 END) AS levelOneCount,
        SUM(CASE WHEN userLevel = 2 THEN 1 ELSE 0 END) AS levelSecondCount,
        SUM(CASE WHEN userLevel < 10 AND userLevel > 2 THEN 1 ELSE 0 END) AS levelLtTenCount,
        SUM(CASE WHEN userLevel > 10 THEN 1 ELSE 0 END) AS levelGtTenCount,
        CASE
          WHEN COUNT(*) > 0 THEN SUM(CASE WHEN userLevel < 2 THEN 1 ELSE 0 END) / COUNT(*)
          ELSE 1
        END AS levelOneRate,
        CASE
          WHEN COUNT(*) > 0 THEN SUM(CASE WHEN userLevel = 2 THEN 1 ELSE 0 END) / COUNT(*)
          ELSE 0
        END AS levelSecondRate,
        CASE
          WHEN COUNT(*) > 0 THEN SUM(CASE WHEN userLevel < 10 AND userLevel > 2 THEN 1 ELSE 0 END) / COUNT(*)
          ELSE 0
        END AS levelLtTenRate,
        CASE
          WHEN COUNT(*) > 0 THEN SUM(CASE WHEN userLevel > 10 THEN 1 ELSE 0 END) / COUNT(*)
          ELSE 0
        END AS levelGtTenRate
      FROM
        orders
      WHERE
        offer_id = ?`,
          [item?.id]
        );
        item.offer_order_count = getAll[0]?.levelCount;
        getAll.map((count_item) => {
          item.levelOne = {
            count: parseInt(count_item?.levelOneCount)
              ? parseInt(count_item?.levelOneCount)
              : 0,
            rate: parseInt(count_item?.levelOneRate),
          };
          item.levelSecond = {
            count: parseInt(count_item?.levelSecondCount)
              ? parseInt(count_item?.levelSecondCount)
              : 0,
            rate: parseInt(count_item?.levelSecondRate),
          };
          item.LevelLtTen = {
            count: parseInt(count_item?.levelLtTenCount)
              ? parseInt(count_item?.levelLtTenCount)
              : 0,
            rate: parseInt(count_item?.levelLtTenRate),
          };
          item.LevelGtTen = {
            count: parseInt(count_item?.levelGtTenCount)
              ? parseInt(count_item?.levelGtTenCount)
              : 0,
            rate: parseInt(count_item?.levelGtTenRate),
          };
        });
      })
    );
    if (offers.length) {
      offers.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }
    return { status: 1, message: offers };
  }

  async select_user_offers(data) {
    if (data?.type != "user") {
      return { status: 0, message: "You Are Not authorized" };
    }
    const offer = await doQuery(
      "SELECT * FROM offers ORDER BY offers.createdAt DESC"
    );
    if (!offer || !offer?.length) {
      return { status: 0, message: "Offer Not Found" };
    }

    let offers = [];
    await Promise.all(
      offer.map(async (item, index) => {
        let duration = moment.duration(
          moment(item.will_av_after).diff(moment())
        );
        item.time_av_after = {
          days: duration.days(),
          hours: duration.hours(),
          minutes: duration.minutes(),
          seconds: duration.seconds(),
          milliSeconds: moment(item.will_av_after).diff(moment()),
        };

        const will_av_for_in_millSec = moment.duration(
          moment(item.will_av_for).diff(moment())
        );

        item.time_av_for = {
          days: will_av_for_in_millSec.days(),
          hours: will_av_for_in_millSec.hours(),
          minutes: will_av_for_in_millSec.minutes(),
          seconds: will_av_for_in_millSec.seconds(),
          milliSeconds: moment(item.time_av_for).diff(moment()),
        };
        if (
          (moment(item.will_av_after).diff(moment()) <= 0 &&
            moment(item.will_av_for).diff(moment()) <= 0) ||
          item?.stopped ||
          item?.archive ||
          item?.success
        ) {
          return;
        } else {
          const product = await doQuery(
            "SELECT product.*, category.title as category_name , category.title_ar as category_name_ar FROM product JOIN category ON product.category_id = category.id WHERE product.id = ?",
            [item?.product_id]
          );

          let colors = [];
          let props = [];
          let props_values = [];
          let varient = JSON.parse(item?.varients);
          item.store = item?.store?.split("***");
          item.varients = item?.varients ? JSON.parse(item?.varients) : null;

          for (let i = 0; i < varient?.length; i++) {
            let var_item = varient[i];
            // console.log("var_item", var_item);
            const color = await doQuery(
              "SELECT * FROM colors WHERE id = ? AND product_id = ?",
              [var_item?.color_id, item?.product_id]
            );
            // console.log(color);

            if (var_item?.prop_id) {
              const prop = await doQuery(
                "SELECT * FROM product_props WHERE id = ? AND color_id = ?",
                [var_item?.prop_id, var_item?.color_id]
              );

              if (!props.filter((item) => item?.id == var_item?.prop_id)[0]) {
                props.push(prop[0]);
              }

              const prop_value = await doQuery(
                "SELECT * FROM product_props_value WHERE id = ? AND prop_id = ?",
                [var_item?.prop_value_id, var_item?.prop_id]
              );
              if (
                !props_values.filter(
                  (item) => item?.id == var_item?.prop_value_id
                )[0]
              ) {
                try {
                  prop_value[0].stock = var_item?.av_quantity;
                  prop_value[0].remainig_stock = var_item?.remainig_quantity;
                  prop_value[0].old_price = var_item?.old_price;
                  prop_value[0].new_price = var_item?.new_price;
                  props_values.push(prop_value[0]);
                } catch (e) {}
              }
            }
            if (!colors.filter((item) => item?.id == var_item?.color_id)[0]) {
              colors.push(color[0]);
            }
          }
          const images = await doQuery("SELECT * FROM images");
          const customerReviews = await doQuery(
            "SELECT * FROM customer_reviews"
          );
          let products = product;
          // console.log(products, colors, images, props, props_values);
          await groupProducts({
            products,
            colors: colors ? colors : [],
            images: images ? images : [],
            customerReviews: customerReviews ? customerReviews : [],
            props: props ? props : [],
            props_values: props_values ? props_values : [],
          });
          item.products = products;
          offers.push(item);
          const getRoom = await doQuery(
            "SELECT * FROM offer_rooms WHERE offer_rooms.`offer_id` = ?",
            [item?.id]
          );
          if (getRoom && getRoom?.length) {
            const getRoomJoined = await doQuery(
              "SELECT * FROM rooms_joined WHERE rooms_id = ?",
              [getRoom[0]?.id]
            );
            item.joiners = getRoomJoined;
            item.room = getRoom[0];
          }

          const getAll = await doQuery(
            `SELECT
          COUNT(*) AS levelCount,
          SUM(CASE WHEN userLevel < 2 THEN 1 ELSE 0 END) AS levelOneCount,
          SUM(CASE WHEN userLevel = 2 THEN 1 ELSE 0 END) AS levelSecondCount,
          SUM(CASE WHEN userLevel < 10 AND userLevel > 2 THEN 1 ELSE 0 END) AS levelLtTenCount,
          SUM(CASE WHEN userLevel > 10 THEN 1 ELSE 0 END) AS levelGtTenCount,
          CASE
            WHEN COUNT(*) > 0 THEN SUM(CASE WHEN userLevel < 2 THEN 1 ELSE 0 END) / COUNT(*)
            ELSE 1
          END AS levelOneRate,
          CASE
            WHEN COUNT(*) > 0 THEN SUM(CASE WHEN userLevel = 2 THEN 1 ELSE 0 END) / COUNT(*)
            ELSE 0
          END AS levelSecondRate,
          CASE
            WHEN COUNT(*) > 0 THEN SUM(CASE WHEN userLevel < 10 AND userLevel > 2 THEN 1 ELSE 0 END) / COUNT(*)
            ELSE 0
          END AS levelLtTenRate,
          CASE
            WHEN COUNT(*) > 0 THEN SUM(CASE WHEN userLevel > 10 THEN 1 ELSE 0 END) / COUNT(*)
            ELSE 0
          END AS levelGtTenRate
        FROM
          orders
        WHERE
          offer_id = ?`,
            [item?.id]
          );
          item.offer_order_count = getAll[0]?.levelCount;
          getAll.map((count_item) => {
            // console.log("count_item", count_item);
            item.levelOne = {
              count: parseInt(count_item?.levelOneCount)
                ? parseInt(count_item?.levelOneCount)
                : 0,
              rate: parseInt(count_item?.levelOneRate) * 100,
            };
            item.levelSecond = {
              count: parseInt(count_item?.levelSecondCount)
                ? parseInt(count_item?.levelSecondCount)
                : 0,
              rate: parseInt(count_item?.levelSecondRate) * 100,
            };
            item.LevelLtTen = {
              count: parseInt(count_item?.levelLtTenCount)
                ? parseInt(count_item?.levelLtTenCount)
                : 0,
              rate: parseInt(count_item?.levelLtTenRate) * 100,
            };
            item.LevelGtTen = {
              count: parseInt(count_item?.levelGtTenCount)
                ? parseInt(count_item?.levelGtTenCount)
                : 0,
              rate: parseInt(count_item?.levelGtTenRate) * 100,
            };
          });
        }
      })
    );

    if (offers.length) {
      offers.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }
    return { status: 1, message: offers };
  }

  async updateOfferHold(data) {
    const holded = await doQuery("UPDATE offers SET hold = ? WHERE id = ?", [
      data?.hold,
      data?.offer_id,
    ]);
    if (holded?.affectedRows) {
      const x = await doQuery(
        "Update rooms_joined SET user_status = ? WHERE user_id = ? AND rooms_id = ?",
        [data?.user_status, data?.user_id, data?.rooms_id]
      );
      pusher.trigger("my-channel", "priceReduced", {
        message: "Price Reduced",
        data: [],
      });
      return { status: 1, message: " Holded Successfully" };
    } else {
      return { status: 0, message: "Not Holded Already" };
    }
  }

  async select_offer_by_id(data) {
    if (data?.type != "user") {
      return { status: 0, message: "You Are Not authorized" };
    }
    const offer = await doQuery("SELECT * FROM offers WHERE id=?", [
      data?.offer_id,
    ]);
    if (!offer || !offer?.length) {
      return { status: 0, message: "Offer Not Found" };
    }
    let offers = [];
    await Promise.all(
      offer.map(async (item, index) => {
        if (item?.id == data?.offer_id) {
          let duration = moment.duration(
            moment(item.will_av_after).diff(moment())
          );

          item.time_av_after = {
            days: duration.days(),
            hours: duration.hours(),
            minutes: duration.minutes(),
            seconds: duration.seconds(),
            milliSeconds: moment(item.will_av_after).diff(moment()),
          };

          const will_av_for_in_millSec = moment.duration(
            moment(item.will_av_for).diff(moment())
          );

          item.time_av_for = {
            days: will_av_for_in_millSec.days(),
            hours: will_av_for_in_millSec.hours(),
            minutes: will_av_for_in_millSec.minutes(),
            seconds: will_av_for_in_millSec.seconds(),
            milliSeconds: moment(item.time_av_for).diff(moment()),
          };
          if (
            (moment(item.will_av_after).diff(moment()) <= 0 &&
              moment(item.will_av_for).diff(moment()) <= 0) ||
            item?.stopped ||
            item?.archive ||
            item?.success
          ) {
            console.log(item);

            return;
          } else {
            const product = await doQuery(
              "SELECT product.*, category.title as category_name , category.title_ar as category_name_ar FROM product JOIN category ON product.category_id = category.id WHERE product.id = ?",
              [item?.product_id]
            );

            let colors = [];
            let props = [];
            let props_values = [];
            let varient = JSON.parse(item?.varients);
            item.store = item?.store?.split("***");
            item.varients = item?.varients ? JSON.parse(item?.varients) : null;

            for (let i = 0; i < varient?.length; i++) {
              let var_item = varient[i];
              // console.log("var_item", var_item);
              const color = await doQuery(
                "SELECT * FROM colors WHERE id = ? AND product_id = ?",
                [var_item?.color_id, item?.product_id]
              );
              // console.log(color);

              if (var_item?.prop_id) {
                const prop = await doQuery(
                  "SELECT * FROM product_props WHERE id = ? AND color_id = ?",
                  [var_item?.prop_id, var_item?.color_id]
                );

                if (!props.filter((item) => item?.id == var_item?.prop_id)[0]) {
                  props.push(prop[0]);
                }

                const prop_value = await doQuery(
                  "SELECT * FROM product_props_value WHERE id = ? AND prop_id = ?",
                  [var_item?.prop_value_id, var_item?.prop_id]
                );
                if (
                  !props_values.filter(
                    (item) => item?.id == var_item?.prop_value_id
                  )[0]
                ) {
                  try {
                    prop_value[0].stock = var_item?.av_quantity;
                    prop_value[0].remainig_stock = var_item?.remainig_quantity;
                    prop_value[0].old_price = var_item?.old_price;
                    prop_value[0].new_price = var_item?.new_price;
                    props_values.push(prop_value[0]);
                  } catch (e) {}
                }
              }
              if (!colors.filter((item) => item?.id == var_item?.color_id)[0]) {
                colors.push(color[0]);
              }
            }
            const images = await doQuery("SELECT * FROM images");
            const customerReviews = await doQuery(
              "SELECT * FROM customer_reviews"
            );
            let products = product;
            // console.log(products, colors, images, props, props_values);
            await groupProducts({
              products,
              colors: colors ? colors : [],
              images: images ? images : [],
              customerReviews: customerReviews ? customerReviews : [],
              props: props ? props : [],
              props_values: props_values ? props_values : [],
            });
            item.products = products;
            offers.push(item);
            const getAll = await doQuery(
              `SELECT
          COUNT(*) AS levelCount,
          SUM(CASE WHEN userLevel < 2 THEN 1 ELSE 0 END) AS levelOneCount,
          SUM(CASE WHEN userLevel = 2 THEN 1 ELSE 0 END) AS levelSecondCount,
          SUM(CASE WHEN userLevel < 10 AND userLevel > 2 THEN 1 ELSE 0 END) AS levelLtTenCount,
          SUM(CASE WHEN userLevel > 10 THEN 1 ELSE 0 END) AS levelGtTenCount,
          CASE
            WHEN COUNT(*) > 0 THEN SUM(CASE WHEN userLevel < 2 THEN 1 ELSE 0 END) / COUNT(*)
            ELSE 1
          END AS levelOneRate,
          CASE
            WHEN COUNT(*) > 0 THEN SUM(CASE WHEN userLevel = 2 THEN 1 ELSE 0 END) / COUNT(*)
            ELSE 0
          END AS levelSecondRate,
          CASE
            WHEN COUNT(*) > 0 THEN SUM(CASE WHEN userLevel < 10 AND userLevel > 2 THEN 1 ELSE 0 END) / COUNT(*)
            ELSE 0
          END AS levelLtTenRate,
          CASE
            WHEN COUNT(*) > 0 THEN SUM(CASE WHEN userLevel > 10 THEN 1 ELSE 0 END) / COUNT(*)
            ELSE 0
          END AS levelGtTenRate
        FROM
          orders
        WHERE
          offer_id = ?`,
              [item?.id]
            );
            item.offer_order_count = getAll[0]?.levelCount;
            getAll.map((count_item) => {
              // console.log("count_item", count_item);
              item.levelOne = {
                count: parseInt(count_item?.levelOneCount)
                  ? parseInt(count_item?.levelOneCount)
                  : 0,
                rate: parseInt(count_item?.levelOneRate) * 100,
              };
              item.levelSecond = {
                count: parseInt(count_item?.levelSecondCount)
                  ? parseInt(count_item?.levelSecondCount)
                  : 0,
                rate: parseInt(count_item?.levelSecondRate) * 100,
              };
              item.LevelLtTen = {
                count: parseInt(count_item?.levelLtTenCount)
                  ? parseInt(count_item?.levelLtTenCount)
                  : 0,
                rate: parseInt(count_item?.levelLtTenRate) * 100,
              };
              item.LevelGtTen = {
                count: parseInt(count_item?.levelGtTenCount)
                  ? parseInt(count_item?.levelGtTenCount)
                  : 0,
                rate: parseInt(count_item?.levelGtTenRate) * 100,
              };
            });
          }
        }
      })
    );
    if (offers.length) {
      offers.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }
    return { status: 1, message: offers };
  }

  // ==============================================
  async makeOrder(data) {
    const offers = await doQuery("SELECT * FROM offers WHERE id = ?", [
      data?.offer_id,
    ]);

    // console.log(offers);
    if (!offers || !offers?.length) {
      return { status: 0, message: "Offer Not Found" };
    }
    // console.log(offers);
    if (!offers[0]?.hold && offers[0]?.isTendered) {
      return { status: 0, message: "" };
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

    const product = await doQuery("SELECT * FROM product WHERE id = ?", [
      offers[0]?.product_id,
    ]);
    if (!product || !product?.length) {
      return { status: 0, message: "Product Not Found" };
    }

    const colors = await doQuery(
      "SELECT * FROM colors WHERE id = ? AND product_id = ?",
      [data?.color_id, offers[0]?.product_id]
    );
    if (!colors || !colors?.length) {
      return { status: 0, message: "Color Not Found" };
    }
    const prop = await doQuery(
      "SELECT * FROM product_props WHERE id = ? AND color_id = ?",
      [data?.prop_id, data?.color_id]
    );
    if (!prop || !prop?.length) {
      return { status: 0, message: "Prop Not Found" };
    }

    let check_av = varients.filter(
      (item) =>
        parseInt(item?.color_id) == parseInt(data?.color_id) &&
        parseInt(item?.prop_id) == parseInt(data?.prop_id) &&
        parseInt(item?.prop_value_id) == parseInt(data?.prop_value_id)
    );
    // console.log(check_av, data?.quantity);

    if (check_av && check_av?.length) {
      if (
        parseInt(data?.quantity) <= parseInt(check_av[0]?.remainig_quantity)
      ) {
        let old_price = parseFloat(check_av[0]?.old_price);

        let product_price = parseFloat(check_av[0]?.new_price);
        let product_total_price =
          check_av[0]?.new_price * parseInt(data?.quantity);
        let tax_price =
          data?.store == "uae" ? 5 : data?.store == "ksa" ? 15 : null;

        let grand_price_without_tax =
          product_total_price + parseFloat(data?.shipping_price);
        let grand_price_with_tax =
          product_total_price +
          product_total_price * (tax_price * (1 / 100)) +
          parseFloat(data?.shipping_price);

        const insertedDataObject = {
          product_label: product[0]?.title,
          product_label_ar: product[0]?.title_ar,
          product_id: offers[0]?.product_id,
          shipping_id: data?.shipping_id,
          shipping_time: data?.shipping_time,
          shipping_price: data?.shipping_price,
          color_id: data?.color_id,
          shipping_id: data?.shipping_id,
          user_id: data?.user_id,
          props_ids: data?.prop_id,
          props_value_ids: data?.prop_value_id,
          quantity: data?.quantity,
          payment_method: data?.payment_method,
          address: data?.address,
          old_price,
          product_price,
          product_total_price,
          grand_price_without_tax,
          grand_price_with_tax,
        };
        const insertOrder = await doQuery(
          "INSERT INTO orders " +
            "(product_label, product_id, shipping_time, shipping_price, color_id, user_id, props_ids, " +
            "props_value_ids, product_price, quantity, payment_method, " +
            "address, product_total_price,old_price, grand_price, grand_price_without_tax, shipping_id, store, from_offer, offer_id,  userName, userImage, userHash, userLevel, status, tracking_id,shippment_id) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?, ?,?,?)",
          [
            insertedDataObject.product_label,
            insertedDataObject.product_id,
            insertedDataObject.shipping_time,
            insertedDataObject.shipping_price,
            insertedDataObject.color_id,
            insertedDataObject.user_id,
            insertedDataObject.props_ids,
            insertedDataObject.props_value_ids,
            insertedDataObject.product_price,
            insertedDataObject.quantity,
            insertedDataObject.payment_method,
            data?.address,
            product_total_price,
            old_price,
            insertedDataObject.grand_price_with_tax,
            insertedDataObject.grand_price_without_tax,
            12,
            data?.store,
            1,
            offers[0]?.id,
            data?.userName,
            data?.userImage,
            data?.userHash,
            data?.userLevel,
            data?.status,
            data?.shippment_id ? data?.shippment_id : null,
            data?.tracking_id ? data?.tracking_id : null,
          ]
        );

        if (product[0]?.isReturned) {
          const update = await doQuery(
            "Update orders SET isReturned = ? WHERE id = ?",
            [1, insertOrder?.insertId]
          );
        }

        if (insertOrder?.affectedRows) {
          try {
            if (offers[0]?.isTendered) {
              await doQuery(
                "UPDATE offers SET success = ?, notes = ? WHERE id = ?",
                [
                  1,
                  data?.userName + " -- succeeded in purchasing the offer",
                  offers[0]?.id,
                ]
              );
            }
          } catch (e) {
            cobsole.log(e);
          }
          return {
            status: 1,
            message: "Succefully",
            orderId: insertOrder?.insertId,
          };
        } else {
          return { status: 0, message: "Failed" };
        }
      } else {
        return { status: 0, message: "Quantity Not Available" };
      }
    } else {
      if (!check_av || !check_av?.length) {
        return { status: 0, message: "Offer Not Found" };
      }
    }
  }

  async stopOffer(data) {
    const offer = await doQuery("SELECT * FROM offers WHERE id = ?", [
      data?.offer_id,
    ]);
    if (!offer || !offer?.length) {
      return { status: 0, message: "Offer Not Found" };
    }
    const update = await doQuery(
      `UPDATE offers
      SET will_av_after = DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY),
          will_av_for = DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), stopped = 1 WHERE id = ?`,
      [data?.offer_id]
    );
    if (update?.changedRows) {
      return { status: 1, message: "Offer Editted" };
    } else {
      return { status: 0, message: "Offer Not Editted" };
    }
  }

  async notifyMe(data) {
    const offers = await doQuery("SELECT * FROM offers WHERE id = ?", [
      data?.offer_id,
    ]);

    if (!offers || !offers?.length) {
      return { status: 0, message: "Offer Not Found" };
    }

    const notifyDate = offers[0]?.will_av_after;

    await doQuery(
      "INSERT INTO notifyOffer (userId, offerId, notifyDate, text) VALUES (?, ?, ?, ?)",
      [
        data?.user_id,
        data?.offer_id,
        notifyDate,
        "The Offer Number #" +
          offers[0]?.id +
          "  is Available Go To Explore This Offer..!",
      ]
    );

    const scheduledDate = new Date(notifyDate);
    const cronSchedulePattern = `${scheduledDate.getMinutes()} ${scheduledDate.getHours()} ${scheduledDate.getDate()} ${
      scheduledDate.getMonth() + 1
    } *`;

    // Schedule the job to run only once on the specified date and time.
    cron.schedule(
      cronSchedulePattern,
      async () => {
        // Your job logic here
        await doQuery(
          "INSERT INTO `notifies` ( `user_id`, `text`, `link`) VALUES (?,?,?)",
          [
            data?.user_id,
            "The Offer Number #" +
              offers[0]?.id +
              " Are Be Available Go To Explore This Offer..!",
            "/otherof",
          ]
        );
        pusher.trigger("my-channel", "my-event", {
          message: "hello world",
        });
      },
      {
        scheduled: true, // Start scheduling immediately
        timezone: "UTC", // Set the timezone (adjust as needed)
      }
    );

    return { status: 1, message: "We Will Notify You, Thanks!" };
  }
};
