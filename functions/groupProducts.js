const doQuery = require("../config/doQuery");
// let orders = [];
// Promise.all([doQuery("SELECT * FROM orders")]).then((results) => {
//   orders = results[0];

// });
module.exports = group = ({
  products,
  colors,
  images,
  customerReviews,
  props,
  props_values,
}) => {

  if (products && products.length) {
    products.map((item, index) => {
      // console.log(item);
      // item.purchaseExp = {};

      // let ltmangams = 0;
      // let gtemangams = 0;
      // let gtmangam = 0;
      // let smangam = 0;
      // let fmangam = 0;
      // let com = 0;
      // orders.map((ord_item) => {
      //   // console.log(ord_item);
      //   if (parseInt(ord_item?.product_id) == parseInt(item?.id)) {
      //     ++com;
      //     // console.log(ord_item?.user_level);
      //     if (parseInt(ord_item?.user_level) > 10) {
      //       ++gtmangam;
      //     } else if (parseInt(ord_item?.userLevel) >= 10) {
      //       ++gtemangams;
      //     } else if (parseInt(ord_item?.userLevel) < 10 && parseInt(ord_item?.userLeve) > 2) {
      //       ++ltmangams;
      //     } else if (parseInt(ord_item?.userLevel) == 2) {
      //       ++smangam;
      //     } else if (parseInt(ord_item?.userLevel) < 2) {
      //       ++fmangam;
      //     }
      //   }
      // });

      // item.purchaseExp = {
      //   ltmangams: (ltmangams / com) * 100,
      //   gtemangams: (gtemangams / com) * 100,
      //   gtmangam: (gtmangam / com) * 100,
      //   smangam: (smangam / com) * 100,
      //   fmangam: (fmangam / com) * 100,
      // };
      item.colors = [];
      item.grade = item?.grade;
      if (item && item.store && item.store.length) {
        item.store.split("***");
      }
      if (colors && colors?.length)
        colors?.map((c_item, c_index) => {
          if (c_item) {
            c_item.images = [];
            c_item.props = [];

            let arr_v = [];
            props?.map((pr_item, pr_index) => {
              if (pr_item?.color_id == c_item.id) {
                props_values.map((prv_item, prv_index) => {
                  if (prv_item?.prop_id == pr_item.id) {
                    arr_v.push(prv_item);
                  }
                });

                c_item?.props?.push({
                  label: pr_item.label,
                  label_ar: pr_item.label_ar,
                  id: pr_item.id,
                  color_id: c_item.id,
                  values: arr_v,
                });

                arr_v = [];
              }
            });

            if (item?.id == c_item?.product_id) {
              item.colors.push(c_item);
            }

            images?.map((i_item, i_index) => {
              if (c_item?.id == i_item?.color_id) {
                c_item.images.push(i_item);
              }
            });
          }
        });

      item.customerReviews = [];
      if (customerReviews && customerReviews?.length)

        customerReviews?.map((cr_item) => {
          if (item?.id == cr_item?.product_id) {
            item.customerReviews.push(cr_item);
          }
        });

      let sum_f_v = 0;
      let sum_f_v_c = 0;
      let sum_t_f = 0;
      let sum_t_f_c = 0;
      let sum_t_t = 0;
      let sum_t_t_c = 0;
      let sum_o_t = 0;
      let sum_o_t_c = 0;
      let sum_z_t = 0;
      let sum_z_t_c = 0;
      let comulative = 0;

      if (item?.customerReviews && item?.customerReviews?.length) {
        item.customerReviews.map((item) => {
          comulative += parseFloat(item.rate);
          if (parseFloat(item.rate) > 4 && parseFloat(item.rate) <= 5) {
            sum_f_v += parseFloat(item.rate);
            sum_f_v_c++;
          } else if (parseFloat(item.rate) > 3 && parseFloat(item.rate) <= 4) {
            sum_t_f += parseFloat(item.rate ? item.rate : 0);
            sum_t_f_c++;
          } else if (parseFloat(item.rate) > 2 && parseFloat(item.rate) <= 3) {
            sum_t_t += parseFloat(item.rate ? item.rate : 0);
            sum_t_t_c++;
          } else if (parseFloat(item.rate) > 1 && parseFloat(item.rate) <= 2) {
            sum_o_t += parseFloat(item.rate ? item.rate : 0);
            sum_o_t_c++;
          } else if (parseFloat(item.rate) > 0 && parseFloat(item.rate) <= 1) {
            sum_z_t += parseFloat(item.rate ? item.rate : 0);
            sum_z_t_c++;
          }
        });
      }

      item.posRates = {
        s5:
          (sum_f_v_c / item.customerReviews.length) * 100
            ? (sum_f_v_c / item.customerReviews.length) * 100
            : 0,
        s4:
          (sum_t_f_c / item.customerReviews.length) * 100
            ? (sum_t_f_c / item.customerReviews.length) * 100
            : 0,
        s3:
          (sum_t_t_c / item.customerReviews.length) * 100
            ? (sum_t_t_c / item.customerReviews.length) * 100
            : 0,
        s2:
          (sum_o_t_c / item.customerReviews.length) * 100
            ? (sum_o_t_c / item.customerReviews.length) * 100
            : 0,
        s1:
          (sum_z_t_c / item.customerReviews.length) * 100
            ? (sum_z_t_c / item.customerReviews.length) * 100
            : 0,
      };
      item.comRates = {
        comulative:
          (comulative / (item.customerReviews.length * 5)) * 100
            ? (comulative / (item.customerReviews.length * 5)) * 100
            : 0,
        comulativeRate: parseFloat(
          comulative / item.customerReviews.length
        ).toFixed(1)
          ? parseFloat(comulative / item.customerReviews.length).toFixed(1)
          : 0,
      };

      item.images = item?.colors[0]?.images;
      item.color_id = item?.colors[0]?.id;
      item.color_title = item?.colors[0]?.color;
      item.discount = item?.colors[0]?.discount;
      item.price = item?.colors[0]?.price;
      // item.available_quantity = item?.colors[0]?.available_quantity;
    });
  } else {
    products = [];
  }
  products.map((pro_item) => {
    pro_item.possibilities = [];
    pro_item.store = pro_item?.store?.split("***");
    // console.log(pro_item?.colors);
    return pro_item?.colors?.map((c_item) => {
      return c_item?.props?.map((p_item) => {
        return p_item?.values?.map((pv_item) => {
          pro_item.possibilities.push({
            color_id: c_item?.id,
            prop_value_id: pv_item?.id,
            prop_id: p_item?.id,
            color_label: c_item?.color,
            prop_value_label: pv_item?.label,
            color_label_ar: c_item?.color_ar,
            prop_value_label_ar: pv_item?.label_ar,
            stock: pv_item?.stock,
            remainig_stock: pv_item?.remainig_stock,
            old_price: pv_item?.old_price,
            new_price: pv_item?.new_price,
          });
        });
      });
    });
  });
  // products.possibilities.push(pos);
  return products;
};
