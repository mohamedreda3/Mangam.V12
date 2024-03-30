const doQuery = require("../../config/doQuery");
const groupProducts = require("../../functions/groupProducts");
const moment = require("moment/moment");
const pusher = require("../../pusher");

module.exports = class {
  constructor() {}

  async getOrderDetails(id, order_id) {
    let getOrderDetails = await doQuery(
      "SELECT * FROM orders WHERE user_id = ? AND id = ?",
      [id, order_id]
    );
    // console.log(id, order_id);
    if (!getOrderDetails || !getOrderDetails.length) {
      return { changedRows: 0 };
    }

    // const userData = await doQuery("SELECT * FROM user WHERE id = ?", [
    //   getOrderDetails[0].user_id,
    // ]);
    const OrderReviews = await doQuery(
      "SELECT * FROM order_reviews WHERE order_id = ?",
      [getOrderDetails[0].id]
    );
    let getOrder = [
      {
        id: getOrderDetails[0].id,
        product_id: getOrderDetails[0].product_id,
        product_label: getOrderDetails[0].product_label,
        color_id: getOrderDetails[0].color_id,
        new_price: getOrderDetails[0].product_price,
        old_price: getOrderDetails[0].old_price,
        product_total_price: getOrderDetails[0].product_total_price,
        shipping_id: getOrderDetails[0].shipping_id,
        shipping_time: getOrderDetails[0].shipping_time,
        shipping_price: getOrderDetails[0].shipping_price,
        grand_price: getOrderDetails[0].grand_price,
        grand_price_without_tax: getOrderDetails[0].grand_price_without_tax,
        quantity: getOrderDetails[0].quantity,
        address: getOrderDetails[0].address,
        payment_method: getOrderDetails[0].payment_method,
        status: getOrderDetails[0].status,
        createdAt: getOrderDetails[0].createdAt,
        store: getOrderDetails[0].store,
        props_price: getOrderDetails[0].props_price,
        OrderReviews,
        payementId: getOrderDetails[0].payementId,
        userName: getOrderDetails[0]?.userName,
        userImage: getOrderDetails[0]?.userImage,
        userHash: getOrderDetails[0]?.userHash,
        userLevel: getOrderDetails[0]?.userLevel,
        userId: getOrderDetails[0]?.user_id,
        // userData: {
        //   name: userData[0]?.name,
        //   type: userData[0]?.type,
        //   id: userData[0]?.id,
        //   email: userData[0]?.email,
        //   phone: userData[0]?.phone,
        //   avatar: userData[0]?.avatar,
        // },
      },
    ];

    const getProduct = await doQuery(
      "SELECT product.*, category.title as category_name , category.title_ar as category_name_ar FROM product JOIN category ON product.category_id = category.id WHERE product.id = ?",
      [getOrder[0]?.product_id]
    );
    const colors = await doQuery("SELECT * FROM colors WHERE id = ?", [
      getOrder[0]?.color_id,
    ]);
    const shipping = await doQuery(
      "SELECT shipping.title as shipping_title, shipping.title_ar as shipping_title_ar FROM shipping WHERE id = ?",
      [getOrder[0]?.shipping_id]
    );

    let props = [];
    let props_values = [];
    await Promise.all(
      getOrderDetails[0]?.props_ids?.split("/")?.map(async (item) => {
        let propsArr = await doQuery(
          "SELECT * FROM product_props WHERE id = ?",
          [item]
        );
        props.push(...propsArr);
      })
    );

    await Promise.all(
      getOrderDetails[0]?.props_value_ids?.split("/")?.map(async (v_item) => {
        let props_v = await doQuery(
          "SELECT * FROM product_props_value WHERE id =?",
          [v_item]
        );

        props_values.push(...props_v);
      })
    );
    const images = await doQuery("SELECT * FROM images");
    const customerReviews = await doQuery("SELECT * FROM customer_reviews");

    return {
      order: getOrder,
      product: getProduct,
      colors,
      images,
      customerReviews,
      props,
      shipping,
      props_values,
    };
  }

  async fetchProps(propsIds) {
    const props = [];
    if (!propsIds) return props;

    await Promise.all(
      propsIds.map(async (item) => {
        const propsArr = await doQuery(
          "SELECT * FROM product_props WHERE id = ?",
          [item]
        );
        props.push(...propsArr);
      })
    );

    return props;
  }

  async fetchPropsValues(propsValueIds) {
    const propsValues = [];
    if (!propsValueIds) return propsValues;

    await Promise.all(
      propsValueIds.map(async (v_item) => {
        const props_v = await doQuery(
          "SELECT * FROM product_props_value WHERE id =?",
          [v_item]
        );
        propsValues.push(...props_v);
      })
    );

    return propsValues;
  }

  async getAll(id, { type }) {
    const queryParams = [id];
    let query;

    if (type === "admin") {
      query =
        "SELECT orders.id as order_id,orders.createdAt as createAt,orders.*, offers.*, product.*, category.title as category_name, category.title_ar as category_name_ar, colors.*, shipping.title as shipping_title, shipping.title_ar as shipping_title_ar FROM orders JOIN offers ON orders.offer_id = offers.id JOIN product ON orders.product_id = product.id JOIN category ON product.category_id = category.id JOIN colors ON orders.color_id = colors.id JOIN shipping ON orders.shipping_id = shipping.id ORDER BY orders.createdAt DESC";
    } else {
      query =
        "SELECT orders.id as order_id,orders.createdAt as createAt, orders.*, offers.*, product.*, product.grade, category.title as category_name, category.title_ar as category_name_ar, colors.*, shipping.title as shipping_title, shipping.title_ar as shipping_title_ar FROM orders JOIN offers ON orders.offer_id = offers.id JOIN product ON orders.product_id = product.id JOIN category ON product.category_id = category.id JOIN colors ON orders.color_id = colors.id JOIN shipping ON orders.shipping_id = shipping.id WHERE orders.user_id = ? ORDER BY orders.createdAt DESC";
    }


    const getOrderDetails = await doQuery(query, queryParams);
    if (!getOrderDetails || !getOrderDetails.length) {
      return { order: [] };
    }

    const orderIds = getOrderDetails.map((item) => item.order_id);
    getOrderDetails.map((item) => JSON.parse(item.varients));

    const [images, customerReviews, orderReviews, propsArr, propsValues] =
      await Promise.all([
        doQuery("SELECT * FROM images"),
        doQuery("SELECT * FROM customer_reviews"),
        doQuery("SELECT * FROM order_reviews WHERE order_id IN (?)", [
          orderIds,
        ]),
        doQuery("SELECT * FROM product_props WHERE id IN (?)", [orderIds]),
        doQuery("SELECT * FROM product_props_value WHERE id IN (?)", [
          orderIds,
        ]),
      ]);



    const colors = await doQuery("SELECT * FROM colors WHERE id IN (?)", [
      getOrderDetails.map((item) => item.color_id),
    ]);

    const shippingInfo = await doQuery(
      "SELECT * FROM shipping WHERE id IN (?)",
      [getOrderDetails.map((item) => item.shipping_id)]
    );

    const orders = await Promise.all(
      getOrderDetails.map(async (item) => {
        // console.log(item);
        const offer = {
          id: item.offer_id,
          product_id: item.product_id,
          store: item.store.split("***"),
          varients: JSON.parse(item.varients),
        };



        const product = {
          id: item.product_id,
          category_name: item.category_name,
          category_name_ar: item.category_name_ar,
          producing_company: item?.producing_company,
        grade: item?.grade
          // Include other product properties here
        };



        const color = colors?.find((color) => color.id === item.color_id);

        const shipping = shippingInfo?.find(
          (shipping) => shipping.id === item.shipping_id
        );

        const orderReview = orderReviews?.filter(
          (review) => review?.order_id === item.id
        );

        const props = propsArr?.filter((prop) =>
          item.props_ids.includes(prop.id.toString())
        );

        const props_values = propsValues?.filter((prop_value) =>
          item?.props_value_ids?.includes(prop_value.id.toString())
        );

        const products = [product];
        await groupProducts({
          products,
          colors: colors ? colors : [],
          images: images ? images : [],
          customerReviews: customerReviews ? customerReviews : [],
          props: props ? props : [],
          props_values: props_values ? props_values : []
        });
        
        return {
          offer,
          id: item.order_id,
          product_id: item.product_id,
          product_label: item.product_label,
          color_id: item.color_id,
          total_price: item.total_price,
          shipping_id: item.shipping_id,
          shipping_time: item.shipping_time,
          shipping_price: item.shipping_price,
          grand_price: item.grand_price,
          old_price: item.old_price,
          new_price: item.product_price,
          grand_price_without_tax: item.grand_price_without_tax,
          product_total_price: item.product_total_price,
          createdAt: item.createAt,
          quantity: item.quantity,
          address: item.address,
          payment_method: item.payment_method,
          store: item.store,
          status: item.status,
          is_offer: item.from_offer,
          offer_id: item.offer_id,
          shipping,
          products,
          OrderReviews: orderReview,
          payementId: item.payementId,
          userName: item.userName,
          userImage: item.userImage,
          userHash: item.userHash,
          userLevel: item.userLevel,
          userId: item.user_id,
          props_ids: getOrderDetails?.props_ids,
          props_value_ids: getOrderDetails?.props_value_ids,
        };
      })
    );
    // console.log("getOrderDetails", orders);

    return { order: orders };
  }

  async changeStatus(data) {
    const { id, status } = data;
    const statuses = ["on_way", "pending", "completed", "canceled"];
    const order = await doQuery("SELECT * FROM orders WHERE id = ?", [id]);
    if (!order || !order.length) {
      return { changedRows: 0 };
    }

    const product = await doQuery("SELECT * FROM product WHERE id = ?", [
      order[0]?.product_id,
    ]);

    if (!product && !product.length) {
      return { changedRows: 0 };
    }

    if (order[0]?.status == "returned" || order[0]?.status == "delivered") {
      return { changedRows: 0 };
    }
    let update = {};

    update = await doQuery("Update orders SET status = ? WHERE id = ?", [
      status,
      id,
    ]);

    // update.changedRows &&
    if (update.changedRows && status == "delivered") {
      let offer = await doQuery("SELECT * FROM offers WHERE id = ?", [
        order[0]?.offer_id,
      ]);
      let store = order[0].store.split("***");
      let varients = JSON.parse(offer[0]?.varients);
      const getProduct = await doQuery(
        "SELECT product.*, category.title as category_name , category.title_ar as category_name_ar FROM product JOIN category ON product.category_id = category.id WHERE product.id = ?",
        [offer[0]?.product_id]
      );

      const colors = await doQuery("SELECT * FROM colors WHERE id = ?", [
        order[0]?.color_id,
      ]);

      let varients_choosed = JSON.parse(offer[0]?.varients)?.filter(
        (o_item) =>
          o_item?.color_id == order[0]?.color_id &&
          o_item?.prop_id == order[0]?.props_ids &&
          o_item?.prop_value_id == order[0]?.props_value_ids
      );

      if (
        parseInt(order[0]?.quantity) <=
          parseInt(varients_choosed[0]?.remainig_quantity) &&
        parseInt(varients_choosed[0]?.remainig_quantity) -
          parseInt(order[0]?.quantity) >=
          0
      ) {
        varients_choosed[0].remainig_quantity =
          parseInt(varients_choosed[0]?.remainig_quantity) -
          parseInt(order[0]?.quantity);

        const remainVars = JSON.parse(offer[0]?.varients)?.filter(
          (o_item) =>
            parseInt(o_item?.color_id) !== parseInt(order[0]?.color_id) ||
            parseInt(o_item?.prop_id) !== parseInt(order[0]?.props_ids) ||
            parseInt(o_item?.prop_value_id) !==
              parseInt(order[0]?.props_value_ids)
        );

        remainVars.push(varients_choosed[0]);

        // const convertedString = remainVars.map((obj) => {
        //   return `${obj.color_id}*${obj.prop_id}*${obj.prop_value_id}*${obj.av_quantity}*${obj.old_price}*${obj.new_price}`;
        // }).join('***');

        if (offer[0]?.group_id) {
          await doQuery("UPDATE offers SET varients=? WHERE group_id = ?", [
            JSON.stringify(remainVars),
            offer[0]?.group_id,
          ]);
        } else {
          await doQuery("UPDATE offers SET varients=? WHERE id = ?", [
            JSON.stringify(remainVars),
            offer[0]?.id,
          ]);
        }
      }

      if (order[0]?.isReturned) {
        const futureDate = new Date(
          Date.now() + parseInt(product[0]?.return_period) * 24 * 60 * 60 * 1000
        );
        const formattedDateTime = `${futureDate.getFullYear()}-${(
          futureDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${futureDate
          .getDate()
          .toString()
          .padStart(2, "0")} ${futureDate
          .getHours()
          .toString()
          .padStart(2, "0")}:${futureDate
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${futureDate
          .getSeconds()
          .toString()
          .padStart(2, "0")}`;

        await doQuery("UPDATE orders SET returnEndedAt = ? WHERE id = ?", [
          formattedDateTime,
          order[0]?.id,
        ]);
      }
    }

    await doQuery(
      "INSERT INTO `notifies` ( `user_id`, `text`, `link`, `text_ar`) VALUES (?,?,?, ?) ORDER BY created_at DESC",
      [
        order[0]?.user_id,
        "your Order # " +
          order[0]?.id +
          " has been Converted to " +
          status +
          " check  your order history",
        "/orderlogs2",
        "الطلب رقم #" +
          order[0]?.id +
          " تم تغيير حالته إلى " +
          status +
          " افحص سجل الطلبات الخاص بك",
      ]
    );
    pusher.trigger("my-channel", "my-event", {
      message: "hello world",
    });

    return update;
  }

  async makeOrder(data) {
    // const user = await doQuery("SELECT * FROM user WHERE id = ?", [
    //   data?.user_id,
    // ]);
    // if (!user || !user?.length) {
    //   return { affectedRows: 0, message: "User Not Found" };
    // }
    const product = await doQuery(
      "SELECT * FROM product WHERE id = ? AND store = ?",
      [data?.product_id, data?.store]
    );
    if (!product || !product?.length) {
      return { affectedRows: 0, message: "Product Not Found in this store" };
    }

    const colors = await doQuery(
      "SELECT * FROM colors WHERE id = ? AND product_id = ?",
      [data?.color_id, data?.product_id]
    );
    if (!colors || !colors?.length) {
      return { affectedRows: 0, message: "Color Not Found" };
    }
    const colorsQuantity = await doQuery(
      "SELECT * FROM colors WHERE id = ? AND product_id = ?",
      [data?.color_id, data?.product_id]
    );
    if (!colorsQuantity || !colorsQuantity?.length) {
      return { affectedRows: 0, message: "Color Not Found" };
    }
    const props_ids = data?.props_ids?.split(",");
    let props = [];
    for (const item of props_ids) {
      const prop = await doQuery(
        "SELECT * FROM product_props WHERE id = ? AND color_id = ?",
        [item, data?.color_id]
      );

      if (prop && prop.length) {
        props.push(prop[0]);
      } else {
        props = [];
        break;
      }
    }
    if (!props || !props?.length) {
      return { affectedRows: 0, message: "Props Not Found" };
    }
    const props_value_ids = data?.props_value_ids?.split(",");
    let props_values = [];
    for (const v_item of props_value_ids) {
      let foundMatch = false;
      let arr = [];

      for (const item of props_ids) {
        const product_props_value = await doQuery(
          "SELECT * FROM product_props_value WHERE id = ? AND prop_id = ? AND remainingStock > ?",
          [v_item, item, data?.quantity]
        );

        const product_props_values = await doQuery(
          "SELECT * FROM product_props_value WHERE id = ? AND remainingStock > ?",
          [v_item, data?.quantity]
        );

        if (product_props_value && product_props_value.length) {
          foundMatch = true;
          arr.push(product_props_values[0]);
          break; // Break out of the inner loop once a match is found for this v_item
        } else if (!product_props_values || !product_props_values.length) {
          foundMatch = false;
          break; // Break out of the inner loop if no match is found for this v_item
        }
      }
      if (foundMatch && Object.keys(arr).length) {
        props_values.push(...arr);
      } else {
        props_values.length = 0; // Clear the props_values array
        break; // Break out of the outer loop if a match is not found for any v_item
      }
    }
    if (!props_values || !props_values?.length) {
      return {
        affectedRows: 0,
        message: "Props Values Not Found Or Quantity Not enough",
      };
    }
    const shipping = await doQuery("SELECT * FROM shipping WHERE id = ?", [
      data?.shipping_id,
    ]);
    if (!shipping || !shipping?.length) {
      return { affectedRows: 0, message: "shipping Not Found" };
    }

    if (
      !(
        moment(product.will_av_after).diff(moment()) <= 0 &&
        moment(product.will_av_for).diff(moment()) > 0
      )
    ) {
      colors[0].newPrice = colors[0]?.price;
    }

    const prop_ids = data?.props_ids
      ?.split(",")
      ?.map((item) => item)
      ?.join("/");
    const prop_value_ids = data?.props_value_ids
      ?.split(",")
      ?.map((item) => item)
      ?.join("/");

    const props_labels = props?.map((item) => item?.label)?.join("/");
    const props_price = props_values
      ?.map((item) => item?.plus_price)
      ?.join("/");

    const product_total_price = parseFloat(colors[0]?.price);
    const total_price =
      (product_total_price +
        props_price
          ?.split("/")
          ?.reduce((acc, curr) => acc + parseFloat(curr), 0)) *
      parseInt(data?.quantity);
    const grandPrice = total_price + parseFloat(data?.shipping_price);
    const grand_price_with_tax =
      data?.store == "uae"
        ? grandPrice + grandPrice * (5 / 100)
        : data?.store == "saudi_aribia"
        ? grandPrice + grandPrice * (15 / 100)
        : grandPrice;
    const insertedDataObject = {
      product_label: data?.product_label,
      product_id: data?.product_id,
      shipping_time: data?.shipping_time,
      shipping_price: data?.shipping_price,
      color_id: data?.color_id,
      shipping_id: data?.shipping_id,
      user_id: data?.user_id,
      props_ids: prop_ids,
      props_value_ids: prop_value_ids,
      props_label: props_labels,
      props_price: props_price,
      product_price: colors[0]?.price,
      quantity: data?.quantity,
      payment_method: data?.payment_method,
      address: data?.address,
      product_total_price,
      total_price,
      grandPrice,
      grand_price_with_tax,
    };

    const insertOrder = await doQuery(
      "INSERT INTO orders " +
        "(product_label, product_id, shipping_time, shipping_price, color_id, user_id, props_ids, " +
        "props_value_ids, props_label, props_price, product_price, quantity, payment_method, " +
        "address, product_total_price, total_price, grand_price, grand_price_with_discount, shipping_id, store) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        insertedDataObject.product_label,
        insertedDataObject.product_id,
        insertedDataObject.shipping_time,
        insertedDataObject.shipping_price,
        insertedDataObject.color_id,
        insertedDataObject.user_id,
        insertedDataObject.props_ids,
        insertedDataObject.props_value_ids,
        insertedDataObject.props_label,
        insertedDataObject.props_price,
        insertedDataObject.product_price,
        insertedDataObject.quantity,
        insertedDataObject.payment_method,
        insertedDataObject.address,
        product_total_price +
          props_price
            ?.split("/")
            ?.reduce((acc, curr) => acc + parseFloat(curr), 0),
        insertedDataObject.total_price,
        insertedDataObject.grandPrice,
        insertedDataObject.grand_price_with_tax,
        insertedDataObject?.shipping_id,
        product[0]?.store,
      ]
    );

    if (product[0]?.isReturned) {
      const update = await doQuery(
        "Update orders SET isReturned = ? WHERE id = ?",
        [1, insertOrder?.insertId]
      );
    }

    return insertOrder;
  }

  async rate(data) {
    const update = await doQuery(
      "INSERT INTO order_reviews(review, order_id, rate, user_id) VALUES(?,?,?,?) ",
      [data?.text, data?.order_id, data?.rate, data?.user_id]
    );
    return update;
  }

  async orderPayUpdating(data, res) {
    const orderPayUpdate = await doQuery(
      "UPDATE orders SET payementId = ? WHERE id = ?",
      [data.payementId, data.id]
    );

    res.send(orderPayUpdate);
  }

  async getNotification(req, res) {
    const notifies = await doQuery(
      "SELECT * FROM notifies WHERE user_id = ? ORDER BY notifies.created_at DESC",
      [req?.body?.user_id]
    );
    // console.log(notifies);
    res.send({
      status: 1,
      message: notifies,
    });
  }
};
