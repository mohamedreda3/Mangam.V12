const doQuery = require("../../config/doQuery");

module.exports = class {
  constructor() { }
  async getAll(req, res, type) {
    const products =
      type == "user"
        ? await doQuery(
          "SELECT product.*, category.title as category_name , category.title_ar as category_name_ar FROM product JOIN category ON product.category_id = category.id WHERE product.hidden = 0 ORDER BY createdAt DESC"
        )
        : type == "admin"
          ? await doQuery(
            "SELECT product.*, category.title as category_name , category.title_ar as category_name_ar FROM product JOIN category ON product.category_id = category.id ORDER BY createdAt DESC"
          )
          : null;

    const colors = await doQuery("SELECT * FROM colors");
    const images = await doQuery("SELECT * FROM images");
    const customerReviews = await doQuery("SELECT * FROM customer_reviews ORDER BY createdAt DESC");
    const props = await doQuery("SELECT * FROM product_props");
    const props_values = await doQuery("SELECT * FROM product_props_value");
    // products?.map((item) => (item.store.split("***")));

    return { products, colors, images, customerReviews, props, props_values };
  }

  async getProduct(product_id) {
    const products = await doQuery(
      "SELECT product.*, category.title as category_name , category.title_ar as category_name_ar FROM product JOIN category ON product.category_id = category.id WHERE product.id = ?",
      [product_id]
    );

    const colors = await doQuery("SELECT * FROM colors WHERE product_id = ?", [
      product_id,
    ]);

    const images = await doQuery("SELECT * FROM images WHERE product_id = ?", [
      product_id,
    ]);

    const customerReviews = await doQuery("SELECT * FROM customer_reviews  ORDER BY createdAt DESC");
    const props = await doQuery("SELECT * FROM product_props");
    const props_values = await doQuery("SELECT * FROM product_props_value");

    return { products, colors, images, customerReviews, props, props_values };
  }

  async searchProduct(token) {
    // console.log(token);
    const products = token?.startsWith("#")
      ? await doQuery(
        "SELECT product.*, category.title as category_name , category.title_ar as category_name_ar FROM product JOIN category ON product.category_id = category.id WHERE product.id = ?",
        [token?.split("#")[1]]
      )
      : await doQuery(
        "SELECT product.*, category.title as category_name , category.title_ar as category_name_ar FROM product JOIN category ON product.category_id = category.id WHERE product.title_ar LIKE ? OR product.title LIKE ?",
        ["%" + token + "%", "%" + token + "%"]
      );

    const colors = await doQuery("SELECT * FROM colors");
    // console.log(token);
    const images = await doQuery("SELECT * FROM images");

    const customerReviews = await doQuery("SELECT * FROM customer_reviews ORDER BY createdAt DESC");
    const props = await doQuery("SELECT * FROM product_props");
    const props_values = await doQuery("SELECT * FROM product_props_value");

    return { products, colors, images, customerReviews, props, props_values };
  }

  async getProductsByCategory(category_id) {
    const products = await doQuery(
      "SELECT * FROM product WHERE category_id = ? ORDER BY createdAt DESC",
      [category_id]
    );
    const colors = await doQuery("SELECT * FROM colors");
    const images = await doQuery("SELECT * FROM images");
    const customerReviews = await doQuery("SELECT * FROM customer_reviews ORDER BY createdAt DESC");

    const props = await doQuery("SELECT * FROM product_props");
    const props_values = await doQuery("SELECT * FROM product_props_value");
    if (!colors && !colors.length) {
      return {};
    }

    return { products, colors: colors ? colors : [], images: images ? images : [], customerReviews: customerReviews ? customerReviews : [], props: props ? props : [], props_values: props_values ? props_values : [] };
  }

  async updateHidden(data) {
    const update = await doQuery("Update product SET hidden = ? WHERE id = ?", [
      data?.status,
      data?.id,
    ]);
    return update;
  }

  async rate(data) {
    const update = await doQuery(
      "INSERT INTO customer_reviews(review, product_id, rate, user_id, userName, userImage) VALUES(?,?,?,?,?,?) ",
      [data?.text, data?.product_id, data?.rate, data?.user_id, data?.userName, data?.userImage]
    );
    // console.log(data);
    return update;
  }

  async add_product(data) {
    const add = await doQuery(
      "INSERT INTO product (category_id, title, description, model_number, producing_company, will_av_for, will_av_after, conditions, conditions_ar, title_ar, description_ar, isReturned, return_period,store, grade) VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?,?,?)",
      [
        data?.category_id,
        data?.title,
        data?.description,
        data?.model_number,
        data?.producing_company,
        "0000-00-00 00:00:00",
        "0000-00-00 00:00:00",
        data?.conditions,
        data?.conditions_ar,
        data?.title_ar,
        data?.description_ar,
        data?.isReturned,
        data?.return_period,
        data?.store,
        data?.grade
      ]
    );
    // console.log(add);
    return add;
  }

  async edit_product(data) {
    const productOldData = await doQuery("SELECT * FROM product WHERE id = ?", [
      data?.product_id,
    ]);

    if (!productOldData || !productOldData.length) {
      return { affectedRows: 0 };
    }

    const update = await doQuery(
      "UPDATE product SET category_id = ?, title = ?, description = ?, model_number = ?, producing_company = ?, will_av_for = ?, will_av_after = ?, conditions = ?, conditions_ar = ?, title_ar = ?, description_ar = ?,isReturned=?, return_period = ?, store=?, grade=? WHERE id = ?",
      [
        data?.category_id ? data?.category_id : productOldData[0]?.category_id,
        data?.title ? data?.title : productOldData[0]?.title,
        data?.description ? data?.description : productOldData[0]?.description,
        data?.model_number
          ? data?.model_number
          : productOldData[0]?.model_number,
        data?.producing_company
          ? data?.producing_company
          : productOldData[0]?.producing_company,
        data?.will_av_for ? data?.will_av_for : productOldData[0]?.will_av_for,
        data?.will_av_after
          ? data?.will_av_after
          : productOldData[0]?.will_av_after,
        data?.conditions ? data?.conditions : productOldData[0]?.conditions,
        data?.conditions_ar
          ? data?.conditions_ar
          : productOldData[0]?.conditions_ar,
        data?.title_ar ? data?.title_ar : productOldData[0]?.title_ar,
        data?.description_ar
          ? data?.description_ar
          : productOldData[0]?.description_ar,
        data?.isReturned ? data?.isReturned : productOldData[0]?.isReturned,
        data?.return_period
          ? data?.return_period
          : productOldData[0]?.return_period,
        data?.store ? data?.store : productOldData[0]?.store,
        data?.grade ? data?.grade : productOldData[0]?.grade,

        data?.product_id,
      ]
    );
    return update;
  }

  async getReviews(user_id, id) {
    const reviews = await doQuery(
      "SELECT * FROM customer_reviews WHERE product_id = ? ORDER BY createdAt DESC",
      [id]
    );
    // const user_data = await doQuery("SELECT * FROM user");
    return { reviews };
  }
};
