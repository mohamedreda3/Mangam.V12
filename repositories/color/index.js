const doQuery = require("../../config/doQuery");

module.exports = class {
  constructor() {}
  async add_color(data) {
    const add_color = await doQuery(
      "INSERT INTO colors (product_id, color_code, color, color_ar, images) VALUES (?, ?, ?, ?, ?)",
      [
        data?.product_id,

        data?.color_code,
        data?.color,
        data?.color_ar,
        data?.images,
      ]
    );

    let images = data?.images?.split("***");
    const color_id = add_color?.insertId;
    images?.map(async (item) => {
      await doQuery(
        "INSERT INTO images (product_id, link, color_id) VALUES (?, ?, ?)",
        [data?.product_id, item, color_id]
      );
    });

    return add_color;
  }

  async edit_color(data) {
    const colorOldData = await doQuery("SELECT * FROM colors WHERE id = ?", [
      data?.color_id,
    ]);

    if (!colorOldData || !colorOldData.length) {
      return { affectedRows: 0 };
    }
    let images = [];
    if (data?.images && data?.images?.length) {
      images = data?.images?.split("***");
    }
    if (data?.images && data?.images?.length) {
    const d =  await doQuery("DELETE FROM images WHERE color_id = ?", [data?.color_id]);
    // console.log(d);
    }
    // console.log(images);
    images?.map(async (item) => {
      // console.log(item);
      await doQuery(
        "INSERT INTO images (product_id, link, color_id) VALUES (?, ?, ?)",
        [data?.product_id, item, data?.color_id]
      );
    });

    const allImages = await doQuery("Select * from images WHERE color_id = ?", [
      data?.color_id,
    ]);
    // console.log(allImages);
    const update = await doQuery(
      "UPDATE colors SET color_code = ?, color = ?, color_ar = ?,images =?  WHERE id = ?",
      [

        data?.color_code ? data?.color_code : colorOldData[0]?.color_code,
        data?.color ? data?.color : colorOldData[0]?.color,

        data?.color_ar ? data?.color_ar : colorOldData[0]?.color_ar,
        allImages.join("***"),

        data?.color_id,
      ]
    );

    return update;
  }

  async make_offer(data) {
    const getProduct = await doQuery("SELECT * FROM product WHERE id = ?", [
      data?.product_id,
    ]);

    if (!getProduct || !getProduct.length) {
      return { status: 0, message: "Product Not Found" };
    }

    const getColor = await doQuery(
      "SELECT * FROM colors WHERE product_id = ? && id = ?",
      [data?.product_id, data?.color_id]
    );

    if (!getColor || !getColor.length) {
      return { status: 0, message: "Color Not Found" };
    }

    const add_offer = await doQuery(
      "UPDATE product SET will_av_after = ? , will_av_for = ? WHERE id = ?",
      [data?.time_av_after, data?.time_av_for, data?.product_id]
    );

    if (!add_offer.affectedRows) {
      return { status: 0, message: "Offer Not Added" };
    }

    const add_offer_color = await doQuery(
      "UPDATE colors SET newPrice = ? WHERE product_id=? AND id = ?",
      [data?.newPrice, data?.product_id, data?.color_id]
    );
    if (!add_offer_color.affectedRows) {
      return { status: 0, message: "Offer Not Added" };
    } else {
      return { status: 1, message: "Offer Added" };
    }
  }

  async getProducts(data) {
    const colors = await doQuery("SELECT * FROM colors WHERE product_id = ?", [
      data?.product_id,
    ]);

    const products = await doQuery("SELECT * FROM product WHERE id = ?", [
      data?.product_id,
    ]);
    const images = await doQuery("SELECT * FROM images");
    return { colors, products, images };
  }
};
