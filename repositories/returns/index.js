const doQuery = require("../../config/doQuery");
const Get_Order_Details = require("../order");
const pusher = require("../../pusher");
const get_Order_Details = new Get_Order_Details();
const Group = require("../../functions/groupProducts");
module.exports = class {
  constructor() { }

  async add(data) {
    // const user = await doQuery("SELECT * FROM user WHERE id = ?", [
    //   data?.user_id
    // ]);
    // if (!user || !user?.length) {
    //   return { status: 0, message: "User Not Found" };
    // }
    const order = await doQuery("SELECT * FROM orders WHERE id = ?", [
      data?.order_id,
    ]);

    const parsedDate = new Date(order[0]?.returnEndedAt);
    const currentDate = new Date();

    if (
      order[0]?.returnEndedAt &&
      (!order ||
        !order.length ||
        !parseInt(order[0]?.isReturned) ||
        parsedDate < currentDate)
    ) {
      return { status: 0, message: "Order Not Found Or Returned Period Ended" };
    }
    if (order[0]?.status == "returned") {
      return { status: 0, message: "Order Has Returned" };
    }
    if (parseInt(data?.quantity) > parseInt(order[0]?.quantity)) {
      return { status: 0, message: "Quantity Not Available" };
    }

    const getReturnPrice =
      parseInt(order[0]?.product_price) * parseInt(data?.quantity);
    const getProduct = await doQuery("SELECT * FROM product WHERE id = ?", [
      order[0]?.product_id,
    ]);

    if (!getProduct || !getProduct.length) {
      return { status: 0, message: "Product Not Found" };
    }

    if (!getProduct[0]?.isReturned) {
      return { status: 0, message: "Product Not Refundable" };
    }
    // console.log("order", order);
    const add = await doQuery(
      "INSERT INTO returns SET prop_id=?,prop_value_id=?, order_id = ?,	quantity =?,	price =?,	imageLink=?,	return_reason_id=?,	reason=?,	user_id=?,	product_id	=?, color_id=?, userName=?, userImage=?, userHash=?, userLevel=?",
      [
        order[0]?.props_ids,
        order[0]?.props_value_ids,
        data?.order_id,
        data?.quantity,
        getReturnPrice,
        data?.imageLink,
        data?.return_reason_id,
        data?.reason,
        data?.user_id,
        order[0]?.product_id,
        order[0]?.color_id,
        order[0]?.userName,
        order[0]?.userImage,
        order[0]?.userHash,
        order[0]?.userLevel,
      ]
    );
    // console.log(add);

    if (add?.affectedRows) {
      return { status: 1, message: "Return Produced" };
    } else {
      return { status: 0, message: "Return Error" };
    }
  }
  async updateStatus(data) {
    const statuses = ["approved", "rejected"];
    // if (!statuses?.includes(data?.status)) {
    //   return {
    //     status: 0,
    //     message: "Can not Update status shuold be on of [rejected, approved]",
    //   };
    // }

    // const user = await doQuery("SELECT * FROM user WHERE id = ?", [
    //   data?.user_id,
    // ]);
    // if (!user || !user?.length) {
    //   return { status: 0, message: "User Not Found" };
    // }
    const getReturn = await doQuery("SELECT * FROM returns WHERE id = ?", [
      data?.return_id,
    ]);

    // if (getReturn[0]?.status != "pending") {
    //   return {
    //     status: 0,
    //     message:
    //       "Can not Update because current status is " + getReturn[0]?.status,
    //   };
    // }

    const order = await doQuery("SELECT * FROM orders WHERE id = ?", [
      getReturn[0]?.order_id,
    ]);

    if (!order || !order.length) {
      return { status: 0, message: "Order Not Found" };
    }
    // console.log(
    //   parseInt(order[0]?.product_total_price) - parseInt(getReturn[0]?.price) >
    //     0
    // );
    if (
      !(parseInt(order[0]?.quantity) > 0) &&
      data?.status == "Return Confirmed"
    ) {
      return { status: 0, message: "Quantity Not Allowed" };
    }

    let updateStatus = false;
    if (data?.status == "Return Confirmed") {
      const offer = await doQuery("SELECT * FROM offers WHERE id =?", [
        order[0]?.offer_id,
      ]);
      if (!offer || !offer?.length) {
        return { status: 0, message: "Offer Not Available" };
      }
      // console.log(getReturn);
      const colors = await doQuery("SELECT * FROM colors WHERE id =?", [
        getReturn[0]?.color_id,
      ]);

      if (!colors || !colors?.length) {
        return { status: 0, message: "Color Not Available" };
      }

      const product_props = await doQuery(
        "SELECT * FROM product_props WHERE id =?",
        [getReturn[0]?.prop_id]
      );
      if (!product_props || !product_props?.length) {
        return { status: 0, message: "Prop Not Available" };
      }
      const product_props_value = await doQuery(
        "SELECT * FROM product_props_value WHERE id =?",
        [getReturn[0]?.prop_value_id]
      );
      if (!product_props_value || !product_props_value?.length) {
        return { status: 0, message: "Prop value Not Available" };
      }
      let varients = JSON.parse(offer[0]?.varients);
      let check_av = varients.filter(
        (item) =>
          parseInt(item?.color_id) == parseInt(getReturn[0]?.color_id) &&
          parseInt(item?.prop_id) == parseInt(getReturn[0]?.prop_id) &&
          parseInt(item?.prop_value_id) == parseInt(getReturn[0]?.prop_value_id)
      );
      if (!check_av || !check_av?.length) {
        return { status: 0, message: "Offer Not Found" };
      }

      updateStatus = await doQuery(
        "UPDATE returns SET status = ? WHERE id = ?",
        [data?.status, data?.return_id]
      );
      if (updateStatus?.changedRows) {
        const newOrderQuantity =
          parseInt(order[0]?.quantity) - parseInt(getReturn[0]?.quantity);

        let product_total_price =
          order[0]?.product_total_price - getReturn[0]?.price;
        let tax_price =
          order[0]?.store == "uae" ? 5 : order[0]?.store == "ksa" ? 15 : null;

        let grand_price_without_tax =
          product_total_price + parseFloat(order[0]?.shipping_price);
        let grand_price_with_tax =
          product_total_price +
          product_total_price * (tax_price * (1 / 100)) +
          parseFloat(order[0]?.shipping_price);
        // console.log(
        //   newOrderQuantity,
        //   product_total_price,
        //   tax_price,
        //   grand_price_without_tax,
        //   grand_price_with_tax
        // );

        let varients_choosed = JSON.parse(offer[0]?.varients)?.filter(
          (o_item) =>
            parseInt(o_item?.color_id) == parseInt(getReturn[0]?.color_id) &&
            parseInt(o_item?.prop_id) == parseInt(getReturn[0]?.prop_id) &&
            parseInt(o_item?.prop_value_id) ==
            parseInt(getReturn[0]?.prop_value_id)
        );
        if (
          parseInt(varients_choosed[0]?.remainig_quantity) +
          parseInt(getReturn[0]?.quantity) <=
          varients_choosed[0]?.av_quantity
        ) {
          varients_choosed[0].remainig_quantity =
            parseInt(varients_choosed[0]?.remainig_quantity) +
            parseInt(getReturn[0]?.quantity);
        }
        let remainVars = JSON.parse(offer[0]?.varients)?.filter(
          (o_item) =>
            parseInt(o_item?.color_id) !== parseInt(order[0]?.color_id) ||
            parseInt(o_item?.prop_id) !== parseInt(order[0]?.props_ids) ||
            parseInt(o_item?.prop_value_id) !==
            parseInt(order[0]?.props_value_ids)
        );
        remainVars.push(varients_choosed[0]);
        remainVars = JSON.stringify(remainVars);
        // console.log(order[0].status);
        if (order[0].status == "delivered") {
          //    هنا هيتم تعديل الأسعار وتعديل الاستوك وغيره ف الأوردر والعرض
          await doQuery(
            "UPDATE orders SET" +
            "	quantity = ?, product_total_price = ?, grand_price = ?, grand_price_without_tax = ? WHERE id = ?",
            [
              newOrderQuantity,
              product_total_price,
              grand_price_with_tax,
              grand_price_without_tax,
              order[0]?.id,
            ]
          );
          if (offer[0]?.group_id && order[0].status == "delivered") {
            const update = await doQuery(
              "UPDATE offers SET varients=? WHERE group_id = ?",
              [remainVars, offer[0]?.group_id]
            );
            // console.log("update", update);
          } else if (!offer[0]?.group_id && order[0].status == "delivered") {
            const update = await doQuery(
              "UPDATE offers SET varients=? WHERE id = ?",
              [remainVars, offer[0]?.id]
            );
            // console.log("update", update);
          }
          if (newOrderQuantity <= 0) {
            // حالة العرض تتغير إلى مرتجع
            const returnOrder = await doQuery(
              "UPDATE orders SET status = ? WHERE id = ?",
              ["returned", order[0]?.id]
            );
            // console.log("returnOrder", returnOrder);
          }
        } else {
          // هنا فقط هيتم تعديل الاستوك ف الأوردر والسعر ف الاوردر
          await doQuery(
            "UPDATE orders SET" +
            "	quantity = ?, product_total_price = ?, grand_price = ?, grand_price_without_tax = ? WHERE id = ?",
            [
              newOrderQuantity,
              product_total_price,
              grand_price_with_tax,
              grand_price_without_tax,
              order[0]?.id,
            ]
          );
          if (newOrderQuantity <= 0) {
            // حالة العرض تتغير إلى مرتجع
            const returnOrder = await doQuery(
              "UPDATE orders SET status = ? WHERE id = ?",
              ["returned", order[0]?.id]
            );
            // console.log("returnOrder", returnOrder);
          }
        }
      }
    } else {
      updateStatus = await doQuery(
        "UPDATE returns SET status = ? WHERE id = ?",
        [data?.status, data?.return_id]
      );
    }

    await doQuery(
      "INSERT INTO `notifies` ( `user_id`, `text`, `text_ar `link`) VALUES (?,?,?)",
      [
        order[0]?.user_id,
        "your returns for orderd # " +
        order[0]?.id +
        " has been Converted to " +
        data?.status +
        " check  your return history",
        ,
        "/orderlogs2",
        "طلب الاسترجاع للطلب رقم #" +
        order[0]?.id +
        " تم تغيير حالته إلى " +
        data?.status +
        "/orderlogs2",
      ]
    );

    pusher.trigger("my-channel", "my-event", {
      message: "hello world",
    });
    if (updateStatus?.changedRows) {
      return { status: 1, message: "Status Changed" };
    } else {
      return { status: 0, message: "Status Error" };
    }
  }
  async getReturns(data) {
    // const user = await doQuery("SELECT * FROM user WHERE id = ?", [
    //   data?.user_id,
    // ]);
    // if (!user || (!user?.length && data?.type != "admin")) {
    //   return { affectedRows: 0, message: "User Not Found" };
    // }
    let getReturn = [];

    if (data?.type == "admin") {
      getReturn = await doQuery(
        "SELECT * FROM returns ORDER BY createdAt DESC"
      );
    } else {
      getReturn = await doQuery(
        "SELECT * FROM returns WHERE user_id = ? ORDER BY createdAt DESC",
        [data?.user_id]
      );
    }

    if (!getReturn || !getReturn.length) {
      return { status: 0, message: "Return Not Found" };
    }
    await Promise.all(
      getReturn?.map(async (item) => {
        let {
          order,
          product,
          colors,
          images,
          customerReviews,
          props,
          props_values,
          shipping,
        } = await get_Order_Details.getOrderDetails(
          data?.type == "admin" ? item?.user_id : data?.user_id,
          item?.order_id
        );

        let products = product;
        Group({
          products,
          colors: colors ? colors : [],
          images: images ? images : [],
          customerReviews: customerReviews ? customerReviews : [],
          props: props ? props : [],
          props_values: props_values ? props_values : [],
        });
        // console.log("order",products);

        if (order && order.length) {
          order[0].products = products;
          order[0].shipping = shipping;
        }

        if (order && order.length) {
          item.order = order[0];
        } else {
          return;
        }
      })
    );

    return { status: 1, message: getReturn };
  }
};
